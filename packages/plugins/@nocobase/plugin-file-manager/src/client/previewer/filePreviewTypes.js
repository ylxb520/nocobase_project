/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { DownloadOutlined, LeftOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined, } from '@ant-design/icons';
import { Alert, Image, Modal, Space } from 'antd';
import { matchMimetype } from '@nocobase/client';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACE } from '../locale';
export class FilePreviewTypes {
    types = [];
    add(type) {
        // NOTE: use unshift to make sure the custom type has higher priority
        this.types.unshift(type);
    }
    getTypeByFile(file) {
        const normalized = normalizePreviewFile(file);
        return this.types.find((type) => type.match(normalized));
    }
}
export const filePreviewTypes = new FilePreviewTypes();
export function normalizePreviewFile(file) {
    if (!file) {
        return file;
    }
    if (typeof file === 'string') {
        return { url: file };
    }
    return file;
}
export function getPreviewFileUrl(file) {
    if (!file) {
        return '';
    }
    if (typeof file === 'string') {
        return file;
    }
    return file.preview || file.url || '';
}
export function getFileUrl(file) {
    if (!file) {
        return '';
    }
    if (typeof file === 'string') {
        return file;
    }
    return file.url || file.preview || '';
}
const FALLBACK_ICON_MAP = {
    pdf: '/file-placeholder/pdf-200-200.png',
    mp4: '/file-placeholder/video-200-200.png',
    mov: '/file-placeholder/video-200-200.png',
    avi: '/file-placeholder/video-200-200.png',
    wmv: '/file-placeholder/video-200-200.png',
    flv: '/file-placeholder/video-200-200.png',
    mkv: '/file-placeholder/video-200-200.png',
    mp3: '/file-placeholder/audio-200-200.png',
    wav: '/file-placeholder/audio-200-200.png',
    aac: '/file-placeholder/audio-200-200.png',
    ogg: '/file-placeholder/audio-200-200.png',
    doc: '/file-placeholder/docx-200-200.png',
    docx: '/file-placeholder/docx-200-200.png',
    odt: '/file-placeholder/docx-200-200.png',
    xls: '/file-placeholder/xlsx-200-200.png',
    xlsx: '/file-placeholder/xlsx-200-200.png',
    csv: '/file-placeholder/xlsx-200-200.png',
    ppt: '/file-placeholder/pptx-200-200.png',
    pptx: '/file-placeholder/pptx-200-200.png',
    jpg: '/file-placeholder/jpeg-200-200.png',
    jpeg: '/file-placeholder/jpeg-200-200.png',
    png: '/file-placeholder/png-200-200.png',
    gif: '/file-placeholder/gif-200-200.png',
    webp: '/file-placeholder/png-200-200.png',
    bmp: '/file-placeholder/png-200-200.png',
    svg: '/file-placeholder/svg-200-200.png',
    default: '/file-placeholder/unknown-200-200.png',
};
const stripQueryAndHash = (url) => url.split('?')[0].split('#')[0];
const getExtFromName = (value) => {
    if (!value) {
        return '';
    }
    const clean = stripQueryAndHash(value);
    const index = clean.lastIndexOf('.');
    return index !== -1 ? clean.slice(index + 1).toLowerCase() : '';
};
const getNameFromUrl = (url) => {
    if (!url) {
        return '';
    }
    const clean = stripQueryAndHash(url);
    const index = clean.lastIndexOf('/');
    return index !== -1 ? clean.slice(index + 1) : clean;
};
export const getFileExt = (file, url) => {
    if (file && typeof file === 'object') {
        if (file.extname) {
            return String(file.extname).replace(/^\./, '').toLowerCase();
        }
        const nameExt = getExtFromName(file.name || file.filename || file.title);
        if (nameExt) {
            return nameExt;
        }
    }
    return getExtFromName(url);
};
export const getFileName = (file, url) => {
    const nameFromUrl = getNameFromUrl(url);
    if (!file || typeof file === 'string') {
        return nameFromUrl;
    }
    return file.name || file.filename || file.title || nameFromUrl;
};
export const getFallbackIcon = (file, url) => {
    const ext = getFileExt(file, url);
    return FALLBACK_ICON_MAP[ext] || FALLBACK_ICON_MAP.default;
};
export const getPreviewThumbnailUrl = (file) => {
    const previewFile = normalizePreviewFile(file);
    const src = getPreviewFileUrl(previewFile);
    const { getThumbnailURL } = filePreviewTypes.getTypeByFile(previewFile) ?? {};
    const thumbnail = getThumbnailURL?.(previewFile);
    if (thumbnail) {
        return thumbnail;
    }
    if (matchMimetype(previewFile, 'image/*')) {
        return '';
    }
    return getFallbackIcon(previewFile, src);
};
const renderModalFooter = (props) => {
    const { index, list, onSwitchIndex, onDownload, file } = props;
    const canPrev = typeof index === 'number' && !!onSwitchIndex && index > 0;
    const canNext = typeof index === 'number' && !!onSwitchIndex && index < list.length - 1;
    return (React.createElement(Space, { size: 14, style: { fontSize: '20px' } },
        React.createElement(LeftOutlined, { style: { cursor: canPrev ? 'pointer' : 'not-allowed' }, disabled: !canPrev, onClick: () => canPrev && onSwitchIndex?.(index - 1) }),
        React.createElement(RightOutlined, { style: { cursor: canNext ? 'pointer' : 'not-allowed' }, disabled: !canNext, onClick: () => canNext && onSwitchIndex?.(index + 1) }),
        React.createElement(DownloadOutlined, { onClick: () => onDownload(file) })));
};
export const wrapWithModalPreviewer = (Previewer) => {
    return function WrappedPreviewer(props) {
        const { open, onOpenChange, onClose, file } = props;
        if (typeof open !== 'boolean') {
            return React.createElement(Previewer, { ...props });
        }
        const title = getFileName(file, getFileUrl(file));
        return (React.createElement(Modal, { open: open, title: title, onCancel: () => {
                onOpenChange?.(false);
                onClose?.();
            }, footer: renderModalFooter(props), width: "90vw", centered: true },
            React.createElement("div", { style: {
                    maxWidth: '100%',
                    maxHeight: 'calc(100vh - 256px)',
                    height: '80vh',
                    width: '100%',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflowY: 'auto',
                } },
                React.createElement(Previewer, { ...props }))));
    };
};
const ImagePreviewer = (props) => {
    const { file, list, index, open, onOpenChange, onSwitchIndex, onClose, onDownload } = props;
    if (typeof open !== 'boolean') {
        return null;
    }
    const src = getFileUrl(file);
    if (!src) {
        return null;
    }
    const canPrev = typeof index === 'number' && index > 0;
    const canNext = typeof index === 'number' && index < list.length - 1;
    return (React.createElement(Image, { wrapperStyle: { display: 'none' }, preview: {
            visible: open,
            onVisibleChange: (visible) => onOpenChange?.(visible),
            afterOpenChange: (visible) => {
                if (!visible) {
                    onClose?.();
                }
            },
            toolbarRender: (_, { transform: { scale }, actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn, onReset }, }) => (React.createElement(Space, { size: 14, className: "toolbar-wrapper", style: { fontSize: '20px' } },
                React.createElement(LeftOutlined, { style: { cursor: canPrev ? 'pointer' : 'not-allowed' }, disabled: !canPrev, onClick: () => canPrev && onSwitchIndex?.(index - 1) }),
                React.createElement(RightOutlined, { style: { cursor: canNext ? 'pointer' : 'not-allowed' }, disabled: !canNext, onClick: () => canNext && onSwitchIndex?.(index + 1) }),
                onDownload ? React.createElement(DownloadOutlined, { onClick: () => onDownload(file) }) : null,
                React.createElement(SwapOutlined, { rotate: 90, onClick: onFlipY }),
                React.createElement(SwapOutlined, { onClick: onFlipX }),
                React.createElement(RotateLeftOutlined, { onClick: onRotateLeft }),
                React.createElement(RotateRightOutlined, { onClick: onRotateRight }),
                React.createElement(ZoomOutOutlined, { disabled: scale === 1, onClick: onZoomOut }),
                React.createElement(ZoomInOutlined, { disabled: scale === 50, onClick: onZoomIn }),
                React.createElement(UndoOutlined, { onClick: onReset }))),
        }, src: src }));
};
const IframePreviewer = ({ file }) => {
    const src = getFileUrl(file);
    if (!src) {
        return null;
    }
    return React.createElement("iframe", { src: src, width: "100%", height: "100%", style: { border: 'none' } });
};
const AudioPreviewer = ({ file }) => {
    const { t } = useTranslation();
    const src = getFileUrl(file);
    if (!src) {
        return null;
    }
    return (React.createElement("audio", { controls: true },
        React.createElement("source", { src: src, type: file?.type || file?.mimetype }),
        t('Your browser does not support the audio tag.')));
};
const VideoPreviewer = ({ file }) => {
    const { t } = useTranslation();
    const src = getFileUrl(file);
    if (!src) {
        return null;
    }
    return (React.createElement("video", { controls: true, width: "100%", height: "100%" },
        React.createElement("source", { src: src, type: file?.type || file?.mimetype }),
        t('Your browser does not support the video tag.')));
};
const UnsupportedPreviewer = (props) => {
    const { t } = useTranslation();
    const { file } = props;
    return (React.createElement(Alert, { type: "warning", description: React.createElement(Trans, { ns: NAMESPACE },
            'File type is not supported for previewing, please ',
            props.onDownload ? (React.createElement("a", { onClick: () => props.onDownload?.(file), style: { textDecoration: 'underline', cursor: 'pointer' } }, 'download it to preview')) : (React.createElement("span", null, 'download it to preview'))), showIcon: true }));
};
filePreviewTypes.add({
    match() {
        return true;
    },
    Previewer: wrapWithModalPreviewer(UnsupportedPreviewer),
});
filePreviewTypes.add({
    match(file) {
        return matchMimetype(file, 'image/*');
    },
    getThumbnailURL(file) {
        return getPreviewFileUrl(file);
    },
    Previewer: ImagePreviewer,
});
filePreviewTypes.add({
    match(file) {
        return ['text/plain', 'application/pdf', 'application/json'].some((type) => matchMimetype(file, type));
    },
    Previewer: wrapWithModalPreviewer(IframePreviewer),
});
filePreviewTypes.add({
    match(file) {
        return matchMimetype(file, 'audio/*');
    },
    Previewer: wrapWithModalPreviewer(AudioPreviewer),
});
filePreviewTypes.add({
    match(file) {
        return matchMimetype(file, 'video/*');
    },
    Previewer: wrapWithModalPreviewer(VideoPreviewer),
});
export const FilePreviewRenderer = (props) => {
    const normalized = normalizePreviewFile(props.file);
    if (!normalized) {
        return null;
    }
    const { Previewer } = filePreviewTypes.getTypeByFile(normalized) ?? {};
    if (!Previewer) {
        return null;
    }
    return React.createElement(Previewer, { ...props, file: normalized });
};
//# sourceMappingURL=filePreviewTypes.js.map