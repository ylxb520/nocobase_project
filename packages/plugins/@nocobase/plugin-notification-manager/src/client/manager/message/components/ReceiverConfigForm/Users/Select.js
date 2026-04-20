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
import React from 'react';
import { RemoteSelect, SchemaComponent, Variable, useCollectionFilterOptions, useToken } from '@nocobase/client';
import { FilterDynamicComponent, useWorkflowVariableOptions } from '@nocobase/plugin-workflow/client';
import { useField } from '@formily/react';
function isUserKeyField(field) {
    if (field.isForeignKey) {
        return field.target === 'users';
    }
    return field.collectionName === 'users' && field.name === 'id';
}
export function UsersSelect(props) {
    const valueType = typeof props.value;
    return valueType === 'object' && props.value ? React.createElement(UsersQuery, { ...props }) : React.createElement(InternalUsersSelect, { ...props });
}
function InternalUsersSelect({ value, onChange }) {
    const scope = useWorkflowVariableOptions({ types: [isUserKeyField] });
    return (React.createElement(Variable.Input, { scope: scope, value: value, onChange: onChange },
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
//# sourceMappingURL=Select.js.map