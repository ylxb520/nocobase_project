/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { QrcodeOutlined } from '@ant-design/icons';
import { Button, Popover, QRCode } from 'antd';
import React, { useState } from 'react';
import { css, DesignableSwitch, Icon, useApp, useUIConfigurationPermissions } from '@nocobase/client';
import { usePluginTranslation } from '../locale';
import { useSize } from './sizeContext';
const PadSvg = () => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("title", null, "pad icon"),
    React.createElement("rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", ry: "2" }),
    React.createElement("line", { x1: "12", x2: "12.01", y1: "18", y2: "18" })));
const MobileSvg = () => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("title", null, "mobile icon"),
    React.createElement("rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }),
    React.createElement("path", { d: "M12 18h.01" })));
const PadIcon = (props) => React.createElement(Icon, { type: '', component: PadSvg, ...props });
const MobileIcon = (props) => React.createElement(Icon, { type: '', component: MobileSvg, ...props });
export const DesktopModeHeader = () => {
    const { t } = usePluginTranslation();
    const app = useApp();
    const { setSize } = useSize();
    const [open, setOpen] = useState(false);
    const { allowConfigUI } = useUIConfigurationPermissions();
    const handleQRCodeOpen = (newOpen) => {
        setOpen(newOpen);
    };
    return (React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', height: '100%' }, className: css `
        .ant-btn {
          border: 0;
          height: 46px;
          width: 46px;
          border-radius: 0;
          background: none;
          color: rgba(255, 255, 255, 0.65);
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }

          svg {
            width: 20px !important;
            height
          }
        }
        .ant-btn-default {
          box-shadow: none;
        }
      ` },
        React.createElement(Button, { style: { color: 'white' }, href: app.getHref('/admin') }, t('Back')),
        React.createElement("div", { style: { display: 'flex', alignItems: 'center', lineHeight: 1 } },
            allowConfigUI ? React.createElement(DesignableSwitch, { style: { fontSize: 16 } }) : null,
            React.createElement(Button, { onClick: () => {
                    setSize({ width: 768, height: 667 });
                }, "data-testid": "desktop-mode-size-pad", icon: React.createElement(PadIcon, null) }),
            React.createElement(Button, { onClick: () => {
                    setSize({ width: 375, height: 667 });
                }, "data-testid": "desktop-mode-size-mobile", icon: React.createElement(MobileIcon, null) }),
            React.createElement(Popover, { trigger: 'hover', open: open, onOpenChange: handleQRCodeOpen, content: open ? React.createElement(QRCode, { value: window.location.href, bordered: false }) : ' ' },
                React.createElement(Button, { icon: React.createElement(QrcodeOutlined, { style: { fontSize: '24px', cursor: 'pointer' }, "data-testid": "desktop-mode-qrcode" }) })))));
};
//# sourceMappingURL=Header.js.map