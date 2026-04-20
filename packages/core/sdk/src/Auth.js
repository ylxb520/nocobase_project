/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export class Auth {
    api;
    get storagePrefix() {
        return this.api.storagePrefix;
    }
    options = {
        locale: null,
        role: null,
        authenticator: null,
        token: null,
    };
    constructor(api) {
        this.api = api;
        this.api.axios.interceptors.request.use(this.middleware.bind(this));
    }
    get locale() {
        return this.getLocale();
    }
    set locale(value) {
        this.setLocale(value);
    }
    get role() {
        return this.getRole();
    }
    set role(value) {
        this.setRole(value);
    }
    get token() {
        return this.getToken();
    }
    set token(value) {
        this.setToken(value);
    }
    get authenticator() {
        return this.getAuthenticator();
    }
    set authenticator(value) {
        this.setAuthenticator(value);
    }
    /**
     * @internal
     */
    getOption(key) {
        return this.api.storage.getItem(key);
    }
    /**
     * @internal
     */
    setOption(key, value) {
        this.options[key] = value;
        return this.api.storage.setItem(key, value || '');
    }
    /**
     * @internal
     * use {@link Auth#locale} instead
     */
    getLocale() {
        return this.getOption('locale');
    }
    /**
     * @internal
     * use {@link Auth#locale} instead
     */
    setLocale(locale) {
        this.setOption('locale', locale);
    }
    /**
     * @internal
     * use {@link Auth#role} instead
     */
    getRole() {
        return this.getOption('role');
    }
    /**
     * @internal
     * use {@link Auth#role} instead
     */
    setRole(role) {
        this.setOption('role', role);
    }
    /**
     * @internal
     * use {@link Auth#token} instead
     */
    getToken() {
        return this.getOption('token');
    }
    /**
     * @internal
     * use {@link Auth#token} instead
     */
    setToken(token) {
        this.setOption('token', token);
        if (this.api['app']) {
            this.api['app'].eventBus.dispatchEvent(new CustomEvent('auth:tokenChanged', { detail: { token, authenticator: this.authenticator } }));
        }
    }
    /**
     * @internal
     * use {@link Auth#authenticator} instead
     */
    getAuthenticator() {
        return this.getOption('auth');
    }
    /**
     * @internal
     * use {@link Auth#authenticator} instead
     */
    setAuthenticator(authenticator) {
        this.setOption('auth', authenticator);
    }
    middleware(config) {
        if (this.locale) {
            config.headers['X-Locale'] = this.locale;
        }
        if (this.role) {
            config.headers['X-Role'] = this.role;
        }
        if (this.authenticator && !config.headers['X-Authenticator']) {
            config.headers['X-Authenticator'] = this.authenticator;
        }
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
    }
    async signIn(values, authenticator) {
        const response = await this.api.request({
            method: 'post',
            url: 'auth:signIn',
            data: values,
            headers: {
                'X-Authenticator': authenticator,
            },
        });
        const data = response?.data?.data;
        this.setAuthenticator(authenticator);
        this.setToken(data?.token);
        return response;
    }
    async signUp(values, authenticator) {
        return await this.api.request({
            method: 'post',
            url: 'auth:signUp',
            data: values,
            headers: {
                'X-Authenticator': authenticator,
            },
        });
    }
    async signOut() {
        const response = await this.api.request({
            method: 'post',
            url: 'auth:signOut',
        });
        this.setToken(null);
        this.setRole(null);
        this.setAuthenticator(null);
        return response;
    }
    async lostPassword(values) {
        // 获取当前 URL 的查询参数
        const searchParams = new URLSearchParams(window.location.search);
        // 转换为对象
        const paramsObject = Object.fromEntries(searchParams.entries());
        const response = await this.api.request({
            method: 'post',
            url: 'auth:lostPassword',
            data: {
                ...values,
                baseURL: window.location.href.split('/forgot-password')[0],
            },
            headers: {
                'X-Authenticator': paramsObject.name,
            },
        });
        return response;
    }
    async resetPassword(values) {
        const response = await this.api.request({
            method: 'post',
            url: 'auth:resetPassword',
            data: values,
        });
        return response;
    }
    async checkResetToken(values) {
        const response = await this.api.request({
            method: 'post',
            url: 'auth:checkResetToken',
            data: values,
        });
        return response;
    }
}
//# sourceMappingURL=Auth.js.map