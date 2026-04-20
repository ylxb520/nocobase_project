/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { escapeT } from '@nocobase/flow-engine';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ActionModel } from '@nocobase/client';
import { QRCodeScannerInner } from './components/qrcode-scanner';
const QRCodeScanner = (props) => {
    const [visible, setVisible] = useState(true);
    const { t } = useTranslation('block-workbench');
    const style = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        background: 'black',
        zIndex: 1001,
        top: 0,
        left: 0,
        overflow: 'hidden',
    };
    const backIconStyle = {
        position: 'absolute',
        top: '22px',
        left: '20px',
        zIndex: 1003,
        color: 'white',
        fontSize: '1.8em',
        fontWeight: 'bold',
    };
    const titleStyle = {
        position: 'absolute',
        color: 'white',
        fontSize: '1.5em',
        left: 0,
        right: 0,
        top: '20px',
        zIndex: 1002,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
    };
    return visible ? (React.createElement("div", { style: style },
        React.createElement(QRCodeScannerInner, { setVisible: setVisible, app: props.app, navigate: props.navigate, onClose: props.onClose }),
        React.createElement(LeftOutlined, { style: backIconStyle, onClick: () => setVisible(false) }),
        React.createElement("div", { style: titleStyle }, t('Scan QR code')))) : null;
};
export class ActionPanelScanActionModel extends ActionModel {
    onClick(event) {
        this.dispatchEvent('click', {
            event,
            ...this.getInputArgs(),
        }, {
            debounce: true,
        });
    }
    defaultProps = {
        title: escapeT('Scan QR code', { ns: 'block-workbench' }),
        icon: 'ScanOutlined',
    };
}
ActionPanelScanActionModel.registerFlow({
    key: 'actionPanelScanSettings',
    on: 'click',
    steps: {
        scanClick: {
            async handler(ctx, params) {
                const existing = document.getElementById('qr-scanner-container');
                if (existing) {
                    existing.remove();
                }
                const container = document.createElement('div');
                container.id = 'qr-scanner-container';
                document.body.appendChild(container);
                const root = ReactDOM.createRoot(container);
                const handleClose = () => {
                    root.unmount();
                    container.remove();
                };
                root.render(React.createElement(QRCodeScanner, { app: ctx.app, navigate: ctx.router.navigate, onClose: handleClose }));
            },
        },
    },
});
ActionPanelScanActionModel.define({
    label: escapeT('Scan QR code', { ns: 'block-workbench' }),
});
//# sourceMappingURL=ActionPanelScanActionModel.js.map