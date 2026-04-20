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
 * 页面中有一个空的 Table 区块，并且有这些按钮：Add new / Delete / Refresh / Add record / Filter / view / edit / delete / duplicate
 */
export declare const oneEmptyTableBlockWithDuplicateActions: PageConfig;
export declare const T4546: {
    collections: {
        name: string;
        fields: ({
            interface: string;
            name: string;
            target?: undefined;
        } | {
            interface: string;
            name: string;
            target: string;
        })[];
    }[];
    pageSchema: {
        _isJSONSchemaObject: boolean;
        version: string;
        type: string;
        'x-component': string;
        'x-index': number;
        properties: {
            bkp6cto13sp: {
                _isJSONSchemaObject: boolean;
                version: string;
                type: string;
                'x-component': string;
                'x-initializer': string;
                'x-index': number;
                properties: {
                    gh2r1al7kar: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        'x-index': number;
                        properties: {
                            j4jda4tyqxs: {
                                _isJSONSchemaObject: boolean;
                                version: string;
                                type: string;
                                'x-component': string;
                                'x-app-version': string;
                                'x-index': number;
                                properties: {
                                    qvhl5c0e5fr: {
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
                                        'x-index': number;
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
                                                'x-index': number;
                                                'x-uid': string;
                                                'x-async': boolean;
                                            };
                                            '683o33y8rer': {
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
                                                'x-index': number;
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
                                                        'x-index': number;
                                                        properties: {
                                                            '499qzsh9sv9': {
                                                                _isJSONSchemaObject: boolean;
                                                                version: string;
                                                                type: string;
                                                                'x-decorator': string;
                                                                'x-component': string;
                                                                'x-component-props': {
                                                                    split: string;
                                                                };
                                                                'x-app-version': string;
                                                                'x-index': number;
                                                                properties: {
                                                                    p8lsl1pzaag: {
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
                                                                        'x-decorator': string;
                                                                        'x-designer-props': {
                                                                            linkageAction: boolean;
                                                                        };
                                                                        'x-index': number;
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
                                                                                'x-index': number;
                                                                                properties: {
                                                                                    tabs: {
                                                                                        _isJSONSchemaObject: boolean;
                                                                                        version: string;
                                                                                        type: string;
                                                                                        'x-component': string;
                                                                                        'x-component-props': {};
                                                                                        'x-initializer': string;
                                                                                        'x-index': number;
                                                                                        properties: {
                                                                                            tab1: {
                                                                                                _isJSONSchemaObject: boolean;
                                                                                                version: string;
                                                                                                type: string;
                                                                                                title: string;
                                                                                                'x-component': string;
                                                                                                'x-designer': string;
                                                                                                'x-component-props': {};
                                                                                                'x-index': number;
                                                                                                properties: {
                                                                                                    grid: {
                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                        version: string;
                                                                                                        type: string;
                                                                                                        'x-component': string;
                                                                                                        'x-initializer': string;
                                                                                                        'x-index': number;
                                                                                                        properties: {
                                                                                                            bufmhbg8gt4: {
                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                version: string;
                                                                                                                type: string;
                                                                                                                'x-component': string;
                                                                                                                'x-app-version': string;
                                                                                                                'x-index': number;
                                                                                                                properties: {
                                                                                                                    '99le1b5h11l': {
                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                        version: string;
                                                                                                                        type: string;
                                                                                                                        'x-component': string;
                                                                                                                        'x-app-version': string;
                                                                                                                        'x-index': number;
                                                                                                                        properties: {
                                                                                                                            '11453vew2oj': {
                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                version: string;
                                                                                                                                type: string;
                                                                                                                                'x-decorator': string;
                                                                                                                                'x-acl-action': string;
                                                                                                                                'x-use-decorator-props': string;
                                                                                                                                'x-decorator-props': {
                                                                                                                                    association: string;
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
                                                                                                                                'x-index': number;
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
                                                                                                                                        'x-index': number;
                                                                                                                                        'x-uid': string;
                                                                                                                                        'x-async': boolean;
                                                                                                                                    };
                                                                                                                                    xdyly0fcuev: {
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
                                                                                                                                        'x-index': number;
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
                                                                                                                                                'x-index': number;
                                                                                                                                                properties: {
                                                                                                                                                    s5ao886l1t3: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        'x-decorator': string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            split: string;
                                                                                                                                                        };
                                                                                                                                                        'x-app-version': string;
                                                                                                                                                        'x-index': number;
                                                                                                                                                        properties: {
                                                                                                                                                            '2a402p39tio': {
                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                version: string;
                                                                                                                                                                type: string;
                                                                                                                                                                'x-action': string;
                                                                                                                                                                'x-acl-action': string;
                                                                                                                                                                title: string;
                                                                                                                                                                'x-component': string;
                                                                                                                                                                'x-decorator': string;
                                                                                                                                                                'x-component-props': {
                                                                                                                                                                    openMode: string;
                                                                                                                                                                    component: string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    duplicateMode: string;
                                                                                                                                                                    duplicateFields: string[];
                                                                                                                                                                    duplicateCollection: string;
                                                                                                                                                                };
                                                                                                                                                                'x-toolbar': string;
                                                                                                                                                                'x-settings': string;
                                                                                                                                                                'x-designer-props': {
                                                                                                                                                                    linkageAction: boolean;
                                                                                                                                                                };
                                                                                                                                                                'x-index': number;
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
                                                                                                                                                                        'x-index': number;
                                                                                                                                                                        properties: {
                                                                                                                                                                            tabs: {
                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                version: string;
                                                                                                                                                                                type: string;
                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                'x-component-props': {};
                                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                                'x-index': number;
                                                                                                                                                                                properties: {
                                                                                                                                                                                    tab1: {
                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                        version: string;
                                                                                                                                                                                        type: string;
                                                                                                                                                                                        title: string;
                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                        'x-designer': string;
                                                                                                                                                                                        'x-component-props': {};
                                                                                                                                                                                        'x-index': number;
                                                                                                                                                                                        properties: {
                                                                                                                                                                                            grid: {
                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                version: string;
                                                                                                                                                                                                type: string;
                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                                                'x-index': number;
                                                                                                                                                                                                'x-uid': string;
                                                                                                                                                                                                'x-async': boolean;
                                                                                                                                                                                            };
                                                                                                                                                                                        };
                                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                                        'x-async': boolean;
                                                                                                                                                                                    };
                                                                                                                                                                                };
                                                                                                                                                                                'x-uid': string;
                                                                                                                                                                                'x-async': boolean;
                                                                                                                                                                            };
                                                                                                                                                                        };
                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                        'x-async': boolean;
                                                                                                                                                                    };
                                                                                                                                                                };
                                                                                                                                                                'x-uid': string;
                                                                                                                                                                'x-async': boolean;
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                        'x-uid': string;
                                                                                                                                                        'x-async': boolean;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-uid': string;
                                                                                                                                                'x-async': boolean;
                                                                                                                                            };
                                                                                                                                            lodkui6ugwp: {
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                'x-decorator': string;
                                                                                                                                                'x-toolbar': string;
                                                                                                                                                'x-settings': string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-app-version': string;
                                                                                                                                                'x-index': number;
                                                                                                                                                properties: {
                                                                                                                                                    singleLineText2: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        'x-collection-field': string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            ellipsis: boolean;
                                                                                                                                                        };
                                                                                                                                                        'x-read-pretty': boolean;
                                                                                                                                                        'x-decorator': any;
                                                                                                                                                        'x-decorator-props': {
                                                                                                                                                            labelStyle: {
                                                                                                                                                                display: string;
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                        'x-app-version': string;
                                                                                                                                                        'x-index': number;
                                                                                                                                                        'x-uid': string;
                                                                                                                                                        'x-async': boolean;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-uid': string;
                                                                                                                                                'x-async': boolean;
                                                                                                                                            };
                                                                                                                                        };
                                                                                                                                        'x-uid': string;
                                                                                                                                        'x-async': boolean;
                                                                                                                                    };
                                                                                                                                };
                                                                                                                                'x-uid': string;
                                                                                                                                'x-async': boolean;
                                                                                                                            };
                                                                                                                        };
                                                                                                                        'x-uid': string;
                                                                                                                        'x-async': boolean;
                                                                                                                    };
                                                                                                                };
                                                                                                                'x-uid': string;
                                                                                                                'x-async': boolean;
                                                                                                            };
                                                                                                        };
                                                                                                        'x-uid': string;
                                                                                                        'x-async': boolean;
                                                                                                    };
                                                                                                };
                                                                                                'x-uid': string;
                                                                                                'x-async': boolean;
                                                                                            };
                                                                                        };
                                                                                        'x-uid': string;
                                                                                        'x-async': boolean;
                                                                                    };
                                                                                };
                                                                                'x-uid': string;
                                                                                'x-async': boolean;
                                                                            };
                                                                        };
                                                                        'x-async': boolean;
                                                                    };
                                                                };
                                                                'x-uid': string;
                                                                'x-async': boolean;
                                                            };
                                                        };
                                                        'x-uid': string;
                                                        'x-async': boolean;
                                                    };
                                                };
                                                'x-uid': string;
                                                'x-async': boolean;
                                            };
                                        };
                                        'x-uid': string;
                                        'x-async': boolean;
                                    };
                                };
                                'x-uid': string;
                                'x-async': boolean;
                            };
                        };
                        'x-uid': string;
                        'x-async': boolean;
                    };
                };
                'x-uid': string;
                'x-async': boolean;
            };
        };
        'x-uid': string;
        'x-async': boolean;
    };
};
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
                                                                                                                                                        properties: {
                                                                                                                                                            ertbfj6rncg: {
                                                                                                                                                                'x-uid': string;
                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                version: string;
                                                                                                                                                                type: string;
                                                                                                                                                                'x-action': string;
                                                                                                                                                                'x-acl-action': string;
                                                                                                                                                                title: string;
                                                                                                                                                                'x-component': string;
                                                                                                                                                                'x-decorator': string;
                                                                                                                                                                'x-component-props': {
                                                                                                                                                                    openMode: string;
                                                                                                                                                                    component: string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    duplicateMode: string;
                                                                                                                                                                    duplicateFields: string[];
                                                                                                                                                                    duplicateCollection: string;
                                                                                                                                                                    iconColor: string;
                                                                                                                                                                    danger: boolean;
                                                                                                                                                                };
                                                                                                                                                                'x-toolbar': string;
                                                                                                                                                                'x-settings': string;
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
                                                                                                                                                                                                    '8688wl2mr4i': {
                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                                        properties: {
                                                                                                                                                                                                            f91h0y067hv: {
                                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                version: string;
                                                                                                                                                                                                                type: string;
                                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                                properties: {
                                                                                                                                                                                                                    pdsymaj9tip: {
                                                                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                                        'x-settings': string;
                                                                                                                                                                                                                        'x-decorator': string;
                                                                                                                                                                                                                        'x-decorator-props': {
                                                                                                                                                                                                                            name: string;
                                                                                                                                                                                                                            engine: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                        'x-editable': boolean;
                                                                                                                                                                                                                        'x-component-props': {
                                                                                                                                                                                                                            content: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-app-version': string;
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
                                                                                                                                                                                    wz1yhvrpmrv: {
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
                                                                                                                                                                                                    y5zjil8oaa3: {
                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                                        properties: {
                                                                                                                                                                                                            v0gws5adwan: {
                                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                version: string;
                                                                                                                                                                                                                type: string;
                                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                                properties: {
                                                                                                                                                                                                                    igm7sdsm3ur: {
                                                                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                                        'x-settings': string;
                                                                                                                                                                                                                        'x-decorator': string;
                                                                                                                                                                                                                        'x-decorator-props': {
                                                                                                                                                                                                                            name: string;
                                                                                                                                                                                                                            engine: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                        'x-editable': boolean;
                                                                                                                                                                                                                        'x-component-props': {
                                                                                                                                                                                                                            content: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-app-version': string;
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
                                                                                                                                                        properties: {
                                                                                                                                                            loi6el5pg6g: {
                                                                                                                                                                'x-uid': string;
                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                version: string;
                                                                                                                                                                type: string;
                                                                                                                                                                'x-action': string;
                                                                                                                                                                'x-acl-action': string;
                                                                                                                                                                title: string;
                                                                                                                                                                'x-component': string;
                                                                                                                                                                'x-decorator': string;
                                                                                                                                                                'x-component-props': {
                                                                                                                                                                    openMode: string;
                                                                                                                                                                    component: string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    duplicateMode: string;
                                                                                                                                                                    duplicateFields: string[];
                                                                                                                                                                    duplicateCollection: string;
                                                                                                                                                                    iconColor: string;
                                                                                                                                                                    danger: boolean;
                                                                                                                                                                };
                                                                                                                                                                'x-toolbar': string;
                                                                                                                                                                'x-settings': string;
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
                                                                                                                                                                                                    dx47nd4vr1y: {
                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                                        properties: {
                                                                                                                                                                                                            k0xrnil5pew: {
                                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                version: string;
                                                                                                                                                                                                                type: string;
                                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                                properties: {
                                                                                                                                                                                                                    l0bj7opq4ts: {
                                                                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                                        'x-settings': string;
                                                                                                                                                                                                                        'x-decorator': string;
                                                                                                                                                                                                                        'x-decorator-props': {
                                                                                                                                                                                                                            name: string;
                                                                                                                                                                                                                            engine: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                        'x-editable': boolean;
                                                                                                                                                                                                                        'x-component-props': {
                                                                                                                                                                                                                            content: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-app-version': string;
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
                                                                                                                                                                                    k0dihwjrh0j: {
                                                                                                                                                                                        'x-uid': string;
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
                                                                                                                                                                                                    '84pz8mhlfi8': {
                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                                        properties: {
                                                                                                                                                                                                            dbm9wbvxfj5: {
                                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                version: string;
                                                                                                                                                                                                                type: string;
                                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                                properties: {
                                                                                                                                                                                                                    '5yhn7kfi2yw': {
                                                                                                                                                                                                                        'x-uid': string;
                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                                        'x-settings': string;
                                                                                                                                                                                                                        'x-decorator': string;
                                                                                                                                                                                                                        'x-decorator-props': {
                                                                                                                                                                                                                            name: string;
                                                                                                                                                                                                                            engine: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                        'x-editable': boolean;
                                                                                                                                                                                                                        'x-component-props': {
                                                                                                                                                                                                                            content: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-app-version': string;
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
