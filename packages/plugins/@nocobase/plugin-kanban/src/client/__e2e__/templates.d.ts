/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const kanbanURL: {
    collections: {
        name: string;
        fields: ({
            name: string;
            interface: string;
            uiSchema: {
                enum: {
                    value: string;
                    label: string;
                    color: string;
                }[];
                type: string;
                'x-component': string;
                title: string;
            };
            scopeKey?: undefined;
        } | {
            name: string;
            interface: string;
            scopeKey: string;
            uiSchema?: undefined;
        })[];
    }[];
    pageSchema: {
        _isJSONSchemaObject: boolean;
        version: string;
        type: string;
        'x-component': string;
        properties: {
            eehnoq75dyp: {
                _isJSONSchemaObject: boolean;
                version: string;
                type: string;
                'x-component': string;
                'x-initializer': string;
                properties: {
                    qy13k7twlgr: {
                        _isJSONSchemaObject: boolean;
                        version: string;
                        type: string;
                        'x-component': string;
                        'x-app-version': string;
                        properties: {
                            z2zx32gyeno: {
                                _isJSONSchemaObject: boolean;
                                version: string;
                                type: string;
                                'x-component': string;
                                'x-app-version': string;
                                properties: {
                                    '6h3p53u5ek7': {
                                        _isJSONSchemaObject: boolean;
                                        version: string;
                                        type: string;
                                        'x-acl-action': string;
                                        'x-decorator': string;
                                        'x-decorator-props': {
                                            collection: string;
                                            dataSource: string;
                                            action: string;
                                            groupField: string;
                                            sortField: string;
                                            params: {
                                                paginate: boolean;
                                                sort: string[];
                                            };
                                        };
                                        'x-toolbar': string;
                                        'x-settings': string;
                                        'x-component': string;
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
                                            ms2kyy843uc: {
                                                _isJSONSchemaObject: boolean;
                                                version: string;
                                                type: string;
                                                'x-component': string;
                                                'x-use-component-props': string;
                                                'x-app-version': string;
                                                properties: {
                                                    card: {
                                                        'x-uid': string;
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        'x-read-pretty': boolean;
                                                        'x-label-disabled': boolean;
                                                        'x-decorator': string;
                                                        'x-component': string;
                                                        'x-component-props': {
                                                            openMode: string;
                                                        };
                                                        'x-designer': string;
                                                        'x-app-version': string;
                                                        'x-action-context': {
                                                            dataSource: string;
                                                            collection: string;
                                                        };
                                                        properties: {
                                                            grid: {
                                                                _isJSONSchemaObject: boolean;
                                                                version: string;
                                                                type: string;
                                                                'x-component': string;
                                                                'x-component-props': {
                                                                    dndContext: boolean;
                                                                };
                                                                'x-app-version': string;
                                                                properties: {
                                                                    '8evl3dcvt86': {
                                                                        _isJSONSchemaObject: boolean;
                                                                        version: string;
                                                                        type: string;
                                                                        'x-component': string;
                                                                        properties: {
                                                                            '36yop5rgpyi': {
                                                                                _isJSONSchemaObject: boolean;
                                                                                version: string;
                                                                                type: string;
                                                                                'x-component': string;
                                                                                properties: {
                                                                                    select: {
                                                                                        _isJSONSchemaObject: boolean;
                                                                                        version: string;
                                                                                        type: string;
                                                                                        'x-toolbar': string;
                                                                                        'x-settings': string;
                                                                                        'x-component': string;
                                                                                        'x-decorator': string;
                                                                                        'x-collection-field': string;
                                                                                        'x-component-props': {
                                                                                            style: {
                                                                                                width: string;
                                                                                            };
                                                                                        };
                                                                                        'x-read-pretty': boolean;
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
                                                    cardViewer: {
                                                        _isJSONSchemaObject: boolean;
                                                        version: string;
                                                        type: string;
                                                        title: string;
                                                        'x-designer': string;
                                                        'x-component': string;
                                                        'x-action': string;
                                                        'x-component-props': {
                                                            openMode: string;
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
                                                                                        properties: {
                                                                                            '8bv7l5hiazu': {
                                                                                                _isJSONSchemaObject: boolean;
                                                                                                version: string;
                                                                                                type: string;
                                                                                                'x-component': string;
                                                                                                'x-app-version': string;
                                                                                                properties: {
                                                                                                    torszg5y5zd: {
                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                        version: string;
                                                                                                        type: string;
                                                                                                        'x-component': string;
                                                                                                        'x-app-version': string;
                                                                                                        properties: {
                                                                                                            d4p7lp86m03: {
                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                version: string;
                                                                                                                type: string;
                                                                                                                'x-acl-action': string;
                                                                                                                'x-decorator': string;
                                                                                                                'x-use-decorator-props': string;
                                                                                                                'x-decorator-props': {
                                                                                                                    dataSource: string;
                                                                                                                    collection: string;
                                                                                                                    readPretty: boolean;
                                                                                                                    action: string;
                                                                                                                };
                                                                                                                'x-toolbar': string;
                                                                                                                'x-settings': string;
                                                                                                                'x-component': string;
                                                                                                                'x-app-version': string;
                                                                                                                properties: {
                                                                                                                    '1oxl6q1ktkh': {
                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                        version: string;
                                                                                                                        type: string;
                                                                                                                        'x-component': string;
                                                                                                                        'x-read-pretty': boolean;
                                                                                                                        'x-use-component-props': string;
                                                                                                                        'x-app-version': string;
                                                                                                                        properties: {
                                                                                                                            r27t49cfoo5: {
                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                version: string;
                                                                                                                                type: string;
                                                                                                                                'x-initializer': string;
                                                                                                                                'x-component': string;
                                                                                                                                'x-component-props': {
                                                                                                                                    style: {
                                                                                                                                        marginBottom: number;
                                                                                                                                    };
                                                                                                                                };
                                                                                                                                'x-app-version': string;
                                                                                                                                properties: {
                                                                                                                                    uya6ulpeavl: {
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
                                                                                                                                            icon: string;
                                                                                                                                            type: string;
                                                                                                                                        };
                                                                                                                                        'x-action-context': {
                                                                                                                                            dataSource: string;
                                                                                                                                            collection: string;
                                                                                                                                        };
                                                                                                                                        'x-decorator': string;
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
                                                                                                                                                                        properties: {
                                                                                                                                                                            etzmlia85gh: {
                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                version: string;
                                                                                                                                                                                type: string;
                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                properties: {
                                                                                                                                                                                    '6dn14wki0e5': {
                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                        version: string;
                                                                                                                                                                                        type: string;
                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                        properties: {
                                                                                                                                                                                            cruqx5ulnow: {
                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                version: string;
                                                                                                                                                                                                type: string;
                                                                                                                                                                                                'x-acl-action-props': {
                                                                                                                                                                                                    skipScopeCheck: boolean;
                                                                                                                                                                                                };
                                                                                                                                                                                                'x-acl-action': string;
                                                                                                                                                                                                'x-decorator': string;
                                                                                                                                                                                                'x-use-decorator-props': string;
                                                                                                                                                                                                'x-decorator-props': {
                                                                                                                                                                                                    action: string;
                                                                                                                                                                                                    dataSource: string;
                                                                                                                                                                                                    collection: string;
                                                                                                                                                                                                };
                                                                                                                                                                                                'x-toolbar': string;
                                                                                                                                                                                                'x-settings': string;
                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                properties: {
                                                                                                                                                                                                    y0q5ei7mma2: {
                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                        'x-use-component-props': string;
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
                                                                                                                                                                                                                    rjbvqpp7xmu: {
                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                        'x-app-version': string;
                                                                                                                                                                                                                        properties: {
                                                                                                                                                                                                                            cxiykvzwfv1: {
                                                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                                version: string;
                                                                                                                                                                                                                                type: string;
                                                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                                                properties: {
                                                                                                                                                                                                                                    select: {
                                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                                        type: string;
                                                                                                                                                                                                                                        'x-toolbar': string;
                                                                                                                                                                                                                                        'x-settings': string;
                                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                                        'x-decorator': string;
                                                                                                                                                                                                                                        'x-collection-field': string;
                                                                                                                                                                                                                                        'x-component-props': {
                                                                                                                                                                                                                                            style: {
                                                                                                                                                                                                                                                width: string;
                                                                                                                                                                                                                                            };
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
                                                                                                                                                                                                            '5j12oi9pvf3': {
                                                                                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                version: string;
                                                                                                                                                                                                                type: string;
                                                                                                                                                                                                                'x-initializer': string;
                                                                                                                                                                                                                'x-component': string;
                                                                                                                                                                                                                'x-component-props': {
                                                                                                                                                                                                                    layout: string;
                                                                                                                                                                                                                };
                                                                                                                                                                                                                'x-app-version': string;
                                                                                                                                                                                                                properties: {
                                                                                                                                                                                                                    m9e7qxjys7o: {
                                                                                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                                                                                        version: string;
                                                                                                                                                                                                                        title: string;
                                                                                                                                                                                                                        'x-action': string;
                                                                                                                                                                                                                        'x-component': string;
                                                                                                                                                                                                                        'x-use-component-props': string;
                                                                                                                                                                                                                        'x-toolbar': string;
                                                                                                                                                                                                                        'x-settings': string;
                                                                                                                                                                                                                        'x-component-props': {
                                                                                                                                                                                                                            type: string;
                                                                                                                                                                                                                            htmlType: string;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        'x-action-settings': {
                                                                                                                                                                                                                            triggerWorkflows: any[];
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        type: string;
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
                                                                                                                                'x-uid': string;
                                                                                                                                'x-async': boolean;
                                                                                                                                'x-index': number;
                                                                                                                            };
                                                                                                                            grid: {
                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                version: string;
                                                                                                                                type: string;
                                                                                                                                'x-component': string;
                                                                                                                                'x-initializer': string;
                                                                                                                                'x-app-version': string;
                                                                                                                                properties: {
                                                                                                                                    cylu3xjywvu: {
                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                        version: string;
                                                                                                                                        type: string;
                                                                                                                                        'x-component': string;
                                                                                                                                        'x-app-version': string;
                                                                                                                                        properties: {
                                                                                                                                            z1eb85u2n4n: {
                                                                                                                                                _isJSONSchemaObject: boolean;
                                                                                                                                                version: string;
                                                                                                                                                type: string;
                                                                                                                                                'x-component': string;
                                                                                                                                                'x-app-version': string;
                                                                                                                                                properties: {
                                                                                                                                                    select: {
                                                                                                                                                        _isJSONSchemaObject: boolean;
                                                                                                                                                        version: string;
                                                                                                                                                        type: string;
                                                                                                                                                        'x-toolbar': string;
                                                                                                                                                        'x-settings': string;
                                                                                                                                                        'x-component': string;
                                                                                                                                                        'x-decorator': string;
                                                                                                                                                        'x-collection-field': string;
                                                                                                                                                        'x-component-props': {
                                                                                                                                                            style: {
                                                                                                                                                                width: string;
                                                                                                                                                            };
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
