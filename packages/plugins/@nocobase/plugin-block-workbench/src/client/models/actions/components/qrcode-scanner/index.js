/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FileImageOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScanBox } from './ScanBox';
import { useScanner } from './useScanner';
const qrcodeEleId = 'qrcode';
export const QRCodeScannerInner = ({ setVisible, app, navigate, onClose }) => {
    const containerRef = useRef();
    const imgUploaderRef = useRef();
    const { t } = useTranslation('block-workbench');
    const [originVideoSize, setOriginVideoSize] = useState({ width: 0, height: 0 });
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const onScanSuccess = useCallback((text) => {
        setVisible(false);
    }, [setVisible]);
    const { startScanFile } = useScanner({
        onScannerSizeChanged: setOriginVideoSize,
        elementId: qrcodeEleId,
        onScanSuccess,
        app,
        navigate,
    });
    const getBoxStyle = () => {
        const size = Math.floor(Math.min(vw, vh) * 0.6);
        return {
            left: `${(vw - size) / 2}px`,
            top: `${(vh - size) / 2}px`,
            position: 'fixed',
            width: `${size}px`,
            height: `${size}px`,
        };
    };
    const onImgBtnClick = () => {
        if (imgUploaderRef.current)
            imgUploaderRef.current.click();
    };
    const onImgUploaded = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.size < 1000000)
                startScanFile(file);
            else
                alert(t('The image size is too large. Please compress it to below 1MB before uploading'));
        }
    };
    useEffect(() => {
        document.documentElement.style.overscrollBehavior = 'none';
        return () => {
            document.documentElement.style.overscrollBehavior = 'default';
        };
    }, []);
    useEffect(() => {
        const { width, height } = originVideoSize;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        if (width > 0 && height > 0 && height < vh) {
            const zoomRatio = vh / height;
            const zoomedWidth = Math.floor(zoomRatio * width);
            const video = document.getElementsByTagName('video')[0];
            video.style.height = `${vh}px`;
            video.style.width = `${zoomedWidth}px`;
            containerRef.current.style.left = `${(vw - zoomedWidth) / 2}px`;
            containerRef.current.style.position = `absolute`;
        }
    }, [originVideoSize]);
    const ToolBar = () => {
        return (React.createElement("div", { style: { position: 'absolute', bottom: '20px', left: '20px', padding: '10px 60px' } },
            React.createElement("div", { style: {
                    color: 'white',
                    width: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                } },
                React.createElement(FileImageOutlined, { style: imageBtnStyle, onClick: onImgBtnClick }),
                t('Album'),
                React.createElement("input", { ref: imgUploaderRef, type: "file", accept: "image/*", onChange: onImgUploaded, style: { visibility: 'hidden' } }))));
    };
    const imageBtnStyle = {
        zIndex: '1003',
        fontSize: '1.8em',
        fontWeight: 'bold',
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: containerRef, id: qrcodeEleId, style: { position: 'absolute' } }),
        React.createElement(ScanBox, { style: { ...getBoxStyle() } }),
        React.createElement(ToolBar, null)));
};
//# sourceMappingURL=index.js.map