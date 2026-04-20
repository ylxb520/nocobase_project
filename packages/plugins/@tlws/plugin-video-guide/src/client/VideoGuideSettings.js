/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SchemaSettings, useDesignable } from '@nocobase/client';
import { useField, useFieldSchema } from '@formily/react';
import { useTranslation } from 'react-i18next';
const DEFAULT_COMPONENT_PROPS = {
    title: '视频讲解',
    modalTitle: '视频讲解',
    videoUrl: '',
    posterUrl: '',
    subtitleUrl: '',
    subtitleLabel: '中文字幕',
};
export const videoGuideActionSettings = new SchemaSettings({
    name: 'blockActionSettings:videoGuide',
    items: [
        {
            name: 'videoGuideConfig',
            type: 'modal',
            useComponentProps() {
                const { t } = useTranslation('@tlws/video-guide');
                const field = useField();
                const fieldSchema = useFieldSchema();
                const { dn } = useDesignable();
                const currentProps = fieldSchema['x-component-props'] || {};
                const initialValues = {
                    ...DEFAULT_COMPONENT_PROPS,
                    ...currentProps,
                };
                return {
                    title: t('Configure video guide'),
                    width: 640,
                    schema: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string',
                                title: t('Button text'),
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                                required: true,
                            },
                            modalTitle: {
                                type: 'string',
                                title: t('Modal title'),
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                                required: true,
                            },
                            videoUrl: {
                                type: 'string',
                                title: t('Video URL'),
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
                                title: t('Poster URL'),
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                            },
                            subtitleUrl: {
                                type: 'string',
                                title: t('Subtitle URL'),
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                                description: t('Optional WebVTT subtitle file URL.'),
                            },
                            subtitleLabel: {
                                type: 'string',
                                title: t('Subtitle label'),
                                'x-decorator': 'FormItem',
                                'x-component': 'Input',
                            },
                        },
                    },
                    initialValues,
                    async onSubmit(values) {
                        const nextProps = {
                            ...DEFAULT_COMPONENT_PROPS,
                            ...values,
                        };
                        field.componentProps = {
                            ...field.componentProps,
                            ...nextProps,
                        };
                        fieldSchema['x-component-props'] = field.componentProps;
                        dn.emit('patch', {
                            schema: {
                                ['x-uid']: fieldSchema['x-uid'],
                                'x-component-props': field.componentProps,
                            },
                        });
                        dn.refresh();
                    },
                };
            },
        },
        {
            name: 'divider',
            type: 'divider',
        },
        {
            name: 'delete',
            type: 'remove',
            useComponentProps() {
                const { t } = useTranslation();
                return {
                    removeParentsIfNoChildren: true,
                    breakRemoveOn: (s) => {
                        return s['x-component'] === 'Space' || s['x-component']?.endsWith('ActionBar');
                    },
                    confirm: {
                        title: t('Delete action'),
                    },
                };
            },
        },
    ],
});
//# sourceMappingURL=VideoGuideSettings.js.map