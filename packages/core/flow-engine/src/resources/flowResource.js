/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observable } from '@formily/reactive';
import { FlowContext } from '../flowContext';
function toErrMessages(error) {
  if (typeof error?.response?.data === 'string') {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = error?.response?.data;
    let message = tempElement.textContent || tempElement.innerText;
    if (message.includes('Error occurred while trying')) {
      message = 'The application may be starting up. Please try again later.';
      return [{ code: 'APP_WARNING', message }];
    }
    if (message.includes('502 Bad Gateway')) {
      message = 'The application may be starting up. Please try again later.';
      return [{ code: 'APP_WARNING', message }];
    }
    return [{ message }];
  }
  if (error?.response?.data?.error) {
    return [error?.response?.data?.error];
  }
  return (
    error?.response?.data?.errors ||
    error?.response?.data?.messages ||
    error?.response?.error || [{ message: error.message || 'Server error' }]
  );
}
export class ResourceError extends Error {
  data;
  constructor(error) {
    const data = toErrMessages(error).shift();
    super(data.message);
    this.name = 'ResponseError';
  }
  get code() {
    return this.data?.code || 'UNKNOWN_ERROR';
  }
  get message() {
    return this.data?.message || 'An unknown error occurred';
  }
}
export class FlowResource {
  _data = observable.ref(null);
  _meta = observable.ref({});
  _error = observable.ref(null);
  context;
  constructor(context) {
    this.context = new FlowContext();
    this.context.addDelegate(context);
  }
  getData() {
    return this._data.value;
  }
  hasData() {
    const data = this.getData();
    if (Array.isArray(data)) {
      return data.length > 0;
    } else if (data && typeof data === 'object') {
      return Object.keys(data).length > 0;
    }
    return false;
  }
  setData(value) {
    this._data.value = value;
    return this;
  }
  getMeta(metaKey) {
    return metaKey ? this._meta.value[metaKey] : this._meta.value;
  }
  setMeta(meta) {
    this._meta.value = { ...this._meta.value, ...meta };
    return this;
  }
  get error() {
    return this._error.value;
  }
  getError() {
    return this._error.value;
  }
  setError(error) {
    this._error.value = error;
    return this;
  }
  clearError() {
    this._error.value = null;
    return this;
  }
  events = {};
  on(event, callback) {
    (this.events[event] ||= []).push(callback);
  }
  once(event, callback) {
    const wrapper = (...args) => {
      // 触发回调
      callback(...args);
      // 自动移除监听器
      this.off(event, wrapper);
    };
    // 注册包装后的回调
    this.on(event, wrapper);
  }
  off(event, callback) {
    this.events[event] = (this.events[event] || []).filter((fn) => fn !== callback);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach((fn) => fn(...args));
  }
}
//# sourceMappingURL=flowResource.js.map
