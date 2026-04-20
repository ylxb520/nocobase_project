/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx } from '@emotion/css';
import { observer, useFieldSchema } from '@formily/react';
import { DndContext, NocoBaseRecursionField, useProps, useSchemaInitializerRender, useSchemaToolbar, withDynamicSchemaProps, } from '@nocobase/client';
import React, { useContext } from 'react';
const ActionBarContext = React.createContext({
    container: undefined,
});
export const ActionBarProvider = ({ children, ...props }) => {
    return React.createElement(ActionBarContext.Provider, { value: props }, children);
};
export const useActionBarContext = () => {
    return useContext(ActionBarContext);
};
export const MobileNavigationActionBar = withDynamicSchemaProps(observer((props) => {
    const { forceProps = {} } = useActionBarContext();
    const { style, spaceProps, ...others } = { ...useProps(props), ...forceProps };
    const { position } = useSchemaToolbar();
    const fieldSchema = useFieldSchema();
    const { render } = useSchemaInitializerRender(fieldSchema['x-initializer'], {
        ...fieldSchema['x-initializer-props'],
        wrap(actionSchema) {
            return {
                'x-position': position,
                ...actionSchema,
            };
        },
    });
    return (React.createElement(DndContext, null, position !== 'bottom' ? (React.createElement("div", { style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            ...style,
            marginTop: 0,
            justifyContent: position === 'left' ? 'flex-start' : 'flex-end',
        }, ...others, "data-testid": `mobile-navigation-action-bar-${position}`, className: cx(others.className, 'nb-action-bar') },
        position === 'left' && render({}),
        props.children && (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 12 } },
            React.createElement(NocoBaseRecursionField, { onlyRenderProperties: true, schema: fieldSchema, filterProperties: (schema) => schema['x-position'] === position }))),
        position === 'right' && render({}))) : (React.createElement(NocoBaseRecursionField, { onlyRenderProperties: true, schema: fieldSchema, filterProperties: (schema) => schema['x-position'] === position }))));
}), { displayName: 'MobileNavigationActionBar' });
//# sourceMappingURL=MobileNavigationActionBar.js.map