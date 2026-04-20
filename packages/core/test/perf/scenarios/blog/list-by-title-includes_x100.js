// __benchmarks__/k6/write-single.js
import http from 'k6/http';
import { check } from 'k6';
import { uid } from '../../utils.js';
export { setup } from './setup.js';
export const options = {
  stages: [
    { duration: '1s', target: 100 },
    { duration: '59s', target: 100 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'], // 失败率 < 1%
  },
};
export default function ({ token }) {
  const keyword = uid(2);
  const url = `${__ENV.TARGET_ORIGIN}/api/posts:list`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Role': 'admin',
    },
    queries: {
      filter: JSON.stringify({ $and: [{ title: { $includes: keyword } }] }),
      sort: '-createdAt',
      pageSize: 50,
    },
  };
  const res = http.get(url, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  // sleep(1);
}
//# sourceMappingURL=list-by-title-includes_x100.js.map
