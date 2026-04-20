/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ConfigProvider } from 'antd';
import { Popup } from 'antd-mobile';
import React, { useMemo } from 'react';
import { CloseOutline } from 'antd-mobile-icons';
import { useMobileActionDrawerStyle } from './MobilePopup.style';
import { useTranslation } from 'react-i18next';
export const MobilePopup = (props) => {
  const { title, visible, onClose: closePopup, children, minHeight, className, footer } = props;
  const { t } = useTranslation();
  const { componentCls, hashId } = useMobileActionDrawerStyle();
  const style = useMemo(() => {
    return {
      minHeight,
    };
  }, [minHeight]);
  const theme = useMemo(() => {
    return {
      token: {
        paddingPageHorizontal: 8,
        paddingPageVertical: 8,
        marginBlock: 12,
        borderRadiusBlock: 8,
        fontSize: 14,
      },
    };
  }, []);
  return React.createElement(
    ConfigProvider,
    { theme: theme },
    React.createElement(
      Popup,
      {
        className: `${componentCls} ${hashId} ${className || ''}`,
        visible: visible,
        onClose: closePopup,
        onMaskClick: closePopup,
        bodyClassName: 'nb-mobile-action-drawer-body',
        bodyStyle: {
          padding: 0,
        },
        maskStyle: style,
        style: style,
        destroyOnClose: true,
      },
      React.createElement(
        'div',
        { className: 'nb-mobile-action-drawer-header' },
        React.createElement(
          'span',
          { className: 'nb-mobile-action-drawer-placeholder' },
          React.createElement(CloseOutline, null),
        ),
        React.createElement('span', null, title),
        React.createElement(
          'span',
          {
            className: 'nb-mobile-action-drawer-close-icon',
            onClick: closePopup,
            role: 'button',
            tabIndex: 0,
            'aria-label': t('Close'),
          },
          React.createElement(CloseOutline, null),
        ),
      ),
      children,
      footer && React.createElement('div', { className: 'nb-mobile-action-drawer-footer' }, footer),
    ),
  );
};
//# sourceMappingURL=MobilePopup.js.map
