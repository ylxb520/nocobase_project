/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CollectionSetting, PageConfig } from '@nocobase/test/e2e';
/**
 * 1. 创建一个名为 general 的 collection，其包含 时间、Percent 类型的字段
 */
export declare const generalWithDatetimeFields: CollectionSetting[];
export declare const oneEmptyGantt: PageConfig;
/**
 * 一个空的 Table 区块，并且有这些按钮：Bulk edit
 */
export declare const oneEmptyTableBlockWithCustomizeActions: PageConfig;
export declare const theAddBlockButtonInDrawerShouldBeVisible: {
    pageSchema: {
        _isJSONSchemaObject: boolean;
        version: string;
        type: string;
        'x-component': string;
        'x-app-version': string;
        properties: {
            ydtgms2lmr4: {
                _isJSONSchemaObject: boolean;
                version: string;
                type: string;
                'x-component': string;
                'x-initializer': string;
                'x-app-version': string;
                properties: {
                    jk8ix7ivmvb: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        properties: {
                            fdohqzh304u: {
                                _isJSONSchemaObject: boolean;
                                version: string;
                                type: string;
                                'x-component': string;
                                'x-app-version': string;
                                properties: {
                                    syp961jrbvs: {
                                        _isJSONSchemaObject: boolean;
                                        version: string;
                                        type: string;
                                        'x-decorator': string;
                                        'x-acl-action': string;
                                        'x-use-decorator-props': string;
                                        'x-decorator-props': {
                                            collection: string;
                                            dataSource: string;
                                            action: string;
                                            params: {
                                                pageSize: number;
                                            };
                                            rowKey: string;
                                            showIndex: boolean;
                                            dragSort: boolean;
                                        };
                                        'x-toolbar': string;
                                        'x-settings': string;
                                        'x-component': string;
                                        'x-filter-targets': any[];
                                        'x-app-version': string;
                                        properties: {
                                            actions: {
                                                _isJSONSchemaObject: boolean;
                                                version: string;
                                                type: string;
                                                'x-initializer': string;
                                                'x-component': string;
                                                'x-component-props': {
                                                    style: {
                                                        marginBottom: string;
                                                    };
                                                };
                                                'x-app-version': string;
                                                'x-uid': string;
                                                'x-async': boolean;
                                                'x-index': number;
                                            };
                                            bflk6vcqbda: {
                                                _isJSONSchemaObject: boolean;
                                                version: string;
                                                type: string;
                                                'x-initializer': string;
                                                'x-component': string;
                                                'x-use-component-props': string;
                                                'x-component-props': {
                                                    rowKey: string;
                                                    rowSelection: {
                                                        type: string;
                                                    };
                                                };
                                                'x-app-version': string;
                                                properties: {
                                                    actions: {
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        title: string;
                                                        'x-action-column': string;
                                                        'x-decorator': string;
                                                        'x-component': string;
                                                        'x-toolbar': string;
                                                        'x-initializer': string;
                                                        'x-settings': string;
                                                        'x-toolbar-props': {
                                                            initializer: string;
                                                        };
                                                        'x-app-version': string;
                                                        properties: {
                                                            '9fy397o5n7x': {
                                                                _isJSONSchemaObject: boolean;
                                                                version: string;
                                                                type: string;
                                                                'x-decorator': string;
                                                                'x-component': string;
                                                                'x-component-props': {
                                                                    split: string;
                                                                };
                                                                'x-app-version': string;
                                                                properties: {
                                                                    ujxoicj1do2: {
                                                                        'x-uid': string;
                                                                        _isJSONSchemaObject: boolean;
                                                                        version: string;
                                                                        type: string;
                                                                        title: string;
                                                                        'x-action': string;
                                                                        'x-toolbar': string;
                                                                        'x-settings': string;
                                                                        'x-component': string;
                                                                        'x-component-props': {
                                                                            openMode: string;
                                                                            iconColor: string;
                                                                            danger: boolean;
                                                                        };
                                                                        'x-action-context': {
                                                                            dataSource: string;
                                                                            collection: string;
                                                                        };
                                                                        'x-decorator': string;
                                                                        'x-designer-props': {
                                                                            linkageAction: boolean;
                                                                        };
                                                                        properties: {
                                                                            drawer: {
                                                                                _isJSONSchemaObject: boolean;
                                                                                version: string;
                                                                                type: string;
                                                                                title: string;
                                                                                'x-component': string;
                                                                                'x-component-props': {
                                                                                    className: string;
                                                                                };
                                                                                properties: {
                                                                                    tabs: {
                                                                                        _isJSONSchemaObject: boolean;
                                                                                        version: string;
                                                                                        type: string;
                                                                                        'x-component': string;
                                                                                        'x-component-props': {};
                                                                                        'x-initializer': string;
                                                                                        properties: {
                                                                                            tab1: {
                                                                                                _isJSONSchemaObject: boolean;
                                                                                                version: string;
                                                                                                type: string;
                                                                                                title: string;
                                                                                                'x-component': string;
                                                                                                'x-designer': string;
                                                                                                'x-component-props': {};
                                                                                                properties: {
                                                                                                    grid: {
                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                        version: string;
                                                                                                        type: string;
                                                                                                        'x-component': string;
                                                                                                        'x-initializer': string;
                                                                                                        properties: {
                                                                                                            gkbkej9bcfg: {
                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                version: string;
                                                                                                                type: string;
                                                                                                                'x-component': string;
                                                                                                                'x-app-version': string;
                                                                                                                properties: {
                                                                                                                    qsnxw1kyglw: {
                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                        version: string;
                                                                                                                        type: string;
                                                                                                                        'x-component': string;
                                                                                                                        'x-app-version': string;
                                                                                                                        properties: {
                                                                                                                            rg5p0jxa04f: {
                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                version: string;
                                                                                                                                type: string;
                                                                                                                                'x-decorator': string;
                                                                                                                                'x-acl-action': string;
                                                                                                                                'x-use-decorator-props': string;
                                                                                                                                'x-decorator-props': {
                                                                                                                                    collection: string;
                                                                                                                                    dataSource: string;
                                                                                                                                    action: string;
                                                                                                                                    params: {
                                                                                                                                        pageSize: number;
                                                                                                                                    };
                                                                                                                                    rowKey: string;
                                                                                                                                    showIndex: boolean;
                                                                                                                                    dragSort: boolean;
                                                                                                                                };
                                                                                                                                'x-toolbar': string;
                                                                                                                                'x-settings': string;
                                                                                                                                'x-component': string;
                                                                                                                                'x-filter-targets': any[];
                                                                                                                                'x-app-version': string;
                                                                                                                                properties: {
                                                                                                                                    actions: {
                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                        version: string;
                                                                                                                                        type: string;
                                                                                                                                        'x-initializer': string;
                                                                                                                                        'x-component': string;
                                                                                                                                        'x-component-props': {
                                                                                                                                            style: {
                                                                                                                                                marginBottom: string;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-app-version': string;
                                                                                                                                        properties: {
                                                                                                                                            yrh6fyeotth: {
                                                                                                                                                'x-uid': string;
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                title: string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-action': string;
                                                                                                                                                'x-action-settings': {
                                                                                                                                                    updateMode: string;
                                                                                                                                                };
                                                                                                                                                'x-component-props': {
                                                                                                                                                    openMode: string;
                                                                                                                                                    icon: string;
                                                                                                                                                    iconColor: string;
                                                                                                                                                    danger: boolean;
                                                                                                                                                    type: string;
                                                                                                                                                };
                                                                                                                                                'x-align': string;
                                                                                                                                                'x-decorator': string;
                                                                                                                                                'x-toolbar': string;
                                                                                                                                                'x-settings': string;
                                                                                                                                                'x-acl-action': string;
                                                                                                                                                'x-acl-action-props': {
                                                                                                                                                    skipScopeCheck: boolean;
                                                                                                                                                };
                                                                                                                                                'x-app-version': string;
                                                                                                                                                properties: {
                                                                                                                                                    drawer: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        title: string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            className: string;
                                                                                                                                                        };
                                                                                                                                                        'x-app-version': string;
                                                                                                                                                        properties: {
                                                                                                                                                            tabs: {
                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                version: string;
                                                                                                                                                                type: string;
                                                                                                                                                                'x-component': string;
                                                                                                                                                                'x-component-props': {};
                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                'x-initializer-props': {
                                                                                                                                                                    gridInitializer: string;
                                                                                                                                                                };
                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                properties: {
                                                                                                                                                                    tab1: {
                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                        version: string;
                                                                                                                                                                        type: string;
                                                                                                                                                                        title: string;
                                                                                                                                                                        'x-component': string;
                                                                                                                                                                        'x-designer': string;
                                                                                                                                                                        'x-component-props': {};
                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                        properties: {
                                                                                                                                                                            grid: {
                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                version: string;
                                                                                                                                                                                type: string;
                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                'x-uid': string;
                                                                                                                                                                                'x-async': boolean;
                                                                                                                                                                                'x-index': number;
                                                                                                                                                                            };
                                                                                                                                                                        };
                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                        'x-async': boolean;
                                                                                                                                                                        'x-index': number;
                                                                                                                                                                    };
                                                                                                                                                                };
                                                                                                                                                                'x-uid': string;
                                                                                                                                                                'x-async': boolean;
                                                                                                                                                                'x-index': number;
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                        'x-uid': string;
                                                                                                                                                        'x-async': boolean;
                                                                                                                                                        'x-index': number;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-async': boolean;
                                                                                                                                                'x-index': number;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-uid': string;
                                                                                                                                        'x-async': boolean;
                                                                                                                                        'x-index': number;
                                                                                                                                    };
                                                                                                                                    lodqxwvvrwu: {
                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                        version: string;
                                                                                                                                        type: string;
                                                                                                                                        'x-initializer': string;
                                                                                                                                        'x-component': string;
                                                                                                                                        'x-use-component-props': string;
                                                                                                                                        'x-component-props': {
                                                                                                                                            rowKey: string;
                                                                                                                                            rowSelection: {
                                                                                                                                                type: string;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-app-version': string;
                                                                                                                                        properties: {
                                                                                                                                            actions: {
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                title: string;
                                                                                                                                                'x-action-column': string;
                                                                                                                                                'x-decorator': string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-toolbar': string;
                                                                                                                                                'x-initializer': string;
                                                                                                                                                'x-settings': string;
                                                                                                                                                'x-toolbar-props': {
                                                                                                                                                    initializer: string;
                                                                                                                                                };
                                                                                                                                                'x-app-version': string;
                                                                                                                                                properties: {
                                                                                                                                                    '1gt1zh3wlhl': {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        'x-decorator': string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            split: string;
                                                                                                                                                        };
                                                                                                                                                        'x-app-version': string;
                                                                                                                                                        'x-uid': string;
                                                                                                                                                        'x-async': boolean;
                                                                                                                                                        'x-index': number;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-uid': string;
                                                                                                                                                'x-async': boolean;
                                                                                                                                                'x-index': number;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-uid': string;
                                                                                                                                        'x-async': boolean;
                                                                                                                                        'x-index': number;
                                                                                                                                    };
                                                                                                                                };
                                                                                                                                'x-uid': string;
                                                                                                                                'x-async': boolean;
                                                                                                                                'x-index': number;
                                                                                                                            };
                                                                                                                        };
                                                                                                                        'x-uid': string;
                                                                                                                        'x-async': boolean;
                                                                                                                        'x-index': number;
                                                                                                                    };
                                                                                                                };
                                                                                                                'x-uid': string;
                                                                                                                'x-async': boolean;
                                                                                                                'x-index': number;
                                                                                                            };
                                                                                                        };
                                                                                                        'x-uid': string;
                                                                                                        'x-async': boolean;
                                                                                                        'x-index': number;
                                                                                                    };
                                                                                                };
                                                                                                'x-uid': string;
                                                                                                'x-async': boolean;
                                                                                                'x-index': number;
                                                                                            };
                                                                                            gljvwj6dtl8: {
                                                                                                _isJSONSchemaObject: boolean;
                                                                                                version: string;
                                                                                                type: string;
                                                                                                title: string;
                                                                                                'x-component': string;
                                                                                                'x-designer': string;
                                                                                                'x-component-props': {};
                                                                                                'x-app-version': string;
                                                                                                properties: {
                                                                                                    grid: {
                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                        version: string;
                                                                                                        type: string;
                                                                                                        'x-component': string;
                                                                                                        'x-initializer': string;
                                                                                                        'x-app-version': string;
                                                                                                        properties: {
                                                                                                            c1yhos175hj: {
                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                version: string;
                                                                                                                type: string;
                                                                                                                'x-component': string;
                                                                                                                'x-app-version': string;
                                                                                                                properties: {
                                                                                                                    yhbbftd4j86: {
                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                        version: string;
                                                                                                                        type: string;
                                                                                                                        'x-component': string;
                                                                                                                        'x-app-version': string;
                                                                                                                        properties: {
                                                                                                                            '4y4cdnzx645': {
                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                version: string;
                                                                                                                                type: string;
                                                                                                                                'x-decorator': string;
                                                                                                                                'x-acl-action': string;
                                                                                                                                'x-use-decorator-props': string;
                                                                                                                                'x-decorator-props': {
                                                                                                                                    collection: string;
                                                                                                                                    dataSource: string;
                                                                                                                                    action: string;
                                                                                                                                    params: {
                                                                                                                                        pageSize: number;
                                                                                                                                    };
                                                                                                                                    rowKey: string;
                                                                                                                                    showIndex: boolean;
                                                                                                                                    dragSort: boolean;
                                                                                                                                };
                                                                                                                                'x-toolbar': string;
                                                                                                                                'x-settings': string;
                                                                                                                                'x-component': string;
                                                                                                                                'x-filter-targets': any[];
                                                                                                                                'x-app-version': string;
                                                                                                                                properties: {
                                                                                                                                    actions: {
                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                        version: string;
                                                                                                                                        type: string;
                                                                                                                                        'x-initializer': string;
                                                                                                                                        'x-component': string;
                                                                                                                                        'x-component-props': {
                                                                                                                                            style: {
                                                                                                                                                marginBottom: string;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-app-version': string;
                                                                                                                                        properties: {
                                                                                                                                            vp75269u5ai: {
                                                                                                                                                'x-uid': string;
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                title: string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-action': string;
                                                                                                                                                'x-action-settings': {
                                                                                                                                                    updateMode: string;
                                                                                                                                                };
                                                                                                                                                'x-component-props': {
                                                                                                                                                    openMode: string;
                                                                                                                                                    icon: string;
                                                                                                                                                    iconColor: string;
                                                                                                                                                    danger: boolean;
                                                                                                                                                    type: string;
                                                                                                                                                };
                                                                                                                                                'x-align': string;
                                                                                                                                                'x-decorator': string;
                                                                                                                                                'x-toolbar': string;
                                                                                                                                                'x-settings': string;
                                                                                                                                                'x-acl-action': string;
                                                                                                                                                'x-acl-action-props': {
                                                                                                                                                    skipScopeCheck: boolean;
                                                                                                                                                };
                                                                                                                                                'x-app-version': string;
                                                                                                                                                properties: {
                                                                                                                                                    drawer: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        title: string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            className: string;
                                                                                                                                                        };
                                                                                                                                                        'x-app-version': string;
                                                                                                                                                        properties: {
                                                                                                                                                            tabs: {
                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                version: string;
                                                                                                                                                                type: string;
                                                                                                                                                                'x-component': string;
                                                                                                                                                                'x-component-props': {};
                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                'x-initializer-props': {
                                                                                                                                                                    gridInitializer: string;
                                                                                                                                                                };
                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                properties: {
                                                                                                                                                                    tab1: {
                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                        version: string;
                                                                                                                                                                        type: string;
                                                                                                                                                                        title: string;
                                                                                                                                                                        'x-component': string;
                                                                                                                                                                        'x-designer': string;
                                                                                                                                                                        'x-component-props': {};
                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                        properties: {
                                                                                                                                                                            grid: {
                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                version: string;
                                                                                                                                                                                type: string;
                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                'x-uid': string;
                                                                                                                                                                                'x-async': boolean;
                                                                                                                                                                                'x-index': number;
                                                                                                                                                                            };
                                                                                                                                                                        };
                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                        'x-async': boolean;
                                                                                                                                                                        'x-index': number;
                                                                                                                                                                    };
                                                                                                                                                                };
                                                                                                                                                                'x-uid': string;
                                                                                                                                                                'x-async': boolean;
                                                                                                                                                                'x-index': number;
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                        'x-uid': string;
                                                                                                                                                        'x-async': boolean;
                                                                                                                                                        'x-index': number;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-async': boolean;
                                                                                                                                                'x-index': number;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-uid': string;
                                                                                                                                        'x-async': boolean;
                                                                                                                                        'x-index': number;
                                                                                                                                    };
                                                                                                                                    p5i670h31zl: {
                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                        version: string;
                                                                                                                                        type: string;
                                                                                                                                        'x-initializer': string;
                                                                                                                                        'x-component': string;
                                                                                                                                        'x-use-component-props': string;
                                                                                                                                        'x-component-props': {
                                                                                                                                            rowKey: string;
                                                                                                                                            rowSelection: {
                                                                                                                                                type: string;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-app-version': string;
                                                                                                                                        properties: {
                                                                                                                                            actions: {
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                title: string;
                                                                                                                                                'x-action-column': string;
                                                                                                                                                'x-decorator': string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-toolbar': string;
                                                                                                                                                'x-initializer': string;
                                                                                                                                                'x-settings': string;
                                                                                                                                                'x-toolbar-props': {
                                                                                                                                                    initializer: string;
                                                                                                                                                };
                                                                                                                                                'x-app-version': string;
                                                                                                                                                properties: {
                                                                                                                                                    owyte0l5cgt: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        'x-decorator': string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            split: string;
                                                                                                                                                        };
                                                                                                                                                        'x-app-version': string;
                                                                                                                                                        'x-uid': string;
                                                                                                                                                        'x-async': boolean;
                                                                                                                                                        'x-index': number;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-uid': string;
                                                                                                                                                'x-async': boolean;
                                                                                                                                                'x-index': number;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-uid': string;
                                                                                                                                        'x-async': boolean;
                                                                                                                                        'x-index': number;
                                                                                                                                    };
                                                                                                                                };
                                                                                                                                'x-uid': string;
                                                                                                                                'x-async': boolean;
                                                                                                                                'x-index': number;
                                                                                                                            };
                                                                                                                        };
                                                                                                                        'x-uid': string;
                                                                                                                        'x-async': boolean;
                                                                                                                        'x-index': number;
                                                                                                                    };
                                                                                                                };
                                                                                                                'x-uid': string;
                                                                                                                'x-async': boolean;
                                                                                                                'x-index': number;
                                                                                                            };
                                                                                                        };
                                                                                                        'x-uid': string;
                                                                                                        'x-async': boolean;
                                                                                                        'x-index': number;
                                                                                                    };
                                                                                                };
                                                                                                'x-uid': string;
                                                                                                'x-async': boolean;
                                                                                                'x-index': number;
                                                                                            };
                                                                                        };
                                                                                        'x-uid': string;
                                                                                        'x-async': boolean;
                                                                                        'x-index': number;
                                                                                    };
                                                                                };
                                                                                'x-uid': string;
                                                                                'x-async': boolean;
                                                                                'x-index': number;
                                                                            };
                                                                        };
                                                                        'x-async': boolean;
                                                                        'x-index': number;
                                                                    };
                                                                };
                                                                'x-uid': string;
                                                                'x-async': boolean;
                                                                'x-index': number;
                                                            };
                                                        };
                                                        'x-uid': string;
                                                        'x-async': boolean;
                                                        'x-index': number;
                                                    };
                                                };
                                                'x-uid': string;
                                                'x-async': boolean;
                                                'x-index': number;
                                            };
                                        };
                                        'x-uid': string;
                                        'x-async': boolean;
                                        'x-index': number;
                                    };
                                };
                                'x-uid': string;
                                'x-async': boolean;
                                'x-index': number;
                            };
                        };
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                };
                'x-uid': string;
                'x-async': boolean;
                'x-index': number;
            };
        };
        'x-uid': string;
        'x-async': boolean;
        'x-index': number;
    };
};
export declare const afterConfiguringTheModalWhenReopeningItTheContentShouldPersist: {
    pageSchema: {
        type: string;
        'x-component': string;
        name: string;
        'x-uid': string;
        'x-async': boolean;
        properties: {
            tab: {
                type: string;
                'x-component': string;
                'x-initializer': string;
                properties: {
                    bmsmf8futai: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    noe2oca30hc: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    w2hnq7rau9p: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    fcfs4oot86g: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    i22fydav355: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    row_6u7y7uccrvz: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-index': number;
                        'x-uid': string;
                        'x-async': boolean;
                    };
                    higfesvgj7g: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    '37myao9n0wc': {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    uvfd76q4ye9: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    miidizeqgot: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    hxmr87i5imu: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    pa8dwdi4h5a: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    pno0a05tbnp: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    uj09g5xgnr1: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    giobcwj316k: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                    oznewtbvuyw: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        properties: {
                            bwtax0bnnp3: {
                                _isJSONSchemaObject: boolean;
                                version: string;
                                type: string;
                                'x-component': string;
                                'x-app-version': string;
                                properties: {
                                    c0bypj7wg5q: {
                                        _isJSONSchemaObject: boolean;
                                        version: string;
                                        type: string;
                                        'x-decorator': string;
                                        'x-acl-action': string;
                                        'x-use-decorator-props': string;
                                        'x-decorator-props': {
                                            collection: string;
                                            dataSource: string;
                                            action: string;
                                            params: {
                                                pageSize: number;
                                            };
                                            rowKey: string;
                                            showIndex: boolean;
                                            dragSort: boolean;
                                        };
                                        'x-toolbar': string;
                                        'x-settings': string;
                                        'x-component': string;
                                        'x-filter-targets': any[];
                                        'x-app-version': string;
                                        properties: {
                                            actions: {
                                                _isJSONSchemaObject: boolean;
                                                version: string;
                                                type: string;
                                                'x-initializer': string;
                                                'x-component': string;
                                                'x-component-props': {
                                                    style: {
                                                        marginBottom: string;
                                                    };
                                                };
                                                'x-app-version': string;
                                                properties: {
                                                    '1dlvhzr308c': {
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        title: string;
                                                        'x-component': string;
                                                        'x-action': string;
                                                        'x-action-settings': {
                                                            updateMode: string;
                                                        };
                                                        'x-component-props': {
                                                            openMode: string;
                                                            icon: string;
                                                        };
                                                        'x-align': string;
                                                        'x-decorator': string;
                                                        'x-toolbar': string;
                                                        'x-settings': string;
                                                        'x-acl-action': string;
                                                        'x-acl-action-props': {
                                                            skipScopeCheck: boolean;
                                                        };
                                                        'x-app-version': string;
                                                        properties: {
                                                            drawer: {
                                                                _isJSONSchemaObject: boolean;
                                                                version: string;
                                                                type: string;
                                                                title: string;
                                                                'x-component': string;
                                                                'x-component-props': {
                                                                    className: string;
                                                                };
                                                                'x-app-version': string;
                                                                properties: {
                                                                    tabs: {
                                                                        _isJSONSchemaObject: boolean;
                                                                        version: string;
                                                                        type: string;
                                                                        'x-component': string;
                                                                        'x-component-props': {};
                                                                        'x-initializer': string;
                                                                        'x-initializer-props': {
                                                                            gridInitializer: string;
                                                                        };
                                                                        'x-app-version': string;
                                                                        properties: {
                                                                            tab1: {
                                                                                _isJSONSchemaObject: boolean;
                                                                                version: string;
                                                                                type: string;
                                                                                title: string;
                                                                                'x-component': string;
                                                                                'x-designer': string;
                                                                                'x-component-props': {};
                                                                                'x-app-version': string;
                                                                                properties: {
                                                                                    grid: {
                                                                                        _isJSONSchemaObject: boolean;
                                                                                        version: string;
                                                                                        type: string;
                                                                                        'x-component': string;
                                                                                        'x-initializer': string;
                                                                                        'x-app-version': string;
                                                                                        'x-uid': string;
                                                                                        'x-async': boolean;
                                                                                        'x-index': number;
                                                                                    };
                                                                                };
                                                                                'x-uid': string;
                                                                                'x-async': boolean;
                                                                                'x-index': number;
                                                                            };
                                                                        };
                                                                        'x-uid': string;
                                                                        'x-async': boolean;
                                                                        'x-index': number;
                                                                    };
                                                                };
                                                                'x-uid': string;
                                                                'x-async': boolean;
                                                                'x-index': number;
                                                            };
                                                        };
                                                        'x-uid': string;
                                                        'x-async': boolean;
                                                        'x-index': number;
                                                    };
                                                };
                                                'x-uid': string;
                                                'x-async': boolean;
                                                'x-index': number;
                                            };
                                            f232o2ds23n: {
                                                _isJSONSchemaObject: boolean;
                                                version: string;
                                                type: string;
                                                'x-initializer': string;
                                                'x-component': string;
                                                'x-use-component-props': string;
                                                'x-component-props': {
                                                    rowKey: string;
                                                    rowSelection: {
                                                        type: string;
                                                    };
                                                };
                                                'x-app-version': string;
                                                properties: {
                                                    actions: {
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        title: string;
                                                        'x-action-column': string;
                                                        'x-decorator': string;
                                                        'x-component': string;
                                                        'x-toolbar': string;
                                                        'x-initializer': string;
                                                        'x-settings': string;
                                                        'x-toolbar-props': {
                                                            initializer: string;
                                                        };
                                                        'x-app-version': string;
                                                        properties: {
                                                            '153lpq30p5f': {
                                                                _isJSONSchemaObject: boolean;
                                                                version: string;
                                                                type: string;
                                                                'x-decorator': string;
                                                                'x-component': string;
                                                                'x-component-props': {
                                                                    split: string;
                                                                };
                                                                'x-app-version': string;
                                                                'x-uid': string;
                                                                'x-async': boolean;
                                                                'x-index': number;
                                                            };
                                                        };
                                                        'x-uid': string;
                                                        'x-async': boolean;
                                                        'x-index': number;
                                                    };
                                                };
                                                'x-uid': string;
                                                'x-async': boolean;
                                                'x-index': number;
                                            };
                                        };
                                        'x-uid': string;
                                        'x-async': boolean;
                                        'x-index': number;
                                    };
                                };
                                'x-uid': string;
                                'x-async': boolean;
                                'x-index': number;
                            };
                        };
                        'x-uid': string;
                        'x-async': boolean;
                        'x-index': number;
                    };
                };
                name: string;
                'x-uid': string;
                'x-async': boolean;
                'x-index': number;
            };
        };
    };
};
