/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';
const ECharts = forwardRef(({ option, style, className, theme, onRefReady }, ref) => {
  const chartRef = useRef(null);
  // inner instance ref
  const instanceRef = useRef(null);
  const resizeObserverRef = useRef();
  // forword outside ref
  const setForwardedRef = useCallback(
    (value) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        ref.current = value;
      }
    },
    [ref],
  );
  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    // clean up old instance
    if (instanceRef.current && typeof instanceRef.current.dispose === 'function') {
      instanceRef.current.dispose();
    }
    // create new instance, and forword
    instanceRef.current = echarts.init(chartRef.current, theme);
    setForwardedRef(instanceRef.current);
    onRefReady?.(instanceRef.current);
    resizeObserverRef.current = new ResizeObserver(() => {
      instanceRef.current?.resize?.();
    });
    resizeObserverRef.current.observe(chartRef.current);
    // clean up
    return () => {
      const ins = instanceRef.current;
      if (ins && typeof ins.dispose === 'function') {
        ins.dispose();
      }
      instanceRef.current = null;
      setForwardedRef(null);
      resizeObserverRef.current?.disconnect();
    };
  }, [theme, onRefReady, setForwardedRef]);
  useEffect(() => {
    const ins = instanceRef.current;
    if (ins) {
      ins.setOption(option, true);
    }
  }, [option]);
  return React.createElement('div', {
    ref: chartRef,
    style: { width: '100%', height: 400, ...style },
    className: className,
  });
});
export default ECharts;
//# sourceMappingURL=ECharts.js.map
