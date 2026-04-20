/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Popover } from 'antd';
import DOMPurify from 'dompurify';
import * as React from 'react';
import usePatchElement from './usePatchElement';
let uuid = 0;
// 独立 PopoverComponent，参考 DrawerComponent 实现
const PopoverComponent = React.forwardRef(({ afterClose, content, placement, rect, ...props }, ref) => {
  const [visible, setVisible] = React.useState(true);
  const [config, setConfig] = React.useState({ content, placement, rect, ...props });
  React.useImperativeHandle(ref, () => ({
    destroy: () => setVisible(false),
    update: (newConfig) => setConfig((prev) => ({ ...prev, ...newConfig })),
    close: (result, _force) => setVisible(false),
  }));
  // 关闭后触发 afterClose
  React.useEffect(() => {
    if (!visible) {
      afterClose?.();
    }
  }, [visible, afterClose]);
  return React.createElement(
    Popover,
    {
      arrow: false,
      open: visible,
      trigger: ['click'],
      destroyTooltipOnHide: true,
      content: config.content,
      placement: config.placement,
      getPopupContainer: () => document.querySelector('#nocobase-app-container') || document.body,
      onOpenChange: (nextOpen) => {
        if (!nextOpen && config.preventClose) {
          return;
        }
        setVisible(nextOpen);
        if (!nextOpen) {
          afterClose?.();
        }
      },
      ...config,
    },
    React.createElement('span', {
      style: {
        position: 'absolute',
        top: (config.rect?.top ?? 0) + window.scrollY,
        left: (config.rect?.left ?? 0) + window.scrollX,
        width: 0,
        height: 0,
      },
    }),
  );
});
export function usePopover() {
  const holderRef = React.useRef(null);
  const open = (config) => {
    uuid += 1;
    const { target, placement = 'rightTop', content, ...rest } = config;
    const popoverRef = React.createRef();
    // 计算目标位置
    const rect = target?.getBoundingClientRect?.() ?? { top: 0, left: 0 };
    // eslint-disable-next-line prefer-const
    let closeFunc;
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    // 构造 currentPopover 实例
    const currentPopover = {
      type: 'popover',
      destroy: () => popoverRef.current?.destroy(),
      update: (newConfig) => popoverRef.current?.update(newConfig),
      close: (result) => {
        resolvePromise?.(result);
        popoverRef.current?.close(result);
      },
    };
    const rawChildren = typeof content === 'function' ? content(currentPopover) : content;
    const children =
      typeof rawChildren === 'string'
        ? React.createElement('div', { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(rawChildren) } })
        : rawChildren;
    const popover = React.createElement(PopoverComponent, {
      key: `popover-${uuid}`,
      ref: popoverRef,
      content: children,
      placement: placement,
      rect: rect,
      afterClose: () => {
        closeFunc?.();
        config.onClose?.();
        resolvePromise?.(config.result);
      },
      ...rest,
    });
    closeFunc = holderRef.current?.patchElement(popover);
    return Object.assign(promise, currentPopover);
  };
  const api = React.useMemo(() => ({ open }), []);
  const ElementsHolder = React.memo(
    React.forwardRef((props, ref) => {
      const [elements, patchElement] = usePatchElement();
      React.useImperativeHandle(ref, () => ({ patchElement }), []);
      return React.createElement(React.Fragment, null, elements);
    }),
  );
  return [api, React.createElement(ElementsHolder, { key: 'popover-holder', ref: holderRef })];
}
//# sourceMappingURL=usePopover.js.map
