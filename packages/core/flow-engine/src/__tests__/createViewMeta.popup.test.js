/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { describe, it, expect, vi } from 'vitest';
import { FlowContext } from '../flowContext';
import { FlowEngine } from '../flowEngine';
import { createPopupMeta } from '../views/createViewMeta';
describe('createPopupMeta - popup variables', () => {
  function makeCtx() {
    const engine = new FlowEngine();
    const ctx = new FlowContext();
    ctx.defineProperty('engine', { value: engine });
    // 简化 i18n：直接返回 key
    ctx.defineProperty('t', { value: (s) => s });
    return { engine, ctx };
  }
  it('buildVariablesParams(record) uses anchor view instead of ctx.view', async () => {
    const { engine, ctx } = makeCtx();
    // 模拟锚定弹窗视图（被测试目标）
    const anchorView = {
      type: 'embed',
      inputArgs: {},
      Header: null,
      Footer: null,
      close: () => void 0,
      update: () => void 0,
      navigation: {
        viewStack: [
          {
            viewUid: 'base-page-uid',
          },
          {
            viewUid: 'popup-uid',
            filterByTk: 111,
            sourceId: 42,
          },
        ],
      },
    };
    // ctx.view 指向另一个（例如设置弹窗）
    ctx.defineProperty('view', {
      value: {
        type: 'dialog',
        inputArgs: {},
        navigation: {
          viewStack: [
            {
              viewUid: 'settings-uid',
              filterByTk: 9999,
            },
          ],
        },
      },
    });
    // 为两个视图 uid 注入不同的 openView 配置，确保只取锚定视图
    const popupModel = {
      getStepParams: vi.fn((_fk, sk) =>
        sk === 'openView'
          ? {
              collectionName: 'posts',
              dataSourceKey: 'main',
              associationName: 'users.posts',
            }
          : undefined,
      ),
    };
    const settingsModel = {
      getStepParams: vi.fn((_fk, sk) =>
        sk === 'openView'
          ? {
              collectionName: 'comments',
              dataSourceKey: 'main',
            }
          : undefined,
      ),
    };
    const getModelSpy = vi.spyOn(engine, 'getModel');
    getModelSpy.mockImplementation((uid) => (uid === 'popup-uid' ? popupModel : settingsModel));
    const metaFactory = createPopupMeta(ctx, anchorView);
    const meta = await metaFactory();
    // record 应来自锚定视图的 openView 配置
    const vars = await meta.buildVariablesParams(ctx);
    expect(vars).toBeTruthy();
    expect(vars.record).toEqual({
      collection: 'posts',
      dataSourceKey: 'main',
      filterByTk: 111,
      associationName: 'users.posts',
      sourceId: 42,
    });
    // 确认没有误用 ctx.view（settings-uid）的集合
    expect(vars.record.collection).not.toBe('comments');
  });
  it('properties() provides a record factory node (lazy) with title', async () => {
    const { engine, ctx } = makeCtx();
    // 只要能通过 anchorView 推断到集合名和主键即可；集合详情在懒加载时再取
    const anchorView = {
      type: 'embed',
      inputArgs: {},
      Header: null,
      Footer: null,
      close: () => void 0,
      update: () => void 0,
      navigation: { viewStack: [{ viewUid: 'base-page-uid' }, { viewUid: 'popup-uid', filterByTk: 1 }] },
    };
    const popupModel = {
      getStepParams: vi.fn((_fk, sk) =>
        sk === 'openView'
          ? {
              collectionName: 'tasks',
              dataSourceKey: 'main',
            }
          : undefined,
      ),
    };
    vi.spyOn(engine, 'getModel').mockImplementation(() => popupModel);
    const meta = await createPopupMeta(ctx, anchorView)();
    const props = typeof meta.properties === 'function' ? await meta.properties() : meta.properties || {};
    // 断言存在 record 节点工厂，且有标题（懒加载，不触发集合访问）
    expect(typeof props.record).toBe('function');
    expect(props.record.title).toBe('Current popup record');
    expect(props.record.hasChildren).toBe(true);
  });
  it('treats views with openerUids as popup (meta visible)', async () => {
    const { ctx } = makeCtx();
    // openerUids 作为路由栈缺失时的兜底标记：即使没有 navigation.viewStack，也应展示 ctx.popup 元信息
    const anchorView = {
      type: 'dialog',
      inputArgs: {
        openerUids: ['opener-uid-1'],
        viewUid: 'popup-uid',
        dataSourceKey: 'main',
        collectionName: 'posts',
        filterByTk: 1,
      },
      Header: null,
      Footer: null,
      close: () => void 0,
      update: () => void 0,
    };
    const meta = await createPopupMeta(ctx, anchorView)();
    expect(typeof meta.hidden).toBe('function');
    expect(meta.hidden()).toBe(false);
    expect(typeof meta.disabled).toBe('function');
    expect(meta.disabled()).toBe(false);
    const vars = await meta.buildVariablesParams(ctx);
    expect(vars).toBeTruthy();
    expect(vars.record).toEqual({
      collection: 'posts',
      dataSourceKey: 'main',
      filterByTk: 1,
      associationName: undefined,
      sourceId: undefined,
    });
  });
  it('does not expose popup.record without filterByTk', async () => {
    const { ctx } = makeCtx();
    const anchorView = {
      type: 'dialog',
      inputArgs: {
        openerUids: ['opener-uid-1'],
        viewUid: 'popup-uid',
        dataSourceKey: 'main',
        collectionName: 'posts',
        // filterByTk 缺失：不应展示“当前弹窗记录”变量
      },
      Header: null,
      Footer: null,
      close: () => void 0,
      update: () => void 0,
    };
    ctx.defineProperty('view', { value: anchorView });
    const meta = await createPopupMeta(ctx, anchorView)();
    const props = typeof meta.properties === 'function' ? await meta.properties() : meta.properties || {};
    expect(props.record).toBeUndefined();
  });
});
//# sourceMappingURL=createViewMeta.popup.test.js.map
