export { setup } from './setup.js';
export declare const options: {
  stages: {
    duration: string;
    target: number;
  }[];
  thresholds: {
    http_req_duration: string[];
    http_req_failed: string[];
  };
};
export default function ({ token }: { token: any }): void;
