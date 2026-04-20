/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useCallback } from 'react';
import { Button, Modal, Tag, Tooltip, message } from 'antd';
import { ExclamationCircleFilled, StopOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { css, useCompile, useRecord, useResourceActionContext, useResourceContext } from '@nocobase/client';
import { ExecutionStatusOptionsMap } from '../constants';
import { lang } from '../locale';
export function LabelTag(props) {
    const compile = useCompile();
    const label = compile(props.label);
    const { color } = ExecutionStatusOptionsMap[props.value] ?? {};
    return (React.createElement(Tag, { color: color, closable: props.closable, onClose: props.onClose }, label));
}
export function ExecutionStatusOption(option) {
    const compile = useCompile();
    return (React.createElement(React.Fragment, null,
        React.createElement(LabelTag, { ...option.data }),
        option.data.description ? React.createElement("span", null, compile(option.data.description)) : null));
}
export function ExecutionStatusColumn(props) {
    const { t } = useTranslation();
    const { refresh } = useResourceActionContext();
    const { resource } = useResourceContext();
    const record = useRecord();
    const onCancel = useCallback(() => {
        Modal.confirm({
            title: lang('Cancel the execution'),
            icon: React.createElement(ExclamationCircleFilled, null),
            content: lang('Are you sure you want to cancel the execution?'),
            onOk: () => {
                resource
                    .cancel({
                    filterByTk: record.id,
                })
                    .then(() => {
                    message.success(t('Operation succeeded'));
                    refresh();
                })
                    .catch((response) => {
                    console.error(response.data.error);
                });
            },
        });
    }, [record]);
    return (React.createElement("div", { className: css `
        display: flex;
      ` },
        props.children,
        record.status ? null : (React.createElement(Tooltip, { title: lang('Cancel the execution') },
            React.createElement(Button, { type: "link", danger: true, onClick: onCancel, shape: "circle", size: "small", icon: React.createElement(StopOutlined, null) })))));
}
//# sourceMappingURL=ExecutionStatus.js.map