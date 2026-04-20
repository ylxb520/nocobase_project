/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SyncOutlined } from '@ant-design/icons';
import { createForm } from '@formily/core';
import { Field, useField, useForm, Schema } from '@formily/react';
import { FormProvider, Input, Radio, SchemaComponent, Select, StablePopover, locale, useAPIClient, useActionContext, useRecord, useRequest, useResourceActionContext, useResourceContext, } from '@nocobase/client';
import { useMemoizedFn } from 'ahooks';
import { Input as AntdInput, Button, Card, Checkbox, Col, Divider, Row, Tag, Typography, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalTranslation } from './locale';
import { localizationSchema } from './schemas/localization';
const { Text } = Typography;
const useUpdateTranslationAction = () => {
    const field = useField();
    const form = useForm();
    const ctx = useActionContext();
    const { refresh } = useResourceActionContext();
    const { targetKey } = useResourceContext();
    const { [targetKey]: textId } = useRecord();
    const api = useAPIClient();
    const locale = api.auth.getLocale();
    return {
        async run() {
            await form.submit();
            field.data = field.data || {};
            field.data.loading = true;
            try {
                await api.resource('localizationTranslations').updateOrCreate({
                    filterKeys: ['textId', 'locale'],
                    values: {
                        textId,
                        locale,
                        translation: form.values.translation,
                    },
                });
                ctx.setVisible(false);
                await form.reset();
                refresh();
            }
            catch (e) {
                console.log(e);
            }
            finally {
                field.data.loading = false;
            }
        },
    };
};
const useDestroyTranslationAction = () => {
    const { refresh } = useResourceActionContext();
    const api = useAPIClient();
    const { translationId } = useRecord();
    return {
        async run() {
            if (!translationId) {
                return;
            }
            await api.resource('localizationTranslations').destroy({ filterByTk: translationId });
            refresh();
        },
    };
};
const useBulkDestroyTranslationAction = () => {
    const { state, setState, refresh, data } = useResourceActionContext();
    const api = useAPIClient();
    const { t } = useLocalTranslation();
    return {
        async run() {
            const selectedRowKeys = state?.selectedRowKeys || [];
            if (!selectedRowKeys.length) {
                return message.error(t('Please select the records you want to delete'));
            }
            const rows = (data?.data?.rows || data?.data || data?.rows || []);
            const selectedKeySet = new Set(selectedRowKeys.map((key) => String(key)));
            const translationIds = rows
                .filter((row) => selectedKeySet.has(String(row.id)))
                .map((row) => row.translationId)
                .filter(Boolean);
            if (!translationIds.length) {
                return message.error(t('Please select the records you want to delete'));
            }
            await api.resource('localizationTranslations').destroy({ filterByTk: translationIds });
            setState?.({ selectedRowKeys: [] });
            refresh();
        },
    };
};
const usePublishAction = () => {
    const api = useAPIClient();
    return {
        async run() {
            await api.resource('localization').publish();
            window.location.reload();
        },
    };
};
const Sync = () => {
    const { t } = useLocalTranslation();
    const { refresh } = useResourceActionContext();
    const api = useAPIClient();
    const [syncing, setSyncing] = useState(false);
    const [plainOptions, setPlainOptions] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(true);
    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    const { data, loading } = useRequest(() => api
        .resource('localization')
        .getSources()
        .then((res) => res?.data?.data), {
        onSuccess: (data) => {
            const plainOptions = data.map((item) => item.name);
            setPlainOptions(plainOptions);
            setCheckedList(plainOptions);
        },
    });
    if (loading) {
        return null;
    }
    return (React.createElement(StablePopover, { placement: "bottomRight", content: React.createElement(React.Fragment, null,
            React.createElement(Checkbox, { indeterminate: indeterminate, onChange: onCheckAllChange, checked: checkAll }, t('All')),
            React.createElement(Divider, { style: { margin: '5px 0' } }),
            React.createElement(Checkbox.Group, { onChange: onChange, value: checkedList },
                React.createElement(Col, null, (data || []).map((item) => (React.createElement(Row, { key: item.name },
                    React.createElement(Checkbox, { value: item.name }, Schema.compile(item.title, { t })))))))) },
        React.createElement(Button, { icon: React.createElement(SyncOutlined, null), loading: syncing, onClick: async () => {
                if (!checkedList.length) {
                    return message.error(t('Please select the resources you want to synchronize'));
                }
                setSyncing(true);
                await api.resource('localization').sync({
                    values: {
                        types: checkedList,
                    },
                });
                setSyncing(false);
                refresh();
            } }, t('Sync'))));
};
const useModules = () => {
    const { t: lang } = useLocalTranslation();
    const t = useMemoizedFn(lang);
    const { data } = useResourceActionContext();
    const modules = useMemo(() => data?.meta?.modules?.map((module) => ({
        value: module.value,
        label: Schema.compile(module.label, { t }),
    })) || [], [data?.meta?.modules, t]);
    return modules;
};
const Filter = () => {
    const { t } = useLocalTranslation();
    const { run } = useResourceActionContext();
    const modules = useModules();
    const form = useMemo(() => createForm({
        initialValues: {
            hasTranslation: true,
        },
    }), []);
    const filter = (values) => {
        run({
            ...(values || form.values),
        });
    };
    useEffect(() => {
        const module = form.query('module').take();
        module.dataSource = modules;
    }, [form, modules]);
    return (React.createElement(FormProvider, { form: form },
        React.createElement("div", { style: { display: 'flex' } },
            React.createElement(Field, { name: "module", dataSource: modules, component: [
                    Select,
                    {
                        allowClear: true,
                        placeholder: t('Module'),
                        onChange: (module) => filter({ ...form.values, module }),
                    },
                ] }),
            React.createElement(Field, { name: "keyword", component: [
                    AntdInput.Search,
                    {
                        placeholder: t('Keyword'),
                        allowClear: true,
                        style: {
                            marginLeft: '8px',
                            width: 'fit-content',
                        },
                        onSearch: (keyword) => filter({ ...form.values, keyword }),
                    },
                ] }),
            React.createElement(Field, { name: "hasTranslation", dataSource: [
                    { label: t('All'), value: true },
                    { label: t('No translation'), value: false },
                ], component: [
                    Radio.Group,
                    {
                        defaultValue: true,
                        style: {
                            marginLeft: '8px',
                            width: 'fit-content',
                        },
                        optionType: 'button',
                        onChange: () => filter(),
                    },
                ] }))));
};
const ModuleTitle = () => {
    const { t } = useLocalTranslation();
    const { moduleTitle, module } = useRecord();
    if (!moduleTitle) {
        return React.createElement(Tag, null, module);
    }
    return React.createElement(Tag, null, Schema.compile(moduleTitle, { t }));
};
export const Localization = () => {
    const { t } = useLocalTranslation();
    const api = useAPIClient();
    const curLocale = api.auth.getLocale();
    const localeLabel = locale[curLocale]?.label || curLocale;
    const CurrentLang = () => (React.createElement(Typography, null,
        React.createElement(Text, { strong: true }, t('Current language')),
        React.createElement(Tag, { style: { marginLeft: '10px' } }, localeLabel)));
    const TranslationField = (props) => (props.value !== undefined ? React.createElement(Input.TextArea, { ...props }) : React.createElement("div", null));
    return (React.createElement(Card, { bordered: false },
        React.createElement(SchemaComponent, { schema: localizationSchema, components: { TranslationField, CurrentLang, Sync, Filter, ModuleTitle }, scope: {
                t,
                useDestroyTranslationAction,
                useBulkDestroyTranslationAction,
                useUpdateTranslationAction,
                usePublishAction,
                useModules,
            } })));
};
//# sourceMappingURL=Localization.js.map