import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.K6_BASE_URL || __ENV.BASE_URL || 'http://localhost:8080';
const USER_TOKEN = __ENV.K6_USER_TOKEN;
const BOOKING_DATE = __ENV.K6_BOOKING_DATE;
const START_TIME = __ENV.K6_START_TIME;
const GUEST_COUNT = Number(__ENV.K6_GUEST_COUNT || 1);
const TARGET_VUS = Number(__ENV.K6_TARGET_VUS || 100);

const restaurantListDuration = new Trend('restaurant_list_duration', true);
const restaurantDetailDuration = new Trend('restaurant_detail_duration', true);
const availabilityDuration = new Trend('availability_duration', true);
const authenticatedDuration = new Trend('authenticated_duration', true);

export const options = {
    stages: [
        { duration: __ENV.K6_STAGE_1 || '1m', target: Math.max(1, Math.ceil(TARGET_VUS * 0.25)) },
        { duration: __ENV.K6_STAGE_2 || '2m', target: Math.max(1, Math.ceil(TARGET_VUS * 0.5)) },
        { duration: __ENV.K6_STAGE_3 || '2m', target: TARGET_VUS },
        { duration: __ENV.K6_STAGE_4 || '5m', target: TARGET_VUS },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1500', 'p(99)<3000'],
        restaurant_list_duration: ['p(95)<1000'],
        restaurant_detail_duration: ['p(95)<1500'],
    },
};

function responseData(response) {
    try {
        return response.json('data');
    } catch (_) {
        return null;
    }
}

function firstRestaurant(recommendedResponse, listResponse) {
    const recommended = responseData(recommendedResponse);
    if (Array.isArray(recommended) && recommended.length > 0) {
        return recommended[0];
    }

    const listPayload = responseData(listResponse);
    return listPayload?.data?.[0] || null;
}

function authParams(endpoint) {
    return {
        headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
        },
        tags: {
            endpoint,
            workload: 'production-like',
        },
    };
}

function pauseForBrowsing() {
    // VUs are concurrent users, not requests per second. These pauses model reading/navigation time.
    sleep(1 + Math.random() * 2);
}

export default function () {
    const homepageResponses = http.batch([
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/restaurants/recommended`,
            params: {
                tags: {
                    endpoint: 'restaurants-recommended',
                    workload: 'production-like',
                },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/restaurants?currentPage=1&pageSize=10`,
            params: {
                tags: {
                    endpoint: 'restaurants-list',
                    workload: 'production-like',
                },
            },
        },
    ]);

    const recommendedResponse = homepageResponses[0];
    const listResponse = homepageResponses[1];
    const restaurant = firstRestaurant(recommendedResponse, listResponse);

    check(recommendedResponse, {
        'homepage recommended status is 200': (response) => response.status === 200,
    });
    check(listResponse, {
        'homepage restaurant list status is 200': (response) => response.status === 200,
    });

    restaurantListDuration.add(listResponse.timings.duration);
    pauseForBrowsing();

    if (!restaurant) {
        return;
    }

    const restaurantKey = restaurant.slug || restaurant._id;
    const restaurantId = restaurant._id;
    if (!restaurantKey) {
        return;
    }

    const journeyRoll = Math.random();

    if (journeyRoll < 0.7) {
        const detailResponse = http.get(`${BASE_URL}/api/v1/restaurants/${restaurantKey}`, {
            tags: {
                endpoint: 'restaurant-detail',
                workload: 'production-like',
            },
        });

        check(detailResponse, {
            'restaurant detail status is 200': (response) => response.status === 200,
        });
        restaurantDetailDuration.add(detailResponse.timings.duration);
        pauseForBrowsing();
        return;
    }

    if (journeyRoll < 0.9 && BOOKING_DATE && START_TIME) {
        const detailAndSlots = http.batch([
            {
                method: 'GET',
                url: `${BASE_URL}/api/v1/restaurants/${restaurantKey}`,
                params: {
                    tags: {
                        endpoint: 'restaurant-detail',
                        workload: 'production-like',
                    },
                },
            },
            {
                method: 'GET',
                url: `${BASE_URL}/api/v1/restaurants/${restaurantKey}/available-time-slots`,
                params: {
                    tags: {
                        endpoint: 'restaurant-available-time-slots',
                        workload: 'production-like',
                    },
                },
            },
        ]);

        check(detailAndSlots[0], {
            'availability detail status is 200': (response) => response.status === 200,
        });
        check(detailAndSlots[1], {
            'restaurant time slots status is 200': (response) => response.status === 200,
        });
        restaurantDetailDuration.add(detailAndSlots[0].timings.duration);
        availabilityDuration.add(detailAndSlots[1].timings.duration);

        if (USER_TOKEN && restaurantId) {
            const tablesResponse = http.get(
                `${BASE_URL}/api/v1/bookings/${restaurantId}/available-tables?date=${encodeURIComponent(BOOKING_DATE)}&startTime=${encodeURIComponent(START_TIME)}&guestCount=${GUEST_COUNT}`,
                authParams('booking-available-tables')
            );

            check(tablesResponse, {
                'available tables status is 200': (response) => response.status === 200,
            });
            availabilityDuration.add(tablesResponse.timings.duration);
        }

        pauseForBrowsing();
        return;
    }

    if (USER_TOKEN) {
        const authenticatedResponses = http.batch([
            {
                method: 'GET',
                url: `${BASE_URL}/api/v1/users/me`,
                params: authParams('users-me'),
            },
            {
                method: 'GET',
                url: `${BASE_URL}/api/v1/bookings/upcoming`,
                params: authParams('bookings-upcoming'),
            },
            {
                method: 'GET',
                url: `${BASE_URL}/api/v1/bookings/recent`,
                params: authParams('bookings-recent'),
            },
        ]);

        authenticatedResponses.forEach((response) => {
            check(response, {
                'authenticated read status is 200': (item) => item.status === 200,
            });
            authenticatedDuration.add(response.timings.duration);
        });
    } else {
        const detailResponse = http.get(`${BASE_URL}/api/v1/restaurants/${restaurantKey}`, {
            tags: {
                endpoint: 'restaurant-detail',
                workload: 'production-like',
            },
        });

        check(detailResponse, {
            'fallback restaurant detail status is 200': (response) => response.status === 200,
        });
        restaurantDetailDuration.add(detailResponse.timings.duration);
    }

    pauseForBrowsing();
}
