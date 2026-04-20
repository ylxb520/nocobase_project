/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DetailsItemModel, FieldModel, TableColumnModel, css } from '@nocobase/client';
import { tExpr, DisplayItemModel } from '@nocobase/flow-engine';
import { Image, Space, Tooltip } from 'antd';
import { castArray } from 'lodash';
import React from 'react';
import { FilePreviewRenderer, getFallbackIcon, getFileExt, getFileName, getPreviewThumbnailUrl, getPreviewFileUrl, normalizePreviewFile, } from '../previewer/filePreviewTypes';
const FilePreview = ({ file, size, showFileName, onClick, }) => {
    const previewFile = normalizePreviewFile(file);
    const src = getPreviewFileUrl(previewFile);
    if (!src) {
        return;
    }
    const fileName = getFileName(previewFile, src);
    const fallback = getFallbackIcon(previewFile, src);
    const thumbnail = getPreviewThumbnailUrl(previewFile) || fallback;
    const imageNode = (React.createElement("div", { className: css `
        .ant-image-img {
          border: 1px solid #d9d9d9;
          padding: 2px;
        }
      ` },
        React.createElement(Image, { src: thumbnail, fallback: fallback, width: size, height: size, preview: false, style: {
                borderRadius: 4,
                objectFit: 'cover',
                boxShadow: '0 0 0 2px #fff',
            } })));
    return (React.createElement("div", { onClick: onClick, style: {
            textAlign: 'center',
            width: size,
            wordBreak: 'break-all',
            cursor: onClick ? 'pointer' : 'default',
        } },
        imageNode,
        showFileName && (React.createElement(Tooltip, { title: fileName },
            React.createElement("div", { style: {
                    fontSize: 12,
                    marginTop: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                } }, fileName)))));
};
const Preview = (props) => {
    const { value = [], size = 28, showFileName } = props;
    const [current, setCurrent] = React.useState(0);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const list = React.useMemo(() => castArray(value)
        .filter(Boolean)
        .map(normalizePreviewFile)
        .filter((file) => getPreviewFileUrl(file)), [value]);
    React.useEffect(() => {
        if (current >= list.length && list.length) {
            setCurrent(0);
        }
    }, [current, list.length]);
    React.useEffect(() => {
        if (!list.length && previewOpen) {
            setPreviewOpen(false);
        }
    }, [list.length, previewOpen]);
    const onDownload = React.useCallback((fileOverride) => {
        const file = fileOverride || list[current];
        if (!file) {
            return;
        }
        const url = file.url || file.preview;
        if (!url) {
            return;
        }
        let filename = getFileName(file, url);
        const ext = getFileExt(file, url);
        if (filename && ext && !filename.toLowerCase().endsWith(`.${ext}`)) {
            filename = `${filename}.${ext}`;
        }
        const downloadName = `${Date.now()}_${filename || 'file'}`;
        // eslint-disable-next-line promise/catch-or-return
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
            const blobUrl = URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(blobUrl);
            link.remove();
        });
    }, [current, list]);
    const onOpenAtIndex = React.useCallback((index) => {
        setCurrent(index);
        setPreviewOpen(true);
    }, []);
    const onSwitchIndex = React.useCallback((index) => {
        if (index < 0 || index >= list.length) {
            return;
        }
        setCurrent(index);
    }, [list.length]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Space, { wrap: true }, list.map((file, index) => (React.createElement(FilePreview, { file: file, size: size, key: index, showFileName: showFileName, onClick: () => onOpenAtIndex(index) })))),
        list[current] ? (React.createElement(FilePreviewRenderer, { open: previewOpen, file: list[current], index: current, list: list, onOpenChange: setPreviewOpen, onClose: () => setPreviewOpen(false), onSwitchIndex: onSwitchIndex, onDownload: onDownload })) : null));
};
export class DisplayPreviewFieldModel extends FieldModel {
    disableTitleField = true;
    render() {
        const { value, titleField, template, target } = this.props;
        if (titleField && template !== 'file' && target !== 'attachments') {
            return castArray(value).flatMap((v, idx) => {
                const result = v?.[titleField];
                const content = result ? (React.createElement(Preview, { key: idx, ...this.props, value: castArray(result).filter(Boolean) })) : (React.createElement("span", { key: idx }, "N/A"));
                return idx === 0 ? [content] : [React.createElement("span", { key: `sep-${idx}` }, ", "), content];
            });
        }
        else {
            return React.createElement(Preview, { ...this.props, value: castArray(value).filter(Boolean) });
        }
    }
}
DisplayPreviewFieldModel.registerFlow({
    key: 'previewReadPrettySetting',
    sort: 500,
    title: tExpr('Preview Settings'),
    steps: {
        size: {
            title: tExpr('Size'),
            uiMode: (ctx) => {
                const t = ctx.t;
                return {
                    type: 'select',
                    key: 'size',
                    props: {
                        options: [
                            {
                                value: 300,
                                label: t('Large'),
                            },
                            {
                                value: 100,
                                label: t('Middle'),
                            },
                            {
                                value: 28,
                                label: t('Small'),
                            },
                        ],
                    },
                };
            },
            hideInSettings(ctx) {
                return ctx.model.parent instanceof TableColumnModel;
            },
            defaultParams: (ctx) => {
                return {
                    size: ctx.model.parent instanceof DetailsItemModel ? 100 : 28,
                };
            },
            handler(ctx, params) {
                ctx.model.setProps('size', params.size);
            },
        },
        showFileName: {
            title: tExpr('Show file name'),
            uiMode: { type: 'switch', key: 'showFileName' },
            hideInSettings(ctx) {
                return ctx.model.parent instanceof TableColumnModel;
            },
            defaultParams: {
                showFileName: false,
            },
            handler(ctx, params) {
                ctx.model.setProps('showFileName', params.showFileName);
            },
        },
    },
});
DisplayPreviewFieldModel.define({
    label: tExpr('Preview'),
});
DisplayItemModel.bindModelToInterface('DisplayPreviewFieldModel', ['url', 'attachment', 'attachmentURL', 'm2m', 'm2o', 'o2o', 'o2m', 'oho', 'obo', 'mbm'], {
    isDefault: true,
    when: (ctx, field) => {
        if (field.targetCollection) {
            return field.targetCollection.template === 'file';
        }
        return true;
    },
});
//# sourceMappingURL=DisplayPreviewFieldModel.js.map