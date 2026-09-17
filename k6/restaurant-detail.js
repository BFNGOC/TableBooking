import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        restaurant_detail: {
            executor: 'ramping-vus',

            startVUs: 0,

            stages: [
                { duration: '30s', target: 10 },
                { duration: '30s', target: 50 },
                { duration: '30s', target: 100 },
                { duration: '30s', target: 250 },
                { duration: '30s', target: 500 },
                { duration: '30s', target: 0 },
            ],

            gracefulRampDown: '10s',
        },
    },

    thresholds: {
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const res = http.get('http://localhost:8080/api/v1/restaurants/nha-hang-bbq-bfngoc');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has data': (r) => r.status === 200 && r.body.length > 0,
    });

    if (res.status !== 200 && Math.random() < 0.01) {
        console.log(`HTTP ${res.status}: ${res.body}`);
    }
}
