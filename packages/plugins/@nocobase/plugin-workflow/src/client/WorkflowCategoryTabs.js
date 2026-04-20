/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { DndContext, DragOverlay, MouseSensor, useDraggable, useDroppable, useSensor, useSensors, } from '@dnd-kit/core';
import { RecursionField, observer, useFieldSchema, useForm } from '@formily/react';
import { uid } from '@formily/shared';
import { App, Badge, Card, Dropdown, Space, Tabs } from 'antd';
import { cloneDeep } from 'lodash';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPIClient, SchemaComponent, useCompile, useResourceActionContext, ActionContextProvider, useCancelAction, useActionContext, useRequest, css, } from '@nocobase/client';
import { createForm } from '@formily/core';
import { lang, NAMESPACE } from './locale';
function Draggable(props) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: props.id,
        data: props.data,
    });
    return (React.createElement("div", { ref: setNodeRef, ...listeners, ...attributes },
        React.createElement("div", null, props.children)));
}
function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
        data: props.data,
    });
    const style = isOver
        ? {
            color: 'green',
        }
        : undefined;
    return (React.createElement("div", { ref: setNodeRef, style: style }, props.children));
}
const TabTitle = observer(({ item }) => {
    return (React.createElement(Droppable, { id: item.id.toString(), data: item },
        React.createElement("div", null,
            React.createElement(Draggable, { id: item.id.toString(), data: item },
                React.createElement(TabBar, { item: item })))));
}, { displayName: 'TabTitle' });
const TabBar = ({ item }) => {
    const { t } = useTranslation();
    const compile = useCompile();
    return (React.createElement(Space, null,
        React.createElement(Badge, { color: item.color }),
        t(compile(item.title))));
};
const DndProvider = observer((props) => {
    const [activeTab, setActiveId] = useState(null);
    const { refresh } = useContext(CategoryTabsRequestContext);
    const api = useAPIClient();
    const onDragEnd = async (props) => {
        const { active, over } = props;
        setTimeout(() => {
            setActiveId(null);
        });
        if (over && over.id !== active.id) {
            await api.resource('workflowCategories').move({
                sourceId: active.id,
                targetId: over.id,
            });
            // await refresh();
            refresh();
        }
    };
    function onDragStart(event) {
        setActiveId(event.active?.data.current);
    }
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const sensors = useSensors(mouseSensor);
    return (React.createElement(DndContext, { sensors: sensors, onDragEnd: onDragEnd, onDragStart: onDragStart },
        props.children,
        React.createElement(DragOverlay, null, activeTab ? React.createElement("span", { style: { whiteSpace: 'nowrap' } }, React.createElement(TabBar, { item: activeTab })) : null)));
}, { displayName: 'DndProvider' });
const CategoryTabsRequestContext = createContext({});
function CategoryMenu({ values, onEdit, onRemove }) {
    const compile = useCompile();
    const onClick = useCallback(({ key }) => {
        switch (key) {
            case 'edit':
                onEdit(values);
                break;
            case 'delete':
                onRemove(values.id);
                break;
            default:
                break;
        }
    }, [onEdit, onRemove, values]);
    return (React.createElement(Dropdown, { menu: {
            items: [
                {
                    key: 'edit',
                    label: lang('Edit category'),
                },
                {
                    key: 'delete',
                    label: lang('Delete category'),
                },
            ],
            onClick,
        } },
        React.createElement(MenuOutlined, { role: "button", "aria-label": compile(values.title), style: { padding: 8, margin: '-8px' } })));
}
export function CategoryTabs() {
    const { run, setState, defaultRequest } = useResourceActionContext();
    const [activeKey, setActiveKey] = useState({ tab: 'all' });
    const [key, setKey] = useState(activeKey.tab);
    const compile = useCompile();
    const api = useAPIClient();
    const tableSchema = useFieldSchema();
    const { modal } = App.useApp();
    const { data, refresh } = useRequest({
        resource: 'workflowCategories',
        action: 'list',
        params: {
            paginate: false,
            sort: ['sort'],
        },
    });
    const [editing, setEditing] = useState(false);
    const form = useMemo(() => createForm(), []);
    const onEdit = useCallback((item) => {
        setEditing(true);
        const values = cloneDeep(item);
        form.setValues(values);
    }, [form]);
    const onEditCancel = useCallback(() => {
        setEditing(false);
        form.reset();
    }, [form]);
    const onRemove = useCallback((key) => {
        modal.confirm({
            title: compile("{{t('Delete category')}}"),
            content: compile("{{t('Are you sure you want to delete it?')}}"),
            onOk: async () => {
                await api.resource('workflowCategories').destroy({
                    filter: {
                        id: key,
                    },
                });
                key === +activeKey.tab && setActiveKey({ tab: 'all' });
                refresh();
                run();
            },
        });
    }, [activeKey.tab]);
    const tabsItems = useMemo(() => {
        if (!data?.data)
            return [];
        const res = data.data
            .sort((a, b) => a.sort - b.sort)
            .concat()
            .map((v) => {
            return {
                ...v,
                schema: tableSchema.properties.main,
            };
        });
        !res.find((v) => v.id === 'all') &&
            res.unshift({
                title: `{{t("All", { ns: "${NAMESPACE}" })}}`,
                id: 'all',
                sort: 0,
                closable: false,
                schema: tableSchema.properties.main,
            });
        return res.map((item) => {
            return {
                label: item.id !== 'all' ? (React.createElement("div", { "data-no-dnd": "true" },
                    React.createElement(TabTitle, { item: item }))) : (compile(item.title)),
                key: String(item.id),
                closable: item.closable,
                closeIcon: React.createElement(CategoryMenu, { values: item, onEdit: onEdit, onRemove: onRemove }),
                children: (React.createElement(Card, { variant: "borderless", style: { borderRadius: '0 0.5em 0.5em 0.5em' } },
                    React.createElement(RecursionField, { name: key, schema: item.schema, onlyRenderProperties: true }))),
            };
        });
    }, [compile, data?.data, key, onEdit, onRemove, tableSchema.properties.main]);
    const onChange = useCallback((key) => {
        setActiveKey({ tab: key });
        setKey(uid());
        if (key !== 'all') {
            const prevFilter = defaultRequest?.params?.filter;
            const filter = { $and: [prevFilter, { 'categories.id': key }] };
            run({ filter });
            setState?.({ categories: [+key], params: [{ filter }] });
        }
        else {
            run();
            setState?.({ categories: [], params: [] });
        }
    }, [defaultRequest?.params?.filter, run, setState]);
    useEffect(() => {
        if (activeKey.tab !== 'all') {
            onChange(activeKey.tab);
        }
    }, [activeKey.tab, onChange]);
    if (!data)
        return null;
    return (React.createElement(CategoryTabsRequestContext.Provider, { value: { refresh } },
        React.createElement(DndProvider, null,
            React.createElement(Tabs, { addIcon: React.createElement(SchemaComponent, { components: {
                        AddCategory,
                    }, schema: {
                        type: 'void',
                        properties: {
                            addCategories: {
                                type: 'void',
                                title: `{{ t("Add category", { ns: "${NAMESPACE}" }) }}`,
                                'x-component': 'AddCategory',
                                'x-component-props': {
                                    type: 'primary',
                                },
                            },
                        },
                    } }), onChange: onChange, defaultActiveKey: activeKey.tab || 'all', type: "editable-card", destroyInactiveTabPane: true, tabBarStyle: { marginBottom: '0px' }, className: css `
            .ant-tabs-nav-list > :first-child {
              border: none;
            }
          `, items: tabsItems })),
        React.createElement(ActionContextProvider, { value: { visible: editing, setVisible: onEditCancel, openSize: 'small' } },
            React.createElement(SchemaComponent, { scope: {
                    useFormProviderProps,
                    useCancelAction,
                    useEditSubmit,
                }, schema: {
                    name: uid(),
                    type: 'void',
                    'x-decorator': 'FormV2',
                    'x-decorator-props': {
                        form,
                    },
                    // 'x-use-decorator-props': 'useFormProviderProps',
                    title: `{{ t("Edit category", { ns: "${NAMESPACE}" }) }}`,
                    'x-component': 'Action.Modal',
                    'x-component-props': {
                        delay: 0,
                        // getContainer: '{{ getContainer }}',
                    },
                    properties: {
                        title: {
                            type: 'string',
                            title: '{{t("Title")}}',
                            required: true,
                            // 'x-disabled': '{{ !createOnly }}',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                        },
                        color: {
                            type: 'string',
                            title: '{{t("Color")}}',
                            required: false,
                            'x-decorator': 'FormItem',
                            'x-component': 'ColorSelect',
                        },
                        footer: {
                            type: 'void',
                            'x-component': 'Action.Modal.Footer',
                            properties: {
                                cancel: {
                                    title: '{{ t("Cancel") }}',
                                    'x-component': 'Action',
                                    'x-component-props': {
                                        useAction: '{{ useCancelAction }}',
                                    },
                                },
                                submit: {
                                    title: '{{ t("Submit") }}',
                                    'x-component': 'Action',
                                    'x-component-props': {
                                        type: 'primary',
                                        useAction: '{{ useEditSubmit }}',
                                        style: {
                                            marginLeft: '8px',
                                        },
                                    },
                                },
                            },
                        },
                    },
                } }))));
}
function useEditSubmit() {
    const form = useForm();
    const ctx = useActionContext();
    const service = useResourceActionContext();
    const { refresh } = useContext(CategoryTabsRequestContext);
    const api = useAPIClient();
    return {
        async run() {
            await form.submit();
            await api.resource('workflowCategories').update({
                filterByTk: form.values?.id,
                values: form.values,
            });
            ctx.setVisible(false);
            await form.reset();
            refresh?.();
            service?.refresh();
        },
    };
}
function useFormProviderProps() {
    return { form: useForm() };
}
function useCreateSubmit() {
    const form = useForm();
    const { setVisible } = useActionContext();
    // const service = useResourceActionContext();
    const { refresh } = useContext(CategoryTabsRequestContext);
    const api = useAPIClient();
    return {
        async run() {
            await form.submit();
            const values = cloneDeep(form.values);
            await api.resource('workflowCategories').create({
                values,
            });
            setVisible(false);
            form.reset();
            refresh();
        },
    };
}
function AddCategory(props) {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const form = useMemo(() => createForm(), []);
    return (React.createElement(ActionContextProvider, { value: { visible, setVisible, openSize: 'small' } },
        React.createElement("div", { onClick: () => setVisible(true), title: t('Add category') },
            React.createElement(PlusOutlined, null)),
        React.createElement(SchemaComponent, { schema: {
                name: 'modal',
                type: 'void',
                'x-decorator': 'FormV2',
                'x-decorator-props': {
                    form,
                },
                title: '{{ t("Add category") }}',
                'x-component': 'Action.Modal',
                'x-component-props': {
                    ...props,
                    delay: 0,
                    // getContainer: '{{ getContainer }}',
                },
                properties: {
                    title: {
                        type: 'string',
                        title: '{{t("Title")}}',
                        required: true,
                        // 'x-disabled': '{{ !createOnly }}',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                    },
                    color: {
                        type: 'string',
                        title: '{{t("Color")}}',
                        required: false,
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorSelect',
                    },
                    footer: {
                        type: 'void',
                        'x-component': 'Action.Modal.Footer',
                        properties: {
                            cancel: {
                                title: '{{ t("Cancel") }}',
                                'x-component': 'Action',
                                'x-component-props': {
                                    useAction: '{{ useCancelAction }}',
                                },
                            },
                            submit: {
                                title: '{{ t("Submit") }}',
                                'x-component': 'Action',
                                'x-component-props': {
                                    type: 'primary',
                                    useAction: '{{ useCreateSubmit }}',
                                    style: {
                                        marginLeft: '8px',
                                    },
                                },
                            },
                        },
                    },
                },
            }, scope: {
                useCancelAction,
                // createOnly: true,
                useCreateSubmit,
            } })));
}
//# sourceMappingURL=WorkflowCategoryTabs.js.map