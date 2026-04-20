/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState } from 'react';
import { Button, Modal, message, Select, Form } from 'antd';
import { usePluginUtils } from './utils';
import { useAPIClient, useRequest, useResourceActionContext } from '@nocobase/client';
import { CloudSyncOutlined } from '@ant-design/icons';
const MigrateModal = ({ open, setOpen }) => {
    const [form] = Form.useForm();
    const { t } = usePluginUtils();
    const api = useAPIClient();
    const { state, setState } = useResourceActionContext();
    const [environmentOptions, setEnvironmentOptions] = useState([]);
    const [migrating, setMigrating] = useState(false);
    useRequest(() => api
        .request({
        url: 'appEnvironments:list',
    })
        .then((res) => res.data?.data || []), {
        onSuccess: (data) => {
            const availableEnvs = data.filter(({ available }) => available);
            if (!availableEnvs.length) {
                return;
            }
            setEnvironmentOptions(availableEnvs.map(({ name }) => ({ value: name, label: name })));
        },
    });
    return (React.createElement(Modal, { title: t('Migrate to app supervisor'), closable: true, open: open, footer: [
            React.createElement(Button, { key: "cancel", onClick: () => {
                    setOpen(false);
                } }, t('Cancel')),
            React.createElement(Button, { key: "submit", type: "primary", loading: migrating, onClick: async () => {
                    if (!state?.selectedRowKeys?.length) {
                        return message.error(t('Please select the records you want to migrate'));
                    }
                    setMigrating(true);
                    await form.validateFields();
                    try {
                        await api.resource('apps').migrate({
                            values: {
                                appNames: state?.selectedRowKeys,
                                environments: form.getFieldValue('environments'),
                            },
                        });
                    }
                    finally {
                        setState?.({ selectedRowKeys: [] });
                        setOpen(false);
                        setMigrating(false);
                    }
                } }, t('Submit')),
        ] },
        React.createElement(Form, { form: form, layout: "vertical", colon: true },
            React.createElement(Form.Item, { label: t('Environments'), name: "environments", rules: [{ required: true }] },
                React.createElement(Select, { options: environmentOptions, mode: "multiple" })))));
};
export const Migrate = () => {
    const { t } = usePluginUtils();
    const api = useAPIClient();
    const { state } = useResourceActionContext();
    const [open, setOpen] = useState(false);
    const { loading, data } = useRequest(() => api
        .silent()
        .resource('pm')
        .get({
        filterByTk: 'app-supervisor',
    })
        .then((res) => res?.data?.data));
    if (loading || !data?.enabled) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { icon: React.createElement(CloudSyncOutlined, null), onClick: async () => {
                if (!state?.selectedRowKeys?.length) {
                    return message.error(t('Please select the records you want to migrate'));
                }
                setOpen(true);
            } }, t('Migrate to app supervisor')),
        React.createElement(MigrateModal, { open: open, setOpen: setOpen })));
};
//# sourceMappingURL=Migrate.js.map