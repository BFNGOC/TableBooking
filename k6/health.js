import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 200,
    duration: '10s',

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
    },
};

export default function () {
    const res = http.get('http://localhost:8080/api/v1/restaurants/recommended');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
