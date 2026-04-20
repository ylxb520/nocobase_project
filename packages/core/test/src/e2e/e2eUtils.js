/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { faker } from '@faker-js/faker';
import { uid } from '@formily/shared';
import { test as base, expect, request } from '@playwright/test';
import _ from 'lodash';
import { defineConfig } from './defineConfig';
function getPageMenuSchema({ pageSchemaUid, tabSchemaUid, tabSchemaName }) {
  return {
    type: 'void',
    'x-component': 'Page',
    properties: {
      [tabSchemaName]: {
        type: 'void',
        'x-component': 'Grid',
        'x-initializer': 'page:addBlock',
        properties: {},
        'x-uid': tabSchemaUid,
        'x-async': true,
      },
    },
    'x-uid': pageSchemaUid,
  };
}
function getPageMenuSchemaWithTabSchema({ tabSchema }) {
  if (!tabSchema) {
    return null;
  }
  return {
    type: 'void',
    'x-component': 'Page',
    properties: {
      [tabSchema.name]: tabSchema,
    },
    'x-uid': uid(),
  };
}
export * from '@playwright/test';
export { defineConfig };
const PORT = process.env.APP_PORT || 20000;
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
export class NocoPage {
  options;
  page;
  url;
  uid;
  desktopRouteId;
  collectionsName;
  _waitForInit;
  constructor(options, page) {
    this.options = options;
    this.page = page;
    this._waitForInit = this.init();
  }
  async init() {
    const waitList = [];
    if (this.options?.collections?.length) {
      const collections = omitSomeFields(this.options.collections);
      this.collectionsName = collections.map((item) => item.name);
      waitList.push(createCollections(collections));
    }
    waitList.push(
      createPage({
        type: this.options?.type,
        name: this.options?.name,
        pageSchema: this.options?.pageSchema,
        tabSchema: this.options?.tabSchema,
        url: this.options?.url,
        keepUid: this.options?.keepUid,
        pageUid: this.options?.pageUid,
      }),
    );
    const result = await Promise.all(waitList);
    const { schemaUid, routeId } = result[result.length - 1] || {};
    this.uid = schemaUid;
    this.desktopRouteId = routeId;
    this.url = `${this.options?.basePath || '/admin/'}${this.uid || this.desktopRouteId}`;
  }
  async goto() {
    await this._waitForInit;
    await this.page?.goto(this.url);
  }
  async getUrl() {
    await this._waitForInit;
    return this.url;
  }
  async getUid() {
    await this._waitForInit;
    return this.uid;
  }
  async getDesktopRouteId() {
    await this._waitForInit;
    return this.desktopRouteId;
  }
  /**
   * If you are using mockRecords, then you need to use this method.
   * Wait until the mockRecords create the records successfully before navigating to the page.
   * @param this
   * @returns
   */
  async waitForInit() {
    await this._waitForInit;
    return this;
  }
  async destroy() {
    const waitList = [];
    if (this.uid || this.desktopRouteId !== undefined) {
      waitList.push(deletePage(this.uid, this.desktopRouteId));
      this.uid = undefined;
      this.desktopRouteId = undefined;
    }
    if (this.collectionsName?.length) {
      waitList.push(deleteCollections(this.collectionsName));
      this.collectionsName = undefined;
    }
    await Promise.all(waitList);
  }
}
export class NocoMobilePage extends NocoPage {
  options;
  page;
  mobileRouteId;
  title;
  constructor(options, page) {
    super(options, page);
    this.options = options;
    this.page = page;
  }
  getTitle() {
    return this.title;
  }
  async init() {
    const waitList = [];
    if (this.options?.collections?.length) {
      const collections = omitSomeFields(this.options.collections);
      this.collectionsName = collections.map((item) => item.name);
      waitList.push(createCollections(collections));
    }
    waitList.push(createMobilePage(this.options));
    const result = await Promise.all(waitList);
    const { url, pageSchemaUid, routeId, title } = result[result.length - 1];
    this.title = title;
    this.mobileRouteId = routeId;
    this.uid = pageSchemaUid;
    if (this.options?.type == 'link') {
      // 内部 URL 和外部 URL
      if (url?.startsWith('/')) {
        this.url = `${this.options?.basePath || '/m'}${url}`;
      } else {
        this.url = url;
      }
    } else {
      this.url = `${this.options?.basePath || '/m'}${url}`;
    }
  }
  async mobileDestroy() {
    // 移除 mobile routes
    await deleteMobileRoutes(this.mobileRouteId);
    // 移除 schema
    await this.destroy();
  }
}
let _page;
const getPage = async (browser) => {
  if (!_page) {
    _page = await browser.newPage();
  }
  return _page;
};
const _test = base.extend({
  page: async ({ browser }, use) => {
    await use(await getPage(browser));
  },
  mockPage: async ({ browser }, use) => {
    // 保证每个测试运行时 faker 的随机值都是一样的
    // faker.seed(1);
    const page = await getPage(browser);
    const nocoPages = [];
    const mockPage = (config) => {
      const nocoPage = new NocoPage(config, page);
      nocoPages.push(nocoPage);
      return nocoPage;
    };
    await use(mockPage);
    const waitList = [];
    // 测试运行完自动销毁页面
    for (const nocoPage of nocoPages) {
      // 这里之所以不加入 waitList 是因为会导致 acl 的测试报错
      await nocoPage.destroy();
    }
    waitList.push(setDefaultRole('root'));
    // 删除掉 id 不是 1 的 users 和 name 不是 root admin member 的 roles
    waitList.push(removeRedundantUserAndRoles());
    await Promise.all(waitList);
  },
  mockMobilePage: async ({ browser }, use) => {
    // 保证每个测试运行时 faker 的随机值都是一样的
    // faker.seed(1);
    const page = await getPage(browser);
    const nocoPages = [];
    const mockPage = (config) => {
      const nocoPage = new NocoMobilePage(config, page);
      nocoPages.push(nocoPage);
      return nocoPage;
    };
    await use(mockPage);
    const waitList = [];
    // 测试运行完自动销毁页面
    for (const nocoPage of nocoPages) {
      // 这里之所以不加入 waitList 是因为会导致 acl 的测试报错
      await nocoPage.mobileDestroy();
    }
    waitList.push(setDefaultRole('root'));
    // 删除掉 id 不是 1 的 users 和 name 不是 root admin member 的 roles
    waitList.push(removeRedundantUserAndRoles());
    await Promise.all(waitList);
  },
  mockManualDestroyPage: async ({ browser }, use) => {
    const mockManualDestroyPage = (config) => {
      const nocoPage = new NocoPage(config);
      return nocoPage;
    };
    await use(mockManualDestroyPage);
  },
  createCollections: async ({ browser }, use) => {
    let collectionsName = [];
    const _createCollections = async (collectionSettings) => {
      collectionSettings = omitSomeFields(
        Array.isArray(collectionSettings) ? collectionSettings : [collectionSettings],
      );
      collectionsName = [...collectionsName, ...collectionSettings.map((item) => item.name)];
      await createCollections(collectionSettings);
    };
    await use(_createCollections);
    if (collectionsName.length) {
      await deleteCollections(_.uniq(collectionsName));
    }
  },
  mockCollections: async ({ browser }, use) => {
    let collectionsName = [];
    const destroy = async () => {
      if (collectionsName.length) {
        await deleteCollections(_.uniq(collectionsName));
      }
    };
    const mockCollections = async (collectionSettings) => {
      collectionSettings = omitSomeFields(collectionSettings);
      collectionsName = [...collectionsName, ...collectionSettings.map((item) => item.name)];
      return createCollections(collectionSettings);
    };
    await use(mockCollections);
    await destroy();
  },
  mockCollection: async ({ browser }, use) => {
    let collectionsName = [];
    const destroy = async () => {
      if (collectionsName.length) {
        await deleteCollections(_.uniq(collectionsName));
      }
    };
    const mockCollection = async (collectionSetting, options) => {
      const collectionSettings = omitSomeFields([collectionSetting]);
      collectionsName = [...collectionsName, ...collectionSettings.map((item) => item.name)];
      return createCollections(collectionSettings);
    };
    await use(mockCollection);
    await destroy();
  },
  mockRecords: async ({ browser }, use) => {
    const mockRecords = async (collectionName, count = 3, data) => {
      let maxDepth;
      if (_.isNumber(data)) {
        maxDepth = data;
        data = undefined;
      }
      if (_.isArray(count)) {
        data = count;
        count = data.length;
      }
      return createRandomData(collectionName, count, data, maxDepth);
    };
    await use(mockRecords);
  },
  mockRecord: async ({ browser }, use) => {
    const mockRecord = async (collectionName, data, maxDepth) => {
      if (_.isNumber(data)) {
        maxDepth = data;
        data = undefined;
      }
      const result = await createRandomData(collectionName, 1, data, maxDepth);
      return result[0];
    };
    await use(mockRecord);
  },
  deletePage: async ({ browser }, use) => {
    const page = await getPage(browser);
    const deletePage = async (pageName) => {
      await page.getByLabel(pageName, { exact: true }).hover();
      await page.getByRole('button', { name: 'designer-schema-settings-' }).hover();
      await page.getByRole('menuitem', { name: 'Delete', exact: true }).click();
      await page.getByRole('button', { name: 'OK', exact: true }).click();
    };
    await use(deletePage);
  },
  mockRole: async ({ browser }, use) => {
    const mockRole = async (roleSetting) => {
      return createRole(roleSetting);
    };
    await use(mockRole);
  },
  updateRole: async ({ browser }, use) => {
    await use(updateRole);
  },
  mockExternalDataSource: async ({ browser }, use) => {
    const mockExternalDataSource = async (DataSourceSetting) => {
      return createExternalDataSource(DataSourceSetting);
    };
    await use(mockExternalDataSource);
  },
  destoryExternalDataSource: async ({ browser }, use) => {
    const destoryDataSource = async (key) => {
      return destoryExternalDataSource(key);
    };
    await use(destoryDataSource);
  },
  clearBlockTemplates: async ({ browser }, use) => {
    // 用来标记当前测试用例是否已经结束，只有结束了才会清空区块模板
    let ended = false;
    let isImmediate = false;
    const clearBlockTemplates = async ({ immediate } = { immediate: false }) => {
      isImmediate = immediate;
      if (!ended && !immediate) {
        return;
      }
      const api = await request.newContext({
        storageState: process.env.PLAYWRIGHT_AUTH_FILE,
      });
      const state = await api.storageState();
      const headers = getHeaders(state);
      const filter = {
        key: { $exists: true },
      };
      const result = await api.post(`/api/uiSchemaTemplates:destroy?filter=${JSON.stringify(filter)}`, {
        headers,
      });
      if (!result.ok()) {
        throw new Error(await result.text());
      }
    };
    await use(clearBlockTemplates);
    ended = true;
    if (!isImmediate) {
      await clearBlockTemplates();
    }
  },
});
export const test = Object.assign(_test, {
  /** 只运行在 postgres 数据库中 */
  pgOnly: process.env.DB_DIALECT == 'postgres' ? _test : _test.skip,
});
const getStorageItem = (key, storageState) => {
  return storageState.origins
    .find((item) => item.origin === APP_BASE_URL)
    ?.localStorage.find((item) => item.name === key)?.value;
};
/**
 * 更新直接从浏览器中复制过来的 Schema 中的 uid
 */
const updateUidOfPageSchema = (uiSchema) => {
  if (!uiSchema) {
    return;
  }
  if (uiSchema['x-uid']) {
    uiSchema['x-uid'] = uid();
  }
  if (uiSchema.properties) {
    Object.keys(uiSchema.properties).forEach((key) => {
      updateUidOfPageSchema(uiSchema.properties[key]);
    });
  }
  return uiSchema;
};
/**
 * 在 NocoBase 中创建一个页面
 */
const createPage = async (options) => {
  const { type = 'page', url, name, pageSchema, tabSchema, keepUid, pageUid: pageUidFromOptions } = options || {};
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const schema = getPageMenuSchemaWithTabSchema({ tabSchema }) || pageSchema;
  const state = await api.storageState();
  const headers = getHeaders(state);
  const newPageSchema = keepUid ? schema : updateUidOfPageSchema(schema);
  const pageSchemaUid = newPageSchema?.['x-uid'] || uid();
  const newTabSchemaUid = uid();
  const newTabSchemaName = uid();
  const title = name || pageSchemaUid;
  let routeId;
  let schemaUid;
  if (type === 'group') {
    const result = await api.post('/api/desktopRoutes:create', {
      headers,
      data: {
        type: 'group',
        title,
        hideInMenu: false,
      },
    });
    if (!result.ok()) {
      throw new Error(await result.text());
    }
    const data = await result.json();
    routeId = data.data?.id;
  }
  if (type === 'page') {
    const routeResult = await api.post('/api/desktopRoutes:create', {
      headers,
      data: {
        type: 'page',
        title,
        schemaUid: pageSchemaUid,
        hideInMenu: false,
        enableTabs: !!newPageSchema?.['x-component-props']?.enablePageTabs,
        children: newPageSchema
          ? schemaToRoutes(newPageSchema)
          : [
              {
                type: 'tabs',
                title: '{{t("Unnamed")}}',
                schemaUid: newTabSchemaUid,
                tabSchemaName: newTabSchemaName,
                hideInMenu: false,
              },
            ],
      },
    });
    if (!routeResult.ok()) {
      throw new Error(await routeResult.text());
    }
    const schemaResult = await api.post(`/api/uiSchemas:insert`, {
      headers,
      data:
        newPageSchema ||
        getPageMenuSchema({
          pageSchemaUid,
          tabSchemaUid: newTabSchemaUid,
          tabSchemaName: newTabSchemaName,
        }),
    });
    if (!schemaResult.ok()) {
      throw new Error(await routeResult.text());
    }
    const data = await routeResult.json();
    routeId = data.data?.id;
    schemaUid = pageSchemaUid;
  }
  if (type === 'link') {
    const result = await api.post('/api/desktopRoutes:create', {
      headers,
      data: {
        type: 'link',
        title,
        hideInMenu: false,
        options: {
          href: url,
        },
      },
    });
    if (!result.ok()) {
      throw new Error(await result.text());
    }
    const data = await result.json();
    routeId = data.data?.id;
  }
  return { schemaUid, routeId };
};
/**
 * 在 NocoBase 中创建一个移动端页面
 */
const createMobilePage = async (options) => {
  const { type = 'page', url, name, pageSchema, keepUid } = options || {};
  function randomStr() {
    return Math.random().toString(36).substring(2);
  }
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const pageSchemaUid = name || uid();
  const schemaUrl = `/page/${pageSchemaUid}`;
  const firstTabUid = uid();
  const title = name || randomStr();
  // 创建路由
  const routerResponse = await api.post(`/api/mobileRoutes:create`, {
    headers,
    data: {
      type: type,
      schemaUid: pageSchemaUid,
      title: title,
      icon: 'appstoreoutlined',
      options: {
        url,
      },
    },
  });
  const responseData = await routerResponse.json();
  const routeId = responseData.data.id;
  if (!routerResponse.ok()) {
    throw new Error(await routerResponse.text());
  }
  if (type === 'link') return { url, routeId, title };
  // 创建空页面
  const createSchemaResult = await api.post(`/api/uiSchemas:insertAdjacent?resourceIndex=mobile&position=beforeEnd`, {
    headers,
    data: {
      schema: {
        type: 'void',
        name: pageSchemaUid,
        'x-uid': pageSchemaUid,
        'x-component': 'MobilePageProvider',
        'x-settings': 'mobile:page',
        'x-decorator': 'BlockItem',
        'x-toolbar-props': {
          draggable: false,
          spaceWrapperStyle: {
            right: -15,
            top: -15,
          },
          spaceClassName: 'css-m1q7xw',
          toolbarStyle: {
            overflowX: 'hidden',
          },
        },
        properties: {
          header: {
            type: 'void',
            'x-component': 'MobilePageHeader',
            properties: {
              pageNavigationBar: {
                type: 'void',
                'x-component': 'MobilePageNavigationBar',
                properties: {
                  actionBar: {
                    type: 'void',
                    'x-component': 'MobileNavigationActionBar',
                    'x-initializer': 'mobile:navigation-bar:actions',
                    'x-component-props': {
                      spaceProps: {
                        style: {
                          flexWrap: 'nowrap',
                        },
                      },
                    },
                    name: 'actionBar',
                  },
                },
                name: 'pageNavigationBar',
              },
              pageTabs: {
                type: 'void',
                'x-component': 'MobilePageTabs',
                name: 'pageTabs',
              },
            },
            name: 'header',
          },
          content: {
            type: 'void',
            'x-component': 'MobilePageContent',
            properties: {
              [firstTabUid]: {
                ...((keepUid ? pageSchema : updateUidOfPageSchema(pageSchema)) || {
                  type: 'void',
                  'x-uid': firstTabUid,
                  'x-async': true,
                  'x-component': 'Grid',
                  'x-initializer': 'mobile:addBlock',
                }),
                name: firstTabUid,
                'x-uid': firstTabUid,
              },
            },
          },
        },
      },
    },
  });
  if (!createSchemaResult.ok()) {
    throw new Error(await createSchemaResult.text());
  }
  // 创建第一个 tab
  const createTabResponse = await api.post(`/api/mobileRoutes:create`, {
    headers,
    data: {
      parentId: routeId,
      type: 'tabs',
      title: 'Unnamed',
      schemaUid: firstTabUid,
    },
  });
  if (!createTabResponse.ok()) {
    throw new Error(await createTabResponse.text());
  }
  return { url: schemaUrl, pageSchemaUid, routeId, title };
};
export const removeAllMobileRoutes = async () => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(
    `/api/mobileRoutes:destroy?filter=%7B%22%24and%22%3A%5B%7B%22id%22%3A%7B%22%24ne%22%3A0%7D%7D%5D%7D`,
    {
      headers,
    },
  );
  if (!result.ok()) {
    throw new Error(await result.text());
  }
};
/**
 * 根据页面 id 删除一个 Mobile Routes 的页面
 */
const deleteMobileRoutes = async (mobileRouteId) => {
  if (!mobileRouteId) return;
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(`/api/mobileRoutes:destroy?filterByTk=${mobileRouteId}`, {
    headers,
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  const result2 = await api.post(
    `/api/mobileRoutes:destroy?filter=${encodeURIComponent(JSON.stringify({ parentId: mobileRouteId }))}`,
    {
      headers,
    },
  );
  if (!result2.ok()) {
    throw new Error(await result2.text());
  }
};
/**
 * 根据页面 uid 删除一个页面的 schema，根据页面路由的 id 删除一个页面的路由
 */
const deletePage = async (pageUid, routeId) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  if (routeId !== undefined) {
    const routeResult = await api.post(`/api/desktopRoutes:destroy?filterByTk=${routeId}`, {
      headers,
    });
    if (!routeResult.ok()) {
      throw new Error(await routeResult.text());
    }
  }
  if (pageUid) {
    const result = await api.post(`/api/uiSchemas:remove/${pageUid}`, {
      headers,
    });
    if (!result.ok()) {
      throw new Error(await result.text());
    }
  }
};
const deleteCollections = async (collectionNames) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const params = collectionNames.map((name) => `filterByTk[]=${name}`).join('&');
  const result = await api.post(`/api/collections:destroy?${params}`, {
    headers,
    params: {
      cascade: true,
    },
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
};
/**
 * 将数据表中 mock 出来的 records 删除掉
 * @param collectionName
 * @param records
 */
export const deleteRecords = async (collectionName, filter) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(`/api/${collectionName}:destroy?filter=${JSON.stringify(filter)}`, {
    headers,
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
};
/**
 * 删除一些不需要的字段，如 key
 * @param collectionSettings
 * @returns
 */
export const omitSomeFields = (collectionSettings) => {
  return collectionSettings.map((collection) => {
    return {
      ..._.omit(collection, ['key']),
      fields: collection.fields?.map((field) => _.omit(field, ['key', 'collectionName'])),
    };
  });
};
/**
 * 根据配置创建一个或多个 collection
 * @param page 运行测试的 page 实例
 * @param collectionSettings
 * @returns
 */
const createCollections = async (collectionSettings) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  collectionSettings = Array.isArray(collectionSettings) ? collectionSettings : [collectionSettings];
  const result = await api.post(`/api/collections:mock`, {
    headers,
    data: collectionSettings,
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  return (await result.json()).data;
};
/**
 * 根据配置创建一个角色并将角色关联给superAdmin且切换到新角色
 * @param page 运行测试的 page 实例
 * @param AclRoleSetting
 * @returns
 */
const createRole = async (roleSetting) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const name = roleSetting.name || uid();
  const result = await api.post(`/api/users/1/roles:create`, {
    headers,
    data: { ...roleSetting, name, title: name },
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  const roleData = (await result.json()).data;
  await setDefaultRole(name);
  return roleData;
};
/**
 * 根据配置更新角色权限
 * @param page 运行测试的 page 实例
 * @param AclRoleSetting
 * @returns
 */
const updateRole = async (roleSetting) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const name = roleSetting.name;
  const dataSourceKey = roleSetting.dataSourceKey;
  const url = !dataSourceKey
    ? `/api/roles:update?filterByTk=${name}`
    : `/api/dataSources/${dataSourceKey}/roles:update?filterByTk=${name}`;
  const result = await api.post(url, {
    headers,
    data: { ...roleSetting },
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  const roleData = (await result.json()).data;
  return roleData;
};
/**
 * 设置默认角色
 * @param name
 */
const setDefaultRole = async (name) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(`/api/users:setDefaultRole`, {
    headers,
    data: { roleName: name },
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
};
/**
 * 创建外部数据源
 * @paramn
 */
const createExternalDataSource = async (dataSourceSetting) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(`/api/dataSources:create`, {
    headers,
    data: { ...dataSourceSetting },
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  return (await result.json()).data;
};
/**
 * 删除外部数据源
 * @paramn
 */
const destoryExternalDataSource = async (key) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(`/api/dataSources:destroy?filterByTk=${key}`, {
    headers,
  });
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  return (await result.json()).data;
};
/**
 * 根据 collection 的配置生成 Faker 数据
 * @param collectionSetting
 * @param all
 * @returns
 */
const generateFakerData = (collectionSetting) => {
  const excludeField = ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  const basicInterfaceToData = {
    input: () => faker.lorem.words(),
    textarea: () => faker.lorem.paragraph(),
    richText: () => faker.lorem.paragraph(),
    phone: () => faker.phone.number(),
    email: () => faker.internet.email(),
    url: () => faker.internet.url(),
    integer: () => faker.number.int(),
    number: () => faker.number.int(),
    percent: () => faker.number.float(),
    password: () => faker.internet.password(),
    color: () => faker.internet.color(),
    icon: () => 'checkcircleoutlined',
    datetime: () => faker.date.anytime({ refDate: '2023-09-21T00:00:00.000Z' }),
    time: () => '00:00:00',
  };
  const result = {};
  collectionSetting.fields?.forEach((field) => {
    if (field.name && excludeField.includes(field.name)) {
      return;
    }
    if (basicInterfaceToData[field.interface] && field.name) {
      result[field.name] = basicInterfaceToData[field.interface]();
    }
  });
  return result;
};
const createRandomData = async (collectionName, count = 10, data, maxDepth) => {
  const api = await request.newContext({
    storageState: process.env.PLAYWRIGHT_AUTH_FILE,
  });
  const state = await api.storageState();
  const headers = getHeaders(state);
  const result = await api.post(
    `/api/${collectionName}:mock?count=${count}&maxDepth=${_.isNumber(maxDepth) ? maxDepth : 1}`,
    {
      headers,
      data,
    },
  );
  if (!result.ok()) {
    throw new Error(await result.text());
  }
  return (await result.json()).data;
};
// 删除掉 id 不是 1 的 users 和 name 不是 root admin member 的 roles
async function removeRedundantUserAndRoles() {
  const deletePromises = [
    deleteRecords('users', { id: { $ne: 1 } }),
    deleteRecords('roles', { name: { $ne: ['root', 'admin', 'member'] } }),
  ];
  await Promise.all(deletePromises);
}
function getHeaders(storageState) {
  const headers = {};
  const token = getStorageItem('NOCOBASE_TOKEN', storageState);
  const auth = getStorageItem('NOCOBASE_AUTH', storageState);
  const subAppName = new URL(APP_BASE_URL).pathname.match(/^\/apps\/([^/]*)\/*/)?.[1];
  const hostName = new URL(APP_BASE_URL).host;
  const locale = getStorageItem('NOCOBASE_LOCALE', storageState);
  const timezone = '+08:00';
  const withAclMeta = 'true';
  const role = getStorageItem('NOCOBASE_ROLE', storageState);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (auth) {
    headers['X-Authenticator'] = auth;
  }
  if (subAppName) {
    headers['X-App'] = subAppName;
  }
  if (hostName) {
    headers['X-Hostname'] = hostName;
  }
  if (locale) {
    headers['X-Locale'] = locale;
  }
  if (timezone) {
    headers['X-Timezone'] = timezone;
  }
  if (withAclMeta) {
    headers['X-With-Acl-Meta'] = withAclMeta;
  }
  if (role) {
    headers['X-Role'] = role;
  }
  return headers;
}
/**
 * 辅助断言 SchemaSettings 的菜单项是否存在
 * @param param0
 */
export async function expectSettingsMenu({ showMenu, supportedOptions, page, unsupportedOptions }) {
  await page.waitForTimeout(100);
  await showMenu();
  await page.waitForTimeout(2000);
  for (const option of supportedOptions) {
    await expect(page.getByRole('menuitem', { name: option, exact: option === 'Edit' })).toBeVisible();
  }
  if (unsupportedOptions) {
    for (const option of unsupportedOptions) {
      await expect(page.getByRole('menuitem', { name: option, exact: option === 'Edit' })).not.toBeVisible();
    }
  }
}
/**
 * 辅助断言 Initializer 的菜单项是否存在
 * @param param0
 */
export async function expectInitializerMenu({ showMenu, supportedOptions, page, expectValue }) {
  await showMenu();
  for (const option of supportedOptions) {
    // 使用 first 方法避免有重名的导致报错
    await expect(page.getByRole('menuitem', { name: option }).first()).toBeVisible();
  }
  await page.mouse.move(300, 0);
  if (expectValue) {
    await expectValue();
  }
}
/**
 * 用于辅助在 page 中创建区块
 * @param page
 * @param name
 */
export const createBlockInPage = async (page, name) => {
  await page.getByLabel('schema-initializer-Grid-page:addBlock').hover();
  if (name === 'Form') {
    await page.getByText('Form', { exact: true }).first().hover();
  } else if (name === 'Filter form') {
    await page.getByText('Form', { exact: true }).nth(1).hover();
  } else {
    await page.getByText(name, { exact: true }).hover();
  }
  if (name === 'Markdown') {
    await page.getByRole('menuitem', { name: 'Markdown' }).click();
  } else {
    await page.getByRole('menuitem', { name: 'Users' }).click();
  }
  await page.mouse.move(300, 0);
};
export const mockUserRecordsWithoutDepartments = (mockRecords, count) => {
  return mockRecords(
    'users',
    Array.from({ length: count }).map(() => ({
      departments: null,
      mainDepartment: null,
    })),
  );
};
/**
 * 用来辅助断言是否支持某些变量
 * @param page
 * @param variables
 */
export async function expectSupportedVariables(page, variables) {
  for (const name of variables) {
    await expect(page.getByRole('menuitemcheckbox', { name })).toBeVisible();
  }
}
function schemaToRoutes(schema) {
  const schemaKeys = Object.keys(schema.properties || {});
  if (schemaKeys.length === 0) {
    return [];
  }
  const result = schemaKeys.map((key) => {
    const item = schema.properties[key];
    // Tab
    return {
      type: 'tabs',
      title: item.title || '{{t("Unnamed")}}',
      icon: item['x-component-props']?.icon,
      schemaUid: item['x-uid'],
      tabSchemaName: key,
      hideInMenu: false,
    };
  });
  return result;
}
//# sourceMappingURL=e2eUtils.js.map
