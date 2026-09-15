import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const BASE_URL = __ENV.K6_BASE_URL || __ENV.BASE_URL || 'http://localhost:8080';
const USER_A_TOKEN = __ENV.K6_USER_A_TOKEN;
const USER_B_TOKEN = __ENV.K6_USER_B_TOKEN;
const RESTAURANT_ID = __ENV.K6_TEST_RESTAURANT_ID;
const TABLE_ID = __ENV.K6_TEST_TABLE_ID;
const BOOKING_DATE = __ENV.K6_BOOKING_DATE;
const START_TIME = __ENV.K6_START_TIME;
const GUEST_COUNT = Number(__ENV.K6_GUEST_COUNT || 1);
const REJECTION_STATUS = Number(__ENV.K6_EXPECTED_REJECTION_STATUS || 409);

const successfulBookings = new Counter('successful_bookings');
const rejectedBookings = new Counter('rejected_bookings');

export const options = {
    scenarios: {
        booking_race: {
            executor: 'per-vu-iterations',
            vus: 2,
            iterations: 1,
            maxDuration: '30s',
        },
    },
    thresholds: {
        successful_bookings: ['count==1'],
        rejected_bookings: ['count==1'],
    },
};

function required(name, value) {
    if (!value) {
        throw new Error(`${name} is required`);
    }
}

export function setup() {
    required('K6_USER_A_TOKEN', USER_A_TOKEN);
    required('K6_USER_B_TOKEN', USER_B_TOKEN);
    required('K6_TEST_RESTAURANT_ID', RESTAURANT_ID);
    required('K6_TEST_TABLE_ID', TABLE_ID);
    required('K6_BOOKING_DATE', BOOKING_DATE);
    required('K6_START_TIME', START_TIME);

    if (!Number.isInteger(GUEST_COUNT) || GUEST_COUNT < 1) {
        throw new Error('K6_GUEST_COUNT must be a positive integer');
    }

    if (!Number.isInteger(REJECTION_STATUS) || REJECTION_STATUS < 400) {
        throw new Error('K6_EXPECTED_REJECTION_STATUS must be an HTTP error status');
    }

    return {
        bookingDate: BOOKING_DATE,
        startTime: START_TIME,
    };
}

export default function (data) {
    const token = __VU === 1 ? USER_A_TOKEN : USER_B_TOKEN;
    const contactName = __VU === 1 ? 'K6 Race User A' : 'K6 Race User B';
    const contactPhone = __VU === 1 ? '0900000001' : '0900000002';

    const response = http.post(
        `${BASE_URL}/api/v1/bookings/${RESTAURANT_ID}`,
        JSON.stringify({
            bookingDate: data.bookingDate,
            startTime: data.startTime,
            guestCount: GUEST_COUNT,
            tableIds: [TABLE_ID],
            contactName,
            contactPhone,
            restaurantNote: 'Automated isolated booking race test',
            payDepositNow: false,
        }),
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            tags: {
                endpoint: 'booking-create',
                test_type: 'race-condition',
            },
        }
    );

    const isSuccess = response.status === 201;
    const isExpectedRejection = response.status === REJECTION_STATUS;

    if (isSuccess) {
        successfulBookings.add(1);
    }

    if (isExpectedRejection) {
        rejectedBookings.add(1);
    }

    check(response, {
        'booking response is 201 or expected rejection': () => isSuccess || isExpectedRejection,
    });
}
