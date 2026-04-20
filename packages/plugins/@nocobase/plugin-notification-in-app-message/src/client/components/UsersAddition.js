/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField } from '@formily/react';
import { Button, Popover, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { useWorkflowExecuted } from '@nocobase/plugin-workflow/client';
import { useLocalTranslation } from '../../locale';
export function UsersAddition() {
    const executed = useWorkflowExecuted();
    /*
        waiting for improvement
        const array = ArrayItems.useArray();
    */
    const [open, setOpen] = useState(false);
    const { t } = useLocalTranslation();
    const field = useField();
    /*
        waiting for improvement
        const array = ArrayItems.useArray();
    */
    const { receivers } = field.form.values;
    const onAddSelect = useCallback(() => {
        receivers.push('');
        setOpen(false);
    }, [receivers]);
    const onAddQuery = useCallback(() => {
        receivers.push({ filter: {} });
        setOpen(false);
    }, [receivers]);
    const button = (React.createElement(Button, { icon: React.createElement(PlusOutlined, null), type: "dashed", block: true, disabled: executed > 0, className: "ant-formily-array-base-addition" }, t('Add user')));
    return executed ? (button) : (React.createElement(Popover, { open: open, onOpenChange: setOpen, content: React.createElement(Space, { direction: "vertical", size: "small" },
            React.createElement(Button, { type: "text", onClick: onAddSelect }, t('Select users')),
            React.createElement(Button, { type: "text", onClick: onAddQuery }, t('Query users'))) }, button));
}
//# sourceMappingURL=UsersAddition.js.map