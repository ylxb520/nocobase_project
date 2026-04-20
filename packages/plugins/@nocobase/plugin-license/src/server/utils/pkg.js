/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import * as http from 'http';
import * as https from 'https';
import axios from 'axios';
export function getNocoBasePkgUrl() {
    return process.env?.NOCOBASE_PKG_URL || 'https://pkg.nocobase.com/';
}
async function testDomain(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            resolve({
                reachable: true,
                statusCode: res.statusCode,
            });
            req.end();
        });
        req.on('error', (err) => {
            resolve({
                reachable: false,
                error: err.message,
            });
        });
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({
                reachable: false,
                error: 'Timeout',
            });
        });
    });
}
export async function testPkgConnection() {
    const res = await testDomain(getNocoBasePkgUrl());
    return res.reachable;
}
export async function testPkgLogin(keyData) {
    try {
        const NOCOBASE_PKG_URL = getNocoBasePkgUrl();
        const { accessKeyId, accessKeySecret } = keyData || {};
        if (!accessKeyId || !accessKeySecret) {
            return false;
        }
        const credentials = { username: accessKeyId, password: accessKeySecret };
        const res1 = await axios.post(`${NOCOBASE_PKG_URL}-/verdaccio/sec/login`, credentials, {
            responseType: 'json',
        });
        const token = res1.data.token;
        if (!token) {
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
}
export async function testServiceConnection(keyData) {
    if (!keyData?.service?.domain) {
        return false;
    }
    const res = await testDomain(keyData?.service?.domain);
    return res.reachable;
}
//# sourceMappingURL=pkg.js.map