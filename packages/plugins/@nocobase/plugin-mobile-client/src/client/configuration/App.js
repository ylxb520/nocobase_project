/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useApp } from '@nocobase/client';
import { Card, Form, Input } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from '../locale';
export const AppConfiguration = () => {
    const app = useApp();
    const { t } = useTranslation();
    const targetUrl = useMemo(() => {
        return app.getRouteUrl('/mobile');
    }, [app]);
    return (React.createElement(Card, { style: {
            minHeight: '600px',
        } },
        React.createElement(Form, { layout: "vertical" },
            React.createElement(Form.Item, { tooltip: `${t('The full address is')} ${window.origin}${targetUrl}`, label: t('Mobile client access address') },
                React.createElement(Input, { value: targetUrl, disabled: true })))));
};
//# sourceMappingURL=App.js.map