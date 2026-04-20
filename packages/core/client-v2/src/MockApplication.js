/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import MockAdapter from 'axios-mock-adapter';
import { Application } from './Application';
import { WebSocketClient } from './WebSocketClient';
class MockApplication extends Application {
  apiMock;
  constructor(options = {}) {
    super({
      router: { type: 'memory', initialEntries: ['/'] },
      ...options,
    });
    this.apiMock = new MockAdapter(this.apiClient.axios);
    this.ws = new MockWebSocketClient(options.ws || {});
  }
}
class MockWebSocketClient extends WebSocketClient {
  eventBus = new EventTarget();
  constructor(options) {
    super(options);
  }
  connect() {}
  close() {}
  send() {}
  on(type, listener, options) {
    this.eventBus.addEventListener(type, (event) => listener({ data: JSON.stringify(event.detail) }), options);
  }
  emit(type, data) {
    this.eventBus.dispatchEvent(new CustomEvent(type, { detail: data }));
  }
  off(type, listener, options) {
    this.eventBus.removeEventListener(type, listener, options);
  }
  removeAllListeners() {}
}
export function createMockClient(options) {
  const app = new MockApplication(options);
  return app;
}
//# sourceMappingURL=MockApplication.js.map
