/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from '..';
import { FlowContext } from '../flowContext';
import { FlowViewContextProvider } from '../FlowContextProvider';
import { registerPopupVariable } from './createViewMeta';
import { PageComponent } from './PageComponent';
import usePatchElement from './usePatchElement';
import { VIEW_ACTIVATED_EVENT, bumpViewActivatedVersion, resolveOpenerEngine } from './viewEvents';
import { FlowEngineProvider } from '../provider';
import { createViewScopedEngine } from '../ViewScopedFlowEngine';
import { createViewRecordResolveOnServer, getViewRecordFromParent } from '../utils/variablesParams';
let uuid = 0;
/** Global embed container element ID */
export const GLOBAL_EMBED_CONTAINER_ID = 'nocobase-embed-container';
/** Dataset key used to signal embed replacement in progress (skip style reset on close) */
export const EMBED_REPLACING_DATA_KEY = 'nocobaseEmbedReplacing';
// 稳定的 Holder 组件，避免在父组件重渲染时更换组件类型导致卸载， 否则切换主题时会丢失所有页面内容
const PageElementsHolder = React.memo(
  React.forwardRef((props, ref) => {
    const [elements, patchElement] = usePatchElement();
    React.useImperativeHandle(ref, () => ({ patchElement }), [patchElement]);
    return React.createElement(React.Fragment, null, elements);
  }),
);
export function usePage() {
  const holderRef = React.useRef(null);
  const globalEmbedActiveRef = React.useRef(null);
  const open = (config, flowContext) => {
    const parentEngine = flowContext?.engine;
    uuid += 1;
    const pageRef = React.createRef();
    let closeFunc;
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    // Footer 组件实现
    const FooterComponent = ({ children }) => {
      React.useEffect(() => {
        pageRef.current?.setFooter(children);
        return () => {
          pageRef.current?.setFooter(null);
        };
      }, [children]);
      return null; // Footer 组件本身不渲染内容
    };
    // Header 组件实现
    const HeaderComponent = (props) => {
      React.useEffect(() => {
        pageRef.current?.setHeader(props);
        return () => {
          pageRef.current?.setHeader(null);
        };
      }, [props]);
      return null; // Header 组件本身不渲染内容
    };
    const {
      target,
      content,
      preventClose,
      inheritContext = true,
      inputArgs: viewInputArgs = {},
      ...restConfig
    } = config;
    const isGlobalEmbedContainer = target instanceof HTMLElement && target.id === GLOBAL_EMBED_CONTAINER_ID;
    // Global embed container uses "replace" behavior: opening a new view destroys the previous one.
    if (isGlobalEmbedContainer && globalEmbedActiveRef.current) {
      try {
        // Avoid style "reset flicker" when replacing: tell embed wrappers to skip resetting container styles.
        target.dataset[EMBED_REPLACING_DATA_KEY] = '1';
        globalEmbedActiveRef.current.destroy();
      } finally {
        delete target.dataset[EMBED_REPLACING_DATA_KEY];
        globalEmbedActiveRef.current = null;
      }
    }
    const ctx = new FlowContext();
    // 为当前视图创建作用域引擎（隔离实例与缓存）
    const scopedEngine = createViewScopedEngine(flowContext.engine);
    const openerEngine = resolveOpenerEngine(parentEngine, scopedEngine);
    ctx.defineProperty('engine', { value: scopedEngine });
    ctx.addDelegate(scopedEngine.context);
    if (inheritContext) {
      ctx.addDelegate(flowContext);
    } else {
      ctx.addDelegate(flowContext.engine.context);
    }
    // 构造 currentPage 实例
    const currentPage = {
      type: 'embed',
      inputArgs: viewInputArgs,
      preventClose: !!config.preventClose,
      destroy: (result) => {
        config.onClose?.();
        resolvePromise?.(result);
        pageRef.current?.destroy();
        closeFunc?.();
        if (isGlobalEmbedContainer) {
          globalEmbedActiveRef.current = null;
        }
        // Notify opener view that it becomes active again.
        const isReplacing =
          isGlobalEmbedContainer && target instanceof HTMLElement && target.dataset?.[EMBED_REPLACING_DATA_KEY] === '1';
        if (!isReplacing) {
          const openerEmitter = openerEngine?.emitter;
          bumpViewActivatedVersion(openerEmitter);
          openerEmitter?.emit?.(VIEW_ACTIVATED_EVENT, { type: 'embed', viewUid: currentPage?.inputArgs?.viewUid });
        }
        // 关闭时修正 previous/next 指针
        scopedEngine.unlinkFromStack();
      },
      update: (newConfig) => pageRef.current?.update(newConfig),
      close: (result, force) => {
        if (preventClose && !force) {
          return;
        }
        if (config.triggerByRouter && config.inputArgs?.navigation?.back) {
          // 交由路由系统来销毁当前视图
          config.inputArgs.navigation.back();
          return;
        }
        currentPage.destroy(result);
      },
      Header: HeaderComponent,
      Footer: FooterComponent,
      setFooter: (footer) => {
        pageRef.current?.setFooter(footer);
      },
      setHeader: (header) => {
        pageRef.current?.setHeader(header);
      },
      navigation: config.inputArgs?.navigation,
      get record() {
        // 当视图正在查看与父 record 同一条记录时，复用父记录深拷贝；否则走服务端解析
        return getViewRecordFromParent(flowContext, ctx);
      },
    };
    ctx.defineProperty('view', {
      get: () => currentPage,
      // 仅当访问关联字段或前端无本地记录数据时，才交给服务端解析
      resolveOnServer: createViewRecordResolveOnServer(ctx, () => getViewRecordFromParent(flowContext, ctx)),
    });
    // 顶层 popup 变量：弹窗记录/数据源/上级弹窗链（去重封装）
    registerPopupVariable(ctx, currentPage);
    const PageWithContext = observer(
      () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const mountedRef = React.useRef(false);
        // 支持 content 为函数，传递 currentPage
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const pageContent = React.useMemo(
          () => (typeof content === 'function' ? content(currentPage, ctx) : content),
          [],
        );
        // 响应themeToken的响应式更新
        void ctx.themeToken;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
          config.onOpen?.(currentPage, ctx);
        }, []);
        if (config.inputArgs?.hidden?.value && !mountedRef.current) {
          return null;
        }
        mountedRef.current = true;
        return React.createElement(
          PageComponent,
          {
            ref: pageRef,
            hidden: config.inputArgs?.hidden?.value,
            ...restConfig,
            onClose: () => {
              currentPage.close(config.result);
            },
          },
          pageContent,
        );
      },
      {
        displayName: 'PageWithContext',
      },
    );
    const key = viewInputArgs?.viewUid || `page-${uuid}`;
    const page = React.createElement(
      FlowEngineProvider,
      { key: key, engine: scopedEngine },
      React.createElement(FlowViewContextProvider, { context: ctx }, React.createElement(PageWithContext, null)),
    );
    if (target && target instanceof HTMLElement) {
      closeFunc = holderRef.current?.patchElement(ReactDOM.createPortal(page, target, key));
    } else {
      closeFunc = holderRef.current?.patchElement(page);
    }
    if (isGlobalEmbedContainer) {
      globalEmbedActiveRef.current = { destroy: currentPage.destroy };
    }
    return Object.assign(promise, currentPage);
  };
  const api = React.useMemo(() => ({ open }), []);
  return [api, React.createElement(PageElementsHolder, { key: 'page-holder', ref: holderRef })];
}
//# sourceMappingURL=usePage.js.map
