/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import RcVirtualList from 'rc-virtual-list';
function VirtualListInner(props, ref) {
  const { data, itemKey, itemHeight = 48, children } = props;
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const [height, setHeight] = useState(400);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    setHeight(el.clientHeight);
    return () => observer.disconnect();
  }, []);
  useImperativeHandle(ref, () => ({
    scrollTo: (arg) => {
      listRef.current?.scrollTo(arg);
    },
  }));
  return React.createElement(
    'div',
    { ref: containerRef, style: { flex: 1, overflow: 'hidden' } },
    React.createElement(
      RcVirtualList,
      { ref: listRef, data: data, itemKey: itemKey, height: height, itemHeight: itemHeight, fullHeight: false },
      children,
    ),
  );
}
export const VirtualList = forwardRef(VirtualListInner);
//# sourceMappingURL=VirtualList.js.map
