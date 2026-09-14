import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const ACCESS_TOKEN = __ENV.ACCESS_TOKEN;

export const options = {
    vus: Number(__ENV.VUS || 50),
    duration: __ENV.DURATION || '30s',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    },
};

export default function () {
    if (!ACCESS_TOKEN) {
        throw new Error('ACCESS_TOKEN is required for authenticated homepage test');
    }

    const params = {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    };

    const responses = http.batch([
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/restaurants?currentPage=1&pageSize=10`,
            params: {
                ...params,
                tags: { endpoint: 'restaurants-list', test_type: 'homepage-authenticated' },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/users/me`,
            params: {
                ...params,
                tags: { endpoint: 'users-me', test_type: 'homepage-authenticated' },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/notification?page=1&limit=5`,
            params: {
                ...params,
                tags: { endpoint: 'notification-list', test_type: 'homepage-authenticated' },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/notification/unread?page=1&limit=5`,
            params: {
                ...params,
                tags: { endpoint: 'notification-unread', test_type: 'homepage-authenticated' },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/notification/unread-count`,
            params: {
                ...params,
                tags: {
                    endpoint: 'notification-unread-count',
                    test_type: 'homepage-authenticated',
                },
            },
        },
    ]);

    check(responses[0], { 'restaurants list status is 200': (res) => res.status === 200 });
    check(responses[1], { 'users me status is 200': (res) => res.status === 200 });
    check(responses[2], { 'notification list status is 200': (res) => res.status === 200 });
    check(responses[3], { 'notification unread status is 200': (res) => res.status === 200 });
    check(responses[4], { 'notification unread count status is 200': (res) => res.status === 200 });

    sleep(1);
}
