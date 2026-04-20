/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowResource, ResourceError } from './flowResource';
export class APIResource extends FlowResource {
  // 请求配置
  request = {
    // url: null as string | null,
    headers: {},
    // 仅用于 Refresh
    params: {},
    method: 'get',
    data: null,
  };
  api;
  constructor(context) {
    super(context);
    if (context) {
      this.api = context.api;
    }
  }
  setAPIClient(api) {
    this.api = api;
    return this;
  }
  getURL() {
    return this.request.url;
  }
  setURL(value) {
    this.request.url = value;
    return this;
  }
  get loading() {
    return this.getMeta('loading') || false;
  }
  set loading(value) {
    this.setMeta({ loading: value });
  }
  clearRequestParameters() {
    this.request.params = {};
    return this;
  }
  setRequestParameters(params) {
    this.request.params = { ...this.request.params, ...params };
    return this;
  }
  setRequestMethod(method) {
    this.request.method = method;
    return this;
  }
  addRequestHeader(key, value) {
    if (!this.request.headers) {
      this.request.headers = {};
    }
    this.request.headers[key] = value;
    return this;
  }
  removeRequestHeader(key) {
    if (this.request.headers && key in this.request.headers) {
      delete this.request.headers[key];
    }
    return this;
  }
  addRequestParameter(key, value) {
    if (!this.request.params) {
      this.request.params = {};
    }
    this.request.params[key] = value;
    return this;
  }
  getRequestParameter(key) {
    if (this.request.params && key in this.request.params) {
      return this.request.params[key];
    }
    return null;
  }
  removeRequestParameter(key) {
    if (this.request.params && key in this.request.params) {
      delete this.request.params[key];
    }
    return this;
  }
  setRequestBody(data) {
    this.request.data = data;
    return this;
  }
  setRequestOptions(key, value) {
    this.request[key] = value;
    return this;
  }
  getRequestOptions() {
    return this.request;
  }
  async refresh() {
    if (!this.api) {
      throw new Error('API client not set');
    }
    this.clearError();
    try {
      const { data } = await this.api.request({
        url: this.getURL(),
        ...this.getRefreshRequestOptions(),
      });
      this.setData(data);
      this.emit('refresh');
    } catch (err) {
      const error = new ResourceError(err);
      this.setError(error);
      throw error;
    }
  }
  getRefreshRequestOptions() {
    const options = {
      ...this.request,
    };
    return options;
  }
}
//# sourceMappingURL=apiResource.js.map
