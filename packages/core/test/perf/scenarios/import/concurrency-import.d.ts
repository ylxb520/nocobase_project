export declare const options: {
  setupTimeout: string;
  scenarios: {
    'import-async': {
      executor: string;
      vus: number;
      iterations: number;
      maxDuration: string;
    };
  };
};
export declare function setup(): {
  token: any;
};
export default function ({ token }: { token: any }): void;
