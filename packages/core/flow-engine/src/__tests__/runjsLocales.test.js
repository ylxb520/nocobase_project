/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { getRunJSDocFor } from '..';
import { setupRunJSContexts } from '../runjs-context/setup';
import { FlowContext } from '../flowContext';
describe('RunJS locales patch (engine doc)', () => {
  beforeAll(async () => {
    await setupRunJSContexts();
  });
  it('should merge zh-CN locales for subclass doc label', () => {
    const ctx = new FlowContext();
    ctx.defineProperty('model', { value: { constructor: { name: 'JSFieldModel' } } });
    ctx.defineProperty('api', { value: { auth: { locale: 'zh-CN' } } });
    const doc = getRunJSDocFor(ctx, { version: 'v1' });
    expect(doc?.label || '').toMatch(/JS 字段|JS 字段 RunJS 上下文/);
  });
  it('should localize base properties/methods via locales', () => {
    const ctx = new FlowContext();
    ctx.defineProperty('model', { value: { constructor: { name: 'JSBlockModel' } } });
    ctx.defineProperty('api', { value: { auth: { locale: 'zh-CN' } } });
    const doc = getRunJSDocFor(ctx, { version: 'v1' });
    const message = doc?.properties?.message;
    const messageText = typeof message === 'string' ? message : message?.description ?? message?.detail ?? '';
    expect(String(messageText)).toMatch(/Ant Design 全局消息 API/);
    expect(String(doc?.methods?.t || '')).toMatch(/国际化函数/);
  });
});
//# sourceMappingURL=runjsLocales.test.js.map
