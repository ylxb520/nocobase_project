/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { FormActionGroupModel, FormActionModel } from '@nocobase/client';
import { tExpr } from '@nocobase/flow-engine';
import type { ButtonProps } from 'antd/es/button';
import React from 'react';
import { VideoGuideActionButton } from '../VideoGuideAction';
import { NAMESPACE } from '../locale';

export type VideoGuideActionProps = ButtonProps & {
  modalTitle?: string;
  videoUrl?: string;
  posterUrl?: string;
  subtitleUrl?: string;
  subtitleLabel?: string;
};

export class VideoGuideActionModel extends FormActionModel {
  defaultProps: VideoGuideActionProps = {
    title: tExpr('Video guide', { ns: NAMESPACE }),
    modalTitle: tExpr('Video guide', { ns: NAMESPACE }),
    videoUrl: '',
    posterUrl: '',
    subtitleUrl: '',
    subtitleLabel: tExpr('Chinese subtitles', { ns: NAMESPACE }),
    icon: 'PlayCircleOutlined',
  };

  render() {
    return <VideoGuideActionButton {...(this.props as VideoGuideActionProps)} />;
  }
}

VideoGuideActionModel.define({
  label: tExpr('Video guide', { ns: NAMESPACE }),
  sort: 8500,
});

VideoGuideActionModel.registerFlow({
  key: 'videoGuideSettings',
  title: tExpr('Video guide settings', { ns: NAMESPACE }),
  steps: {
    videoGuide: {
      title: tExpr('Video guide content', { ns: NAMESPACE }),
      uiSchema(ctx) {
        return {
          modalTitle: {
            type: 'string',
            title: tExpr('Modal title', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          videoUrl: {
            type: 'string',
            title: tExpr('Video URL', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              rows: 3,
              placeholder: 'https://example.com/guide.mp4',
            },
            required: true,
          },
          posterUrl: {
            type: 'string',
            title: tExpr('Poster URL', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          subtitleUrl: {
            type: 'string',
            title: tExpr('Subtitle URL', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            description: tExpr('Optional WebVTT subtitle file URL.', { ns: NAMESPACE }),
          },
          subtitleLabel: {
            type: 'string',
            title: tExpr('Subtitle label', { ns: NAMESPACE }),
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
        };
      },
      defaultParams(ctx) {
        const props = ctx.model.props as VideoGuideActionProps;
        const defaultProps = ctx.model.defaultProps as VideoGuideActionProps;
        return {
          modalTitle: props.modalTitle ?? defaultProps.modalTitle,
          videoUrl: props.videoUrl ?? defaultProps.videoUrl,
          posterUrl: props.posterUrl ?? defaultProps.posterUrl,
          subtitleUrl: props.subtitleUrl ?? defaultProps.subtitleUrl,
          subtitleLabel: props.subtitleLabel ?? defaultProps.subtitleLabel,
        };
      },
      handler(ctx, params) {
        ctx.model.setProps({
          modalTitle: params.modalTitle,
          videoUrl: params.videoUrl,
          posterUrl: params.posterUrl,
          subtitleUrl: params.subtitleUrl,
          subtitleLabel: params.subtitleLabel,
        });
      },
    },
  },
});

FormActionGroupModel.registerActionModels({
  VideoGuideActionModel,
});
