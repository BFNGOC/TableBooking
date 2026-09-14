import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    const responses = http.batch([
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/restaurants/recommended`,
            params: {
                headers: { Authorization: 'Bearer invalid-test-token' },
                tags: { endpoint: 'restaurants-recommended', test_type: 'security' },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/users/me`,
            params: {
                tags: { endpoint: 'users-me', test_type: 'security' },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/notification/unread-count`,
            params: {
                headers: { Authorization: 'Bearer invalid-test-token' },
                tags: { endpoint: 'notification-unread-count', test_type: 'security' },
            },
        },
    ]);

    check(responses[0], {
        'public endpoint bypasses invalid token': (res) => res.status === 200,
    });

    check(responses[1], {
        'protected endpoint rejects missing token': (res) => res.status === 401,
    });

    check(responses[2], {
        'protected endpoint rejects invalid token': (res) => res.status === 401,
    });
}
