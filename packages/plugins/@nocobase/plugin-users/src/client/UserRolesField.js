/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { useField, Schema } from '@formily/react';
import { useUsersTranslation } from './locale';
import { Tag } from 'antd';
export const UserRolesField = () => {
    const { t } = useUsersTranslation();
    const field = useField();
    return (field.value || []).map((role) => (React.createElement(Tag, { key: role.name }, Schema.compile(role.title, { t }))));
};
//# sourceMappingURL=UserRolesField.js.map