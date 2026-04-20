/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PageConfig } from '@nocobase/test/e2e';
export declare const emptyPageWithCalendarCollection: PageConfig;
export declare const oneTableWithCalendarCollection: PageConfig;
export declare const backgroundColorFieldBasic: {
    collections: {
        name: string;
        fields: ({
            name: string;
            interface: string;
            uiSchema?: undefined;
        } | {
            interface: string;
            uiSchema: {
                title: string;
                type: string;
                'x-component': string;
                enum: {
                    value: string;
                    label: string;
                    color: string;
                }[];
            };
            name?: undefined;
        })[];
    }[];
    pageSchema: {
        _isJSONSchemaObject: boolean;
        version: string;
        type: string;
        'x-component': string;
        properties: {
            hsu2v4rjr50: {
                _isJSONSchemaObject: boolean;
                version: string;
                type: string;
                'x-component': string;
                'x-initializer': string;
                properties: {
                    '7394n0636cb': {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        properties: {
                            oz0q63vbxy2: {
                                _isJSONSchemaObject: boolean;
                                version: string;
                                type: string;
                                'x-component': string;
                                'x-app-version': string;
                                properties: {
                                    pktfhea4eub: {
                                        _isJSONSchemaObject: boolean;
                                        version: string;
                                        type: string;
                                        'x-acl-action': string;
                                        'x-decorator': string;
                                        'x-use-decorator-props': string;
                                        'x-decorator-props': {
                                            collection: string;
                                            dataSource: string;
                                            action: string;
                                            fieldNames: {
                                                id: string;
                                                start: string;
                                                title: string;
                                                end: string[];
                                            };
                                            params: {
                                                paginate: boolean;
                                            };
                                        };
                                        'x-toolbar': string;
                                        'x-settings': string;
                                        'x-component': string;
                                        'x-app-version': string;
                                        properties: {
                                            '3byzt7u4wnz': {
                                                _isJSONSchemaObject: boolean;
                                                version: string;
                                                type: string;
                                                'x-component': string;
                                                'x-use-component-props': string;
                                                'x-app-version': string;
                                                properties: {
                                                    toolBar: {
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        'x-component': string;
                                                        'x-component-props': {
                                                            style: {
                                                                marginBottom: number;
                                                            };
                                                        };
                                                        'x-initializer': string;
                                                        'x-app-version': string;
                                                        'x-uid': string;
                                                        'x-async': boolean;
                                                        'x-index': number;
                                                    };
                                                    event: {
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        'x-component': string;
                                                        'x-app-version': string;
                                                        properties: {
                                                            drawer: {
                                                                _isJSONSchemaObject: boolean;
                                                                version: string;
                                                                type: string;
                                                                'x-component': string;
                                                                'x-component-props': {
                                                                    className: string;
                                                                };
                                                                title: string;
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
                                                                                        'x-initializer-props': {
                                                                                            actionInitializers: string;
                                                                                        };
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
export declare const clickingAndClosingNestedPopups: {
    pageSchema: {
        _isJSONSchemaObject: boolean;
        version: string;
        type: string;
        'x-component': string;
        'x-app-version': string;
        properties: {
            gu3lh4ohfmv: {
                _isJSONSchemaObject: boolean;
                version: string;
                type: string;
                'x-component': string;
                'x-initializer': string;
                'x-app-version': string;
                properties: {
                    '0k716vx55jw': {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        properties: {
                            '071seig43nq': {
                                _isJSONSchemaObject: boolean;
                                version: string;
                                type: string;
                                'x-component': string;
                                'x-app-version': string;
                                properties: {
                                    '27bjkk814v0': {
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
                                            nzjfwy6u3xz: {
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
                                                            t1guxxh00u2: {
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
                                                                    ibdtt3wddl1: {
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
                                                                                                            j42bnb1n6yi: {
                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                version: string;
                                                                                                                type: string;
                                                                                                                'x-component': string;
                                                                                                                'x-app-version': string;
                                                                                                                properties: {
                                                                                                                    wg7hugxuf56: {
                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                        version: string;
                                                                                                                        type: string;
                                                                                                                        'x-component': string;
                                                                                                                        'x-app-version': string;
                                                                                                                        properties: {
                                                                                                                            '2hp241xeuef': {
                                                                                                                                'x-uid': string;
                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                version: string;
                                                                                                                                type: string;
                                                                                                                                'x-acl-action': string;
                                                                                                                                'x-decorator': string;
                                                                                                                                'x-use-decorator-props': string;
                                                                                                                                'x-decorator-props': {
                                                                                                                                    collection: string;
                                                                                                                                    dataSource: string;
                                                                                                                                    action: string;
                                                                                                                                    fieldNames: {
                                                                                                                                        id: string;
                                                                                                                                        start: string;
                                                                                                                                        title: string;
                                                                                                                                        end: string[];
                                                                                                                                    };
                                                                                                                                    params: {
                                                                                                                                        paginate: boolean;
                                                                                                                                    };
                                                                                                                                };
                                                                                                                                'x-toolbar': string;
                                                                                                                                'x-settings': string;
                                                                                                                                'x-component': string;
                                                                                                                                'x-app-version': string;
                                                                                                                                'x-component-props': {
                                                                                                                                    title: string;
                                                                                                                                };
                                                                                                                                properties: {
                                                                                                                                    '57jxlpnfu9t': {
                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                        version: string;
                                                                                                                                        type: string;
                                                                                                                                        'x-component': string;
                                                                                                                                        'x-use-component-props': string;
                                                                                                                                        'x-app-version': string;
                                                                                                                                        properties: {
                                                                                                                                            toolBar: {
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-component-props': {
                                                                                                                                                    style: {
                                                                                                                                                        marginBottom: number;
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                                'x-initializer': string;
                                                                                                                                                'x-app-version': string;
                                                                                                                                                'x-uid': string;
                                                                                                                                                'x-async': boolean;
                                                                                                                                                'x-index': number;
                                                                                                                                            };
                                                                                                                                            event: {
                                                                                                                                                'x-uid': string;
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-app-version': string;
                                                                                                                                                'x-action-context': {
                                                                                                                                                    dataSource: string;
                                                                                                                                                    collection: string;
                                                                                                                                                };
                                                                                                                                                properties: {
                                                                                                                                                    drawer: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            className: string;
                                                                                                                                                        };
                                                                                                                                                        title: string;
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
                                                                                                                                                                                'x-initializer-props': {
                                                                                                                                                                                    actionInitializers: string;
                                                                                                                                                                                };
                                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                properties: {
                                                                                                                                                                                    bh4zvrtn09t: {
                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                        version: string;
                                                                                                                                                                                        type: string;
                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                        properties: {
                                                                                                                                                                                            '0lh42pfh3ph': {
                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                version: string;
                                                                                                                                                                                                type: string;
                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                properties: {
                                                                                                                                                                                                    '2kq6pr243vl': {
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
