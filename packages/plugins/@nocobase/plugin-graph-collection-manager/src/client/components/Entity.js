/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DeleteOutlined, DownOutlined, EditOutlined, UpOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { SchemaOptionsContext } from '@formily/react';
import { uid } from '@formily/shared';
import { CollectionCategoriesContext, CollectionProvider_deprecated, SchemaComponent, SchemaComponentProvider, Select, StablePopover, useCollectionManager_deprecated, useCompile, useCurrentAppInfo, useRecord, } from '@nocobase/client';
import { Badge, Tag } from 'antd';
import lodash from 'lodash';
import React, { useContext, useRef, useState } from 'react';
import { useAsyncDataSource, useCancelAction, useDestroyActionAndRefreshCM, useDestroyFieldActionAndRefreshCM, useUpdateCollectionActionAndRefreshCM, useValuesFromRecord, } from '../action-hooks';
import useStyles from '../style';
import { collection, getPopupContainer, useGCMTranslation } from '../utils';
import { AddFieldAction } from './AddFieldAction';
import { CollectionNodeProvder } from './CollectionNodeProvder';
import { ConnectAssociationAction } from './ConnectAssociationAction';
import { ConnectChildAction } from './ConnectChildAction';
import { ConnectParentAction } from './ConnectParentAction';
import { DeleteCollectionAction } from './DeleteCollectionAction';
import { EditCollectionAction } from './EditCollectionAction';
import { EditFieldAction } from './EditFieldAction';
import { FieldSummary } from './FieldSummary';
import { OverrideFieldAction } from './OverrideFieldAction';
import { ViewFieldAction } from './ViewFieldAction';
const OperationButton = React.memo((props) => {
    const { property, loadCollections, collectionData, setTargetNode, node, handelOpenPorts, title, name, targetGraph } = props;
    const isInheritField = !(property.collectionName !== name);
    const options = useContext(SchemaOptionsContext);
    const isAssociationField = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'].includes(property.type);
    const isShowAssocition = isAssociationField &&
        !(property.through ? targetGraph.hasCell(property.through) : targetGraph.hasCell(property.target));
    const { data: { database }, } = useCurrentAppInfo() || {
        data: { database: {} },
    };
    const useNewId = (prefix) => {
        return `${prefix || ''}${uid()}`;
    };
    // 获取当前字段列表
    const useCurrentFields = () => {
        const record = useRecord();
        const { getCollectionFields } = useCollectionManager_deprecated();
        const fields = getCollectionFields(record.collectionName || record.name);
        return fields;
    };
    return (React.createElement("div", { className: "field-operator" },
        React.createElement(SchemaComponentProvider, { components: {
                Select: (props) => React.createElement(Select, { popupMatchSelectWidth: false, ...props, getPopupContainer: getPopupContainer }),
                FieldSummary,
                AddFieldAction,
                OverrideFieldAction,
                ViewFieldAction,
                EditFieldAction,
                ConnectAssociationAction,
                ...options.components,
            }, scope: {
                useAsyncDataSource,
                loadCollections,
                useCancelAction,
                useNewId,
                useCurrentFields,
                useValuesFromRecord,
                useUpdateCollectionActionAndRefreshCM,
                isInheritField,
                isShowAssocition,
                ...options.scope,
            } },
            React.createElement(CollectionNodeProvder, { record: collectionData.current, setTargetNode: setTargetNode, node: node, handelOpenPorts: () => handelOpenPorts(true) },
                React.createElement(SchemaComponent, { scope: useCancelAction, schema: {
                        type: 'object',
                        properties: {
                            create: {
                                type: 'void',
                                'x-action': 'create',
                                'x-component': 'AddFieldAction',
                                'x-visible': '{{isInheritField}}',
                                'x-component-props': {
                                    item: {
                                        ...property,
                                        title,
                                    },
                                    database,
                                },
                            },
                            update: {
                                type: 'void',
                                'x-action': 'update',
                                'x-component': 'EditFieldAction',
                                'x-visible': '{{isInheritField}}',
                                'x-component-props': {
                                    item: {
                                        ...property,
                                        title,
                                    },
                                    parentItem: collectionData.current,
                                },
                            },
                            delete: {
                                type: 'void',
                                'x-action': 'destroy',
                                'x-component': 'Action.Link',
                                'x-visible': '{{isInheritField}}',
                                'x-component-props': {
                                    component: DeleteOutlined,
                                    icon: 'DeleteOutlined',
                                    className: 'btn-del',
                                    confirm: {
                                        getContainer: getPopupContainer,
                                        title: "{{t('Delete record')}}",
                                        content: "{{t('Are you sure you want to delete it?')}}",
                                    },
                                    useAction: () => useDestroyFieldActionAndRefreshCM({
                                        collectionName: property.collectionName,
                                        name: property.name,
                                    }),
                                },
                            },
                            override: {
                                type: 'void',
                                'x-action': 'create',
                                'x-visible': '{{!isInheritField}}',
                                'x-component': 'OverrideFieldAction',
                                'x-component-props': {
                                    icon: 'ReconciliationOutlined',
                                    item: {
                                        ...property,
                                        title,
                                        targetCollection: name,
                                    },
                                    parentItem: collectionData.current,
                                },
                            },
                            view: {
                                type: 'void',
                                'x-action': 'view',
                                'x-visible': '{{!isInheritField}}',
                                'x-component': 'ViewFieldAction',
                                'x-component-props': {
                                    icon: 'ReconciliationOutlined',
                                    item: {
                                        ...property,
                                        title,
                                    },
                                    parentItem: collectionData.current,
                                },
                            },
                            connectAssociation: {
                                type: 'void',
                                'x-action': 'view',
                                'x-visible': '{{isShowAssocition}}',
                                'x-component': 'ConnectAssociationAction',
                                'x-component-props': {
                                    item: {
                                        ...property,
                                        title,
                                        __parent: collectionData.current,
                                    },
                                    targetGraph,
                                },
                            },
                        },
                    } })))));
});
OperationButton.displayName = 'OperationButton';
const PopoverContent = React.forwardRef((props, ref) => {
    const { property, node, ...other } = props;
    const { store: { data: { title, name, sourcePort, associated, targetPort }, }, } = node;
    const compile = useCompile();
    const { styles } = useStyles();
    const { getInterface } = useCollectionManager_deprecated();
    const [isHovered, setIsHovered] = useState(false);
    const CollectionConten = React.useCallback((data) => {
        const { type, name, primaryKey, allowNull, autoIncrement } = data;
        return (React.createElement("div", { className: styles.collectionPopoverClass },
            React.createElement("div", { className: "field-content" },
                React.createElement("div", null,
                    React.createElement("span", null, "name"),
                    ": ",
                    React.createElement("span", { className: "field-type" }, name)),
                React.createElement("div", null,
                    React.createElement("span", null, "type"),
                    ": ",
                    React.createElement("span", { className: "field-type" }, type))),
            React.createElement("p", null,
                primaryKey && React.createElement(Tag, { color: "green" }, "PRIMARY"),
                allowNull && React.createElement(Tag, { color: "geekblue" }, "ALLOWNULL"),
                autoIncrement && React.createElement(Tag, { color: "purple" }, "AUTOINCREMENT"))));
    }, []);
    const operatioBtnProps = {
        title,
        name,
        node,
        ...other,
    };
    const typeColor = (v) => {
        if (v.isForeignKey || v.primaryKey || v.interface === 'id') {
            return 'red';
        }
        else if (['obo', 'oho', 'o2o', 'o2m', 'm2o', 'm2m', 'linkTo'].includes(v.interface)) {
            return 'orange';
        }
    };
    return (React.createElement("div", null,
        React.createElement("div", { className: "body-item", key: property.id, id: property.id, style: {
                background: targetPort === property.id || sourcePort === property.id || associated?.includes(property.name)
                    ? '#e6f7ff'
                    : null,
            }, onMouseEnter: () => {
                setIsHovered(true);
            }, onMouseLeave: () => setIsHovered(false) },
            React.createElement(StablePopover, { content: CollectionConten(property), getPopupContainer: getPopupContainer, mouseLeaveDelay: 0, title: React.createElement("div", null,
                    compile(property.uiSchema?.title),
                    React.createElement("span", { style: { color: '#ffa940', float: 'right' } }, compile(getInterface(property.interface)?.title))), key: property.id, placement: "right" },
                React.createElement("div", { className: "name" },
                    React.createElement(Badge, { color: typeColor(property) }),
                    compile(property.uiSchema?.title))),
            React.createElement("div", { className: `type  field_type` }, compile(getInterface(property.interface)?.title)),
            isHovered && React.createElement(OperationButton, { property: property, ...operatioBtnProps }))));
});
PopoverContent.displayName = 'PopoverContent';
const PortsCom = React.memo(({ targetGraph, collectionData, setTargetNode, node, loadCollections }) => {
    const { store: { data: { item, ports, data }, }, } = node;
    const [collapse, setCollapse] = useState(false);
    const { t } = useGCMTranslation();
    const portsData = lodash.groupBy(ports.items, (v) => {
        if (v.isForeignKey ||
            v.primaryKey ||
            ['obo', 'oho', 'o2o', 'o2m', 'm2o', 'm2m', 'linkTo', 'id', 'mbm'].includes(v.interface)) {
            return 'initPorts';
        }
        else {
            return 'morePorts';
        }
    });
    const handelOpenPorts = (isCollapse) => {
        targetGraph.getCellById(item.name)?.toFront();
        setCollapse(isCollapse);
        const collapseNodes = targetGraph.collapseNodes || [];
        collapseNodes.push({
            [item.name]: isCollapse,
        });
        targetGraph.collapseNodes = collapseNodes;
        targetGraph.getCellById(item.name).setData({ collapse: true });
    };
    const isCollapse = collapse && data?.collapse;
    const popoverProps = {
        collectionData,
        setTargetNode,
        loadCollections,
        handelOpenPorts,
        node,
        targetGraph,
    };
    return (React.createElement("div", { className: "body" },
        portsData['initPorts']?.map((property) => {
            return property.uiSchema && React.createElement(PopoverContent, { ...popoverProps, property: property, key: property.id });
        }),
        React.createElement("div", { className: "morePorts" }, isCollapse &&
            portsData['morePorts']?.map((property) => {
                return property.uiSchema && React.createElement(PopoverContent, { ...popoverProps, property: property, key: property.id });
            })),
        React.createElement("a", { className: css `
          display: block;
          color: #958f8f;
          padding: 10px 5px;
          &:hover {
            color: rgb(99 90 88);
          }
        `, onClick: () => handelOpenPorts(!isCollapse) }, isCollapse
            ? [
                React.createElement(UpOutlined, { style: { margin: '0px 8px 0px 5px' }, key: "icon" }),
                React.createElement("span", { key: "associate" }, t('Association Fields')),
            ]
            : [
                React.createElement(DownOutlined, { style: { margin: '0px 8px 0px 5px' }, key: "icon" }),
                React.createElement("span", { key: "all" }, t('All Fields')),
            ])));
});
const Entity = (props) => {
    const { styles } = useStyles();
    const options = useContext(SchemaOptionsContext);
    const { node, setTargetNode, targetGraph } = props;
    const { store: { data: { title, name, item, attrs, select, actived }, }, id, } = node;
    const { data: { database }, } = useCurrentAppInfo() || {
        data: { database: {} },
    };
    const collectionData = useRef();
    const categoryData = useContext(CollectionCategoriesContext);
    collectionData.current = { ...item, title, inherits: item.inherits && new Proxy(item.inherits, {}) };
    const { category = [] } = item;
    const compile = useCompile();
    const loadCollections = async (field) => {
        return targetGraph.collections?.map((collection) => ({
            label: compile(collection.title),
            value: collection.name,
        }));
    };
    const loadCategories = async () => {
        return categoryData?.data.map((item) => ({
            label: compile(item.name),
            value: item.id,
        }));
    };
    const portsProps = {
        targetGraph,
        collectionData,
        setTargetNode,
        node,
        loadCollections,
    };
    return (React.createElement("div", { className: styles.entityContainer, style: { boxShadow: attrs?.boxShadow, border: select ? '2px dashed #f5a20a' : 0 } },
        category?.map((v, index) => {
            return (React.createElement(Badge.Ribbon, { key: index, color: v.color, style: { width: '103%', height: '3px', marginTop: index * 5 - 4, borderRadius: 0 }, placement: "start" }));
        }),
        React.createElement("div", { className: styles.headClass, style: { background: attrs?.hightLight ? '#1890ff' : null, paddingTop: category.length * 3 } },
            React.createElement("span", { className: styles.tableNameClass }, compile(title)),
            React.createElement("div", { className: styles.tableBtnClass },
                React.createElement(SchemaComponentProvider, null,
                    React.createElement(CollectionNodeProvder, { setTargetNode: setTargetNode, node: node },
                        React.createElement(CollectionProvider_deprecated, { collection: collection },
                            React.createElement(SchemaComponent, { scope: {
                                    useUpdateCollectionActionAndRefreshCM,
                                    useCancelAction,
                                    loadCollections,
                                    loadCategories,
                                    useAsyncDataSource,
                                    enableInherits: database?.dialect === 'postgres',
                                    actived: actived === true,
                                }, components: {
                                    EditOutlined,
                                    EditCollectionAction,
                                    DeleteCollectionAction,
                                    ConnectChildAction,
                                    ConnectParentAction,
                                    ...options.components,
                                }, schema: {
                                    type: 'object',
                                    name: node.id,
                                    properties: {
                                        connectParent: {
                                            type: 'void',
                                            'x-visible': '{{actived}}',
                                            'x-component': 'ConnectParentAction',
                                            'x-component-props': {
                                                item: collectionData.current,
                                                targetGraph,
                                            },
                                        },
                                        connectChild: {
                                            type: 'void',
                                            'x-component': 'ConnectChildAction',
                                            'x-component-props': {
                                                item: collectionData.current,
                                                targetGraph,
                                            },
                                            'x-visible': '{{actived}}',
                                        },
                                        update: {
                                            type: 'void',
                                            title: '{{ t("Edit") }}',
                                            'x-component': 'EditCollectionAction',
                                            'x-component-props': {
                                                type: 'primary',
                                                item: collectionData.current,
                                                className: 'btn-edit-in-head',
                                            },
                                        },
                                        delete: {
                                            type: 'void',
                                            'x-action': 'destroy',
                                            'x-component': 'DeleteCollectionAction',
                                            'x-component-props': {
                                                className: 'btn-del',
                                                getContainer: getPopupContainer,
                                                item: collectionData.current,
                                                useAction: () => {
                                                    return useDestroyActionAndRefreshCM({ name, id });
                                                },
                                            },
                                        },
                                    },
                                } })))))),
        React.createElement(PortsCom, { ...portsProps })));
};
export default Entity;
//# sourceMappingURL=Entity.js.map