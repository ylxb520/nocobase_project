/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useField } from '@formily/react';
import { cx, SortableItem, useCompile, useDesigner, useDocumentTitle, useToken } from '@nocobase/client';
import { NavBar } from 'antd-mobile';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateNTemplate } from '../../../../locale';
import { HeaderDesigner } from './Header.Designer';
const InternalHeader = (props) => {
    const field = useField();
    const { title = generateNTemplate('Untitled'), showBack = false } = { ...props, ...field?.componentProps };
    const Designer = useDesigner();
    const compile = useCompile();
    const compiledTitle = compile(title);
    const navigate = useNavigate();
    const { setTitle } = useDocumentTitle();
    const { token } = useToken();
    useEffect(() => {
        // sync title
        setTitle(compiledTitle);
    }, [compiledTitle, setTitle]);
    const style = useMemo(() => {
        return {
            width: '100%',
            background: token.colorBgContainer,
        };
    }, [token.colorBgContainer]);
    return (React.createElement(SortableItem, { className: cx('nb-mobile-header'), style: style },
        React.createElement(NavBar, { backArrow: showBack, onBack: () => navigate(-1) }, compiledTitle),
        React.createElement(Designer, null)));
};
export const MHeader = InternalHeader;
MHeader.Designer = HeaderDesigner;
//# sourceMappingURL=Header.js.map