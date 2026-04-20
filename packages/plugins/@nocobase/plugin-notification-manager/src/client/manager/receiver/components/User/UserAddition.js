/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useForm } from '@formily/react';
import { ArrayItems } from '@formily/antd-v5';
import { Button, Popover, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { useNotificationTranslation } from '../../../../locale';
export default function UsersAddition() {
    const [open, setOpen] = useState(false);
    const { t } = useNotificationTranslation();
    const array = ArrayItems.useArray();
    const form = useForm();
    const disabled = form?.disabled === true;
    const onAddSelect = useCallback(() => {
        array.field.push('');
        setOpen(false);
    }, [array.field]);
    const onAddQuery = useCallback(() => {
        array.field.push({ filter: {} });
        setOpen(false);
    }, [array.field]);
    const button = (React.createElement(Button, { icon: React.createElement(PlusOutlined, null), type: "dashed", block: true, disabled: disabled, className: "ant-formily-array-base-addition" }, t('Add user')));
    return disabled ? (button) : (React.createElement(Popover, { open: open, onOpenChange: setOpen, content: React.createElement(Space, { direction: "vertical", size: "small" },
            React.createElement(Button, { type: "text", onClick: onAddSelect }, t('Select users')),
            React.createElement(Button, { type: "text", onClick: onAddQuery }, t('Query users'))) }, button));
}
//# sourceMappingURL=UserAddition.js.map