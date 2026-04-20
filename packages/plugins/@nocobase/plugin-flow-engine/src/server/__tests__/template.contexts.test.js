/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { describe, it, expect } from 'vitest';
import { ServerBaseContext, GlobalContext, HttpRequestContext } from '../template/contexts';
import { resetVariablesRegistryForTest } from './test-utils';
describe('ServerBaseContext', () => {
    beforeAll(() => {
        resetVariablesRegistryForTest();
    });
    it('defineProperty: value', () => {
        const ctx = new ServerBaseContext();
        ctx.defineProperty('foo', { value: 123 });
        expect(ctx.foo).toBe(123);
        expect('foo' in ctx).toBe(true);
        expect('bar' in ctx).toBe(false);
    });
    it('defineProperty: getter with cache (default) caches value', () => {
        const ctx = new ServerBaseContext();
        let n = 0;
        ctx.defineProperty('num', { get: () => ++n });
        expect(ctx.num).toBe(1);
        expect(ctx.num).toBe(1);
    });
    it('defineProperty: getter with cache=false recomputes', () => {
        const ctx = new ServerBaseContext();
        let n = 0;
        ctx.defineProperty('num', { get: () => ++n, cache: false });
        expect(ctx.num).toBe(1);
        expect(ctx.num).toBe(2);
    });
    it('defineProperty: once keeps the first definition', () => {
        const ctx = new ServerBaseContext();
        ctx.defineProperty('foo', { value: 1, once: true });
        ctx.defineProperty('foo', { value: 2 });
        expect(ctx.foo).toBe(1);
    });
    it('defineMethod: accessible and bound', () => {
        const ctx = new ServerBaseContext();
        ctx.defineMethod('add', function (a, b) {
            return a + b;
        });
        expect(ctx.add(2, 3)).toBe(5);
        expect('add' in ctx).toBe(true);
    });
    it('delegate: property lookup falls back to delegates', () => {
        const parent = new ServerBaseContext();
        parent.defineProperty('foo', { value: 42 });
        const child = new ServerBaseContext();
        child.delegate(parent);
        expect(child.foo).toBe(42);
        expect('foo' in child).toBe(true);
    });
    it('delegate: getter receives top-level proxy as ctx', () => {
        const parent = new ServerBaseContext();
        const child = new ServerBaseContext();
        child.defineMethod('hello', () => 'ok');
        parent.defineProperty('x', {
            get: (ctx) => ctx.hello(),
        });
        child.delegate(parent);
        expect(child.x).toBe('ok');
    });
    it('delegate: must be ServerBaseContext instance', () => {
        const ctx = new ServerBaseContext();
        expect(() => ctx.delegate({})).toThrowError();
    });
    it('createProxy returns stable proxy instance', () => {
        const ctx = new ServerBaseContext();
        const p1 = ctx.createProxy();
        const p2 = ctx.createProxy();
        expect(p1).toBe(p2);
    });
});
describe('GlobalContext', () => {
    it('filters env and exposes now/timestamp', () => {
        const env = {
            PUBLIC_FOO: 'x',
            NEXT_PUBLIC_BAR: 'y',
            NCB_PUBLIC_Z: 'z',
            SECRET_TOKEN: 'hidden',
        };
        const g = new GlobalContext(env);
        expect(g.env).toEqual({ PUBLIC_FOO: 'x', NEXT_PUBLIC_BAR: 'y', NCB_PUBLIC_Z: 'z' });
        expect(typeof g.timestamp).toBe('number');
        expect(typeof g.now).toBe('string');
        expect('date' in g).toBe(false);
    });
});
describe('HttpRequestContext', () => {
    it('maps koa-like request/auth info to context properties', async () => {
        const koa = {
            auth: { user: { id: 1, name: 'Alice' }, role: 'root' },
            getCurrentLocale: () => 'en-US',
            state: { clientIp: '1.2.3.4' },
            headers: { 'x-req-id': 'abc' },
            request: { ip: '5.6.7.8', query: { a: 1 } },
            action: { params: { foo: 'bar' } },
        };
        const r = new HttpRequestContext(koa);
        // user (cached), role, locale, ip, headers, query, params
        const user1 = await r.user;
        const user2 = await r.user;
        expect(user1).toEqual({ id: 1, name: 'Alice' });
        expect(user2).toEqual({ id: 1, name: 'Alice' });
        expect(r.roleName).toBe('root');
        expect(r.locale).toBe('en-US');
        expect(r.ip).toBe('1.2.3.4');
        expect(r.headers).toEqual({ 'x-req-id': 'abc' });
        expect(r.query).toEqual({ a: 1 });
        expect(r.params).toEqual({ foo: 'bar' });
    });
});
//# sourceMappingURL=template.contexts.test.js.map