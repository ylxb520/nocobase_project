/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { generatePluginTranslationTemplate } from '../../../locale';
export const getMobileTabBarItemSchemaFields = (values = {}) => ({
    title: {
        title: generatePluginTranslationTemplate('Title'),
        type: 'string',
        default: values.title,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        required: true,
    },
    icon: {
        title: generatePluginTranslationTemplate('Icon'),
        type: 'string',
        default: values.icon,
        'x-decorator': 'FormItem',
        'x-component': 'IconPicker',
        required: true,
    },
});
//# sourceMappingURL=schemaFormFields.js.map