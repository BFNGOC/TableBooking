import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
    vus: 200,
    duration: '10s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    },
};

export default function () {
    const responses = http.batch([
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/restaurants/recommended`,
            params: {
                tags: {
                    endpoint: 'restaurants-recommended',
                },
            },
        },
        {
            method: 'GET',
            url: `${BASE_URL}/api/v1/restaurants?currentPage=1&pageSize=10`,
            params: {
                tags: {
                    endpoint: 'restaurants-list',
                },
            },
        },
    ]);

    check(responses[0], {
        'recommended status is 200': (res) => res.status === 200,
    });

    check(responses[1], {
        'restaurants status is 200': (res) => res.status === 200,
    });

    sleep(1);
}
