/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ResourcerContext } from '@nocobase/resourcer';
type Getter<T = any> = (ctx: ServerBaseContext) => T | Promise<T>;
export interface PropertyOptions {
    /** 固定值，优先级高于 get */
    value?: any;
    /** 惰性求值 getter，返回值可为 Promise；默认会被缓存 */
    get?: Getter;
    /** 是否禁用缓存，true 表示每次访问都重新计算 */
    cache?: boolean;
    /** 仅允许首次定义，后续重复定义将被忽略 */
    once?: boolean;
}
/**
 * 服务器端上下文基础类。
 * - 支持以 defineProperty 定义惰性/常量属性，并可选择缓存
 * - 支持以 defineMethod 定义方法
 * - 支持 delegate 机制，属性与方法可回退到被委托的上游上下文
 * - 通过 Proxy 实现按需求值与 this 绑定
 */
export declare class ServerBaseContext {
    protected _props: Record<string, PropertyOptions>;
    protected _methods: Record<string, (...args: any[]) => any>;
    protected _cache: Record<string, any>;
    protected _delegates: ServerBaseContext[];
    protected _proxy?: ServerBaseContext;
    [key: string]: any;
    constructor();
    protected _getOwn(key: string, current: ServerBaseContext): any;
    /**
     * 定义一个可枚举属性。
     * - value：固定值
     * - get：惰性 getter（默认带缓存）
     * - once：已存在时忽略重复定义
     */
    defineProperty(key: string, options: PropertyOptions): void;
    /** 定义一个方法（不可枚举、不可写），访问时会自动绑定到对应实例 */
    defineMethod(name: string, fn: (...args: any[]) => any): void;
    /**
     * 委托到另一个 ServerBaseContext：
     * - 访问属性/方法找不到时，会回退到被委托者进行解析
     */
    delegate(ctx: ServerBaseContext): void;
    /** 清空所有委托 */
    clearDelegates(): void;
    /** 创建并返回代理对象（同一实例下保持稳定引用） */
    createProxy(): any;
}
/**
 * 全局上下文：
 * - now/timestamp：时间值（不缓存）
 * - env：环境变量（仅暴露白名单前缀）
 */
export declare class GlobalContext extends ServerBaseContext {
    constructor(env?: Record<string, any>);
}
/**
 * 请求级上下文：从 Koa-like 上下文中映射基础信息。
 * - user（缓存）、roleName、locale、ip、headers、query、params
 */
export declare class HttpRequestContext extends ServerBaseContext {
    private koaCtx;
    constructor(koaCtx: ResourcerContext);
}
export {};
