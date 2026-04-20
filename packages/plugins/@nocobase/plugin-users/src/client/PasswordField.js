/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { Password, useActionContext } from '@nocobase/client';
import { useField } from '@formily/react';
import { useUsersTranslation } from './locale';
import { generatePassword } from './utils';
export const PasswordField = () => {
    const { t } = useUsersTranslation();
    const field = useField();
    const [visible, setVisible] = React.useState(false);
    const ctx = useActionContext();
    useEffect(() => {
        if (ctx.visible) {
            return;
        }
        field.reset();
    }, [field, ctx.visible]);
    useEffect(() => {
        if (!field.value) {
            return;
        }
        field.validate();
    }, [field.value]);
    return (React.createElement(Row, { gutter: 10 },
        React.createElement(Col, { span: 18 },
            React.createElement(Password, { checkStrength: true, visibilityToggle: {
                    visible,
                    onVisibleChange: setVisible,
                }, value: field.value, onChange: (e) => field.setValue(e.target.value), autoComplete: "new-password" })),
        React.createElement(Col, { span: 4 },
            React.createElement(Button, { onClick: () => {
                    field.setValue(generatePassword());
                    setVisible(true);
                } }, t('Random password')))));
};
//# sourceMappingURL=PasswordField.js.map