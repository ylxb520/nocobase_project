/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useFlowEngine } from '../provider';
export const PageComponent = forwardRef((props, ref) => {
  const [newConfig, setNewConfig] = React.useState({});
  const mergedProps = { ...props, ...newConfig };
  const {
    visible = true,
    footer: _footer = null,
    header: _header = null,
    children,
    hidden,
    title: _title,
    styles = {},
    zIndex = 4, // 这个默认值是为了防止表格的阴影显示到子页面上面
  } = mergedProps;
  const closedRef = useRef(false);
  const flowEngine = useFlowEngine();
  const [footer, setFooter] = useState(() => _footer);
  const [header, setHeader] = useState(_header);
  // 提供 destroy 和 update 能力
  useImperativeHandle(ref, () => ({
    destroy: () => {
      if (!closedRef.current) {
        closedRef.current = true;
      }
    },
    update: (newConfig) => {
      setNewConfig(newConfig);
    },
    setFooter: (newFooter) => {
      setFooter(newFooter);
    },
    setHeader: (newHeader) => {
      if (Object.values(newHeader || {}).length === 0) {
        setHeader(null);
      } else {
        setHeader(newHeader);
      }
    },
  }));
  const style = useMemo(
    () => ({
      display: hidden ? 'none' : 'flex',
      flexDirection: 'column',
      height: '100%',
      zIndex,
    }),
    [hidden, zIndex],
  );
  // Header 组件
  const HeaderComponent = useMemo(() => {
    if (!header && !_title) return null;
    const { title = _title, extra } = header || {};
    const token = flowEngine.context.themeToken;
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${token.paddingSM}px ${token.padding}px`,
          borderBottom: `1px solid ${token.colorSplit}`,
          backgroundColor: token.colorBgContainer,
          ...styles.header,
        },
      },
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: token.marginXS } },
        React.createElement(Button, {
          type: 'text',
          size: 'small',
          icon: React.createElement(CloseOutlined, null),
          onClick: () => {
            if (!closedRef.current) {
              closedRef.current = true;
              props.onClose?.();
            }
          },
          style: {
            color: token.colorTextTertiary,
          },
        }),
        title &&
          React.createElement(
            'div',
            {
              style: {
                fontSize: token.fontSizeLG,
                fontWeight: token.fontWeightStrong,
                color: token.colorText,
              },
            },
            title,
          ),
      ),
      extra && React.createElement('div', null, extra),
    );
  }, [header, _title, flowEngine.context.themeToken, styles.header, props.onClose]);
  // Footer 组件
  const FooterComponent = useMemo(() => {
    if (!footer) return null;
    const token = flowEngine.context.themeToken;
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: `${token.paddingXS}px ${token.padding}px`,
          borderTop: `1px solid ${token.colorSplit}`,
          backgroundColor: token.colorBgContainer,
          ...styles.footer,
        },
      },
      footer,
    );
  }, [footer, flowEngine.context.themeToken, styles.footer]);
  if (!visible) return null;
  return React.createElement(
    'div',
    { style: { ...style, ...styles.content } },
    HeaderComponent,
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', ...styles.body } }, children),
    FooterComponent,
  );
});
//# sourceMappingURL=PageComponent.js.map
