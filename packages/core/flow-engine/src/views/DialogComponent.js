/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
const DialogComponent = forwardRef(
  ({ afterClose, footer: initialFooter, header: initialHeader, hidden, ...props }, ref) => {
    const [visible, setVisible] = useState(true);
    const [config, setConfig] = useState(props);
    const [footer, setFooter] = useState(() => initialFooter);
    const [header, setHeader] = useState(initialHeader);
    useImperativeHandle(ref, () => ({
      destroy: () => {
        setVisible(false);
        afterClose?.();
      },
      update: (newConfig) => setConfig((prev) => ({ ...prev, ...newConfig })),
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
    // 处理 header 配置
    const modalProps = {
      ...config,
      title: header?.title || config.title,
      extra: header?.extra,
      footer: footer !== undefined ? footer : config.footer ?? null,
    };
    const container = React.useMemo(() => {
      return document.querySelector('#nocobase-app-container');
    }, []);
    return React.createElement(
      Modal,
      {
        closable: false,
        rootClassName: hidden ? 'nb-hidden' : '',
        getContainer: container,
        ...modalProps,
        open: visible,
        onCancel: config.onCancel,
        afterClose: () => {
          afterClose?.();
        },
      },
      config.children,
    );
  },
);
export default DialogComponent;
//# sourceMappingURL=DialogComponent.js.map
