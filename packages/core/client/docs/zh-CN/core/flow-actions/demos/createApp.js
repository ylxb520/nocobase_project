import { Application } from '@nocobase/client';
export function createApp({ plugins = [] } = {}) {
  const app = new Application({
    router: { type: 'memory', initialEntries: ['/'] },
    plugins: [...plugins],
  });
  return app.getRootComponent();
}
//# sourceMappingURL=createApp.js.map
