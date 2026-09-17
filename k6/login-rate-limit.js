import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const rateLimited = new Counter('rate_limited_requests');

export const options = {
    vus: 1,
    iterations: 10,
};

export default function () {
    const response = http.post(
        `${BASE_URL}/api/v1/auth/login`,
        JSON.stringify({
            email: 'invalid-load-test@example.invalid',
            password: 'Invalid-Load-Test-Only-Password1!',
        }),
        {
            headers: { 'Content-Type': 'application/json' },
            tags: { endpoint: 'auth-login', test_type: 'rate-limit' },
        }
    );

    if (response.status === 429) {
        rateLimited.add(1);
    }

    check(response, {
        'login abuse request is rejected or throttled': (res) =>
            res.status === 401 || res.status === 429,
    });
}
