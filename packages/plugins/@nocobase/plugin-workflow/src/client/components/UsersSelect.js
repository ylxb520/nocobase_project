/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import React, { useCallback, useState } from 'react';
import { ArrayItems } from '@formily/antd-v5';
import { CollectionManagerProvider, RemoteSelect, SchemaComponent, Variable, useCollectionFilterOptions, useToken, } from '@nocobase/client';
import { useField } from '@formily/react';
import { Button, Popover, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { lang } from '../locale';
import { useWorkflowVariableOptions } from '../variable';
import { FilterDynamicComponent } from './FilterDynamicComponent';
import { useWorkflowExecuted } from '../hooks';
function isUserKeyField(field) {
    if (field.isForeignKey) {
        return field.target === 'users';
    }
    return field.collectionName === 'users' && field.name === 'id';
}
export function UsersSelect(props) {
    return (React.createElement(CollectionManagerProvider, { dataSource: "main" },
        React.createElement(UsersSelectContent, { ...props })));
}
function UsersSelectContent(props) {
    const valueType = typeof props.value;
    return valueType === 'object' && props.value ? React.createElement(UsersQuery, { ...props }) : React.createElement(InternalUsersSelect, { ...props });
}
function InternalUsersSelect({ value, onChange }) {
    const scope = useWorkflowVariableOptions({ types: [isUserKeyField] });
    return (React.createElement(Variable.Input, { nullable: false, scope: scope, value: value, onChange: onChange, changeOnSelect: false },
        React.createElement(RemoteSelect, { fieldNames: {
                label: 'nickname',
                value: 'id',
            }, service: {
                resource: 'users',
            }, manual: false, value: value, onChange: onChange })));
}
function UsersQuery(props) {
    const field = useField();
    const options = useCollectionFilterOptions('users');
    const { token } = useToken();
    return (React.createElement("div", { style: {
            border: `1px dashed ${token.colorBorder}`,
            padding: token.paddingSM,
        } },
        React.createElement(SchemaComponent, { basePath: field.address, schema: {
                type: 'void',
                properties: {
                    filter: {
                        type: 'object',
                        'x-component': 'Filter',
                        'x-component-props': {
                            options,
                            dynamicComponent: FilterDynamicComponent,
                        },
                    },
                },
            } })));
}
export function UsersAddition() {
    const executed = useWorkflowExecuted();
    const array = ArrayItems.useArray();
    const [open, setOpen] = useState(false);
    const onAddSelect = useCallback(() => {
        array.field.push(null);
        setOpen(false);
    }, [array.field]);
    const onAddQuery = useCallback(() => {
        array.field.push({ filter: {} });
        setOpen(false);
    }, [array.field]);
    const button = (React.createElement(Button, { icon: React.createElement(PlusOutlined, null), type: "dashed", block: true, disabled: executed > 0, className: "ant-formily-array-base-addition" }, lang('Add')));
    return executed > 0 ? (button) : (React.createElement(Popover, { open: open, onOpenChange: setOpen, placement: "bottom", content: React.createElement(Space, { direction: "vertical", size: "small" },
            React.createElement(Button, { type: "text", onClick: onAddSelect }, lang('Select users')),
            React.createElement(Button, { type: "text", onClick: onAddQuery }, lang('Query users'))) }, button));
}
//# sourceMappingURL=UsersSelect.js.map