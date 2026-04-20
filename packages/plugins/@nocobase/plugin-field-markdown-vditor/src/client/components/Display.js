/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField } from '@formily/react';
import { withDynamicSchemaProps } from '@nocobase/client';
import { Popover } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Vditor from 'vditor';
import { useCDN } from './const';
import useStyle from './style';
function convertToText(markdownText) {
    const content = markdownText;
    let temp = document.createElement('div');
    temp.innerHTML = content;
    const text = temp.innerText;
    temp = null;
    return text?.replace(/[\n\r]/g, '') || '';
}
const getContentWidth = (element) => {
    if (element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const contentWidth = range.getBoundingClientRect().width;
        return contentWidth;
    }
};
function DisplayInner(props) {
    const containerRef = useRef(null);
    const { wrapSSR, componentCls, hashId } = useStyle();
    const cdn = useCDN();
    useEffect(() => {
        Vditor.preview(containerRef.current, props.value ?? '', {
            mode: 'light',
            cdn,
        });
        setTimeout(() => {
            containerRef.current?.querySelectorAll('img').forEach((img) => {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', () => {
                    openCustomPreview(img.src);
                });
            });
        }, 0);
    }, [props.value]);
    return wrapSSR(React.createElement("span", { className: `${hashId} ${componentCls}` },
        React.createElement("span", { ref: containerRef, style: { border: 'none', ...(props?.style ?? {}) } })));
}
function openCustomPreview(src) {
    if (document.getElementById('custom-image-preview'))
        return;
    // 创建容器
    const overlay = document.createElement('span');
    overlay.id = 'custom-image-preview';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999',
        cursor: 'zoom-out',
    });
    const img = document.createElement('img');
    img.src = src;
    Object.assign(img.style, {
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        transition: 'transform 0.2s',
        cursor: 'zoom-out',
    });
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    overlay.appendChild(img);
    document.body.appendChild(overlay);
}
export const Display = withDynamicSchemaProps((props) => {
    const field = useField();
    const value = props.value ?? field?.value;
    const cdn = useCDN();
    const containerRef = useRef();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [ellipsis, setEllipsis] = useState(false);
    const [text, setText] = useState('');
    const elRef = useRef();
    useEffect(() => {
        if (!props.value || (field && !field?.value))
            return;
        if (props.ellipsis) {
            Vditor.md2html(props.value, {
                mode: 'light',
                cdn,
            })
                .then((html) => {
                setText(convertToText(html));
            })
                .catch(() => setText(''));
        }
        else {
            Vditor.preview(containerRef.current, props.value ?? field?.value, {
                mode: 'light',
                cdn,
            });
        }
    }, [props.value, props.ellipsis, field?.value]);
    const isOverflowTooltip = useCallback(() => {
        if (!elRef.current)
            return false;
        const contentWidth = getContentWidth(elRef.current);
        const offsetWidth = elRef.current?.offsetWidth;
        return contentWidth > offsetWidth;
    }, [elRef]);
    if (props.ellipsis) {
        return (React.createElement(Popover, { open: popoverVisible, onOpenChange: (visible) => {
                setPopoverVisible(ellipsis && visible);
            }, content: React.createElement(DisplayInner, { value: value, style: { maxWidth: 500, maxHeight: 400, overflowY: 'auto' } }) },
            React.createElement("div", { ref: elRef, style: {
                    overflow: 'hidden',
                    overflowWrap: 'break-word',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-all',
                }, onMouseEnter: (e) => {
                    const el = e.target;
                    const isShowTooltips = isOverflowTooltip();
                    if (isShowTooltips) {
                        setEllipsis(el.scrollWidth >= el.clientWidth);
                    }
                } }, text)));
    }
    return React.createElement(DisplayInner, { value: value });
});
//# sourceMappingURL=Display.js.map