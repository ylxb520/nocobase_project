/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { InfoCircleOutlined } from '@ant-design/icons';
import { Icon } from '@nocobase/client';
import { Button, Modal, message } from 'antd';
import React, { useMemo, useState } from 'react';
// 根据视频 URL 获取 MIME 类型
function getVideoMimeType(url) {
    if (!url)
        return 'video/mp4';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.webm'))
        return 'video/webm';
    if (lowerUrl.includes('.ogg'))
        return 'video/ogg';
    if (lowerUrl.includes('.mov'))
        return 'video/quicktime';
    if (lowerUrl.includes('.avi'))
        return 'video/x-msvideo';
    if (lowerUrl.includes('.mkv'))
        return 'video/x-matroska';
    if (lowerUrl.includes('.m3u8'))
        return 'application/x-mpegURL';
    if (lowerUrl.includes('.mpd'))
        return 'application/dash+xml';
    // 默认返回 mp4
    return 'video/mp4';
}
export function VideoGuideActionButton(props) {
    const [open, setOpen] = useState(false);
    const { title, modalTitle, videoUrl, posterUrl, subtitleUrl, subtitleLabel, icon, ...buttonProps } = props;
    const buttonIcon = typeof icon === 'string' ? React.createElement(Icon, { type: icon }) : icon ?? React.createElement(InfoCircleOutlined, null);
    const normalizedVideoUrl = typeof videoUrl === 'string' ? videoUrl.trim() : '';
    const normalizedPosterUrl = typeof posterUrl === 'string' ? posterUrl.trim() : '';
    const normalizedSubtitleUrl = typeof subtitleUrl === 'string' ? subtitleUrl.trim() : '';
    const trackNode = useMemo(() => {
        if (!normalizedSubtitleUrl) {
            return null;
        }
        return React.createElement("track", { kind: "subtitles", src: normalizedSubtitleUrl, srcLang: "zh-CN", label: subtitleLabel || '中文字幕' });
    }, [normalizedSubtitleUrl, subtitleLabel]);
    const handleOpen = () => {
        if (!normalizedVideoUrl) {
            message.warning('请先配置视频地址');
            return;
        }
        setOpen(true);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { ...buttonProps, icon: buttonIcon, onClick: handleOpen }, title),
        React.createElement(Modal, { title: modalTitle || title, open: open, footer: null, width: 860, destroyOnClose: true, onCancel: () => setOpen(false) },
            React.createElement("video", { key: normalizedVideoUrl, controls: true, preload: "metadata", style: { width: '100%', borderRadius: 8, background: '#000' }, poster: normalizedPosterUrl || undefined },
                React.createElement("source", { src: normalizedVideoUrl, type: getVideoMimeType(normalizedVideoUrl) }),
                trackNode,
                "\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u89C6\u9891\u64AD\u653E\uFF0C\u8BF7\u4F7F\u7528\u73B0\u4EE3\u6D4F\u89C8\u5668\uFF08Chrome\u3001Firefox\u3001Edge \u7B49\uFF09\u8BBF\u95EE\u3002"))));
}
//# sourceMappingURL=VideoGuideAction.js.map