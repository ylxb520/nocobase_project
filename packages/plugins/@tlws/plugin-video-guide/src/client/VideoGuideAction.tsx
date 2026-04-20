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
import type { VideoGuideActionProps } from './models/VideoGuideActionModel';

// 根据视频 URL 获取 MIME 类型
function getVideoMimeType(url: string): string {
  if (!url) return 'video/mp4';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.webm')) return 'video/webm';
  if (lowerUrl.includes('.ogg')) return 'video/ogg';
  if (lowerUrl.includes('.mov')) return 'video/quicktime';
  if (lowerUrl.includes('.avi')) return 'video/x-msvideo';
  if (lowerUrl.includes('.mkv')) return 'video/x-matroska';
  if (lowerUrl.includes('.m3u8')) return 'application/x-mpegURL';
  if (lowerUrl.includes('.mpd')) return 'application/dash+xml';
  // 默认返回 mp4
  return 'video/mp4';
}

export function VideoGuideActionButton(props: VideoGuideActionProps) {
  const [open, setOpen] = useState(false);
  const { title, modalTitle, videoUrl, posterUrl, subtitleUrl, subtitleLabel, icon, ...buttonProps } = props;

  const buttonIcon = typeof icon === 'string' ? <Icon type={icon as any} /> : icon ?? <InfoCircleOutlined />;

  const normalizedVideoUrl = typeof videoUrl === 'string' ? videoUrl.trim() : '';
  const normalizedPosterUrl = typeof posterUrl === 'string' ? posterUrl.trim() : '';
  const normalizedSubtitleUrl = typeof subtitleUrl === 'string' ? subtitleUrl.trim() : '';

  const trackNode = useMemo(() => {
    if (!normalizedSubtitleUrl) {
      return null;
    }

    return <track kind="subtitles" src={normalizedSubtitleUrl} srcLang="zh-CN" label={subtitleLabel || '中文字幕'} />;
  }, [normalizedSubtitleUrl, subtitleLabel]);

  const handleOpen = () => {
    if (!normalizedVideoUrl) {
      message.warning('请先配置视频地址');
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <Button {...buttonProps} icon={buttonIcon} onClick={handleOpen}>
        {title}
      </Button>
      <Modal
        title={modalTitle || title}
        open={open}
        footer={null}
        width={860}
        destroyOnClose
        onCancel={() => setOpen(false)}
      >
        <video
          key={normalizedVideoUrl}
          controls
          preload="metadata"
          style={{ width: '100%', borderRadius: 8, background: '#000' }}
          poster={normalizedPosterUrl || undefined}
        >
          <source src={normalizedVideoUrl} type={getVideoMimeType(normalizedVideoUrl)} />
          {trackNode}
          您的浏览器不支持视频播放，请使用现代浏览器（Chrome、Firefox、Edge 等）访问。
        </video>
      </Modal>
    </>
  );
}
