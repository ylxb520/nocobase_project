/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
    _isJSONSchemaObject: boolean;
    version: string;
    type: string;
    'x-collection': string;
    'x-decorator': string;
    'x-decorator-props': {
        collection: string;
        dragSort: boolean;
        request: {
            resource: string;
            action: string;
            params: {
                pageSize: number;
                appends: any[];
                sort: string[];
                filter: {
                    $or: {
                        f_hpmvdltzs6m: {
                            $eq: string;
                        };
                    }[];
                };
            };
        };
    };
    'x-designer': string;
    'x-component': string;
    properties: {
        actions: {
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
            properties: {
                isbu85phv4w: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    'x-component': string;
                    'x-component-props': {
                        popover: boolean;
                    };
                    type: string;
                    title: string;
                    'x-action': string;
                    'x-align': string;
                    'x-designer': string;
                    properties: {
                        popover: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            type: string;
                            'x-decorator': string;
                            'x-decorator-props': {};
                            'x-component': string;
                            'x-component-props': {
                                trigger: string;
                                placement: string;
                            };
                            properties: {
                                filter: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    type: string;
                                    default: {
                                        $and: any[];
                                    };
                                    'x-component': string;
                                    'x-component-props': {
                                        useDataSource: string;
                                    };
                                    'x-uid': string;
                                    'x-async': boolean;
                                    'x-index': number;
                                };
                                footer: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    type: string;
                                    'x-component': string;
                                    properties: {
                                        actions: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            properties: {
                                                saveDefault: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-component-props': {};
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                    'x-index': number;
                                                };
                                                reset: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    title: string;
                                                    'x-component': string;
                                                    'x-component-props': {
                                                        useAction: string;
                                                    };
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                    'x-index': number;
                                                };
                                                submit: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    title: string;
                                                    'x-component': string;
                                                    'x-component-props': {
                                                        type: string;
                                                        useAction: string;
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
                gytwsh4j63z: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    title: string;
                    'x-action': string;
                    'x-component': string;
                    'x-designer': string;
                    'x-component-props': {
                        confirm: {
                            title: string;
                            content: string;
                        };
                        useAction: string;
                    };
                    type: string;
                    'x-uid': string;
                    'x-async': boolean;
                    'x-index': number;
                };
                wbb242cclcy: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    title: string;
                    'x-action': string;
                    'x-designer': string;
                    'x-component': string;
                    'x-component-props': {
                        type: string;
                        openMode: string;
                    };
                    properties: {
                        drawer: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            type: string;
                            title: string;
                            'x-component': string;
                            'x-component-props': {};
                            'x-decorator': string;
                            properties: {
                                grid: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    type: string;
                                    'x-component': string;
                                    'x-initializer': string;
                                    properties: {
                                        sjwib7sdug0: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            properties: {
                                                '3gxapv67xe7': {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        f_g8j5jvalqh0: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            required: boolean;
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
                                        dqffohruw16: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            properties: {
                                                '1jbcxo5ixfc': {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        f_tegyd222bcc: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                    };
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                    'x-index': number;
                                                };
                                                col_a10rjh4fjuk: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-index': number;
                                                    properties: {
                                                        f_ooar0pto2ko: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-component-props': {
                                                                mode: string;
                                                                fieldNames: {
                                                                    label: string;
                                                                    value: string;
                                                                };
                                                            };
                                                            properties: {
                                                                options: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    type: string;
                                                                    title: string;
                                                                    properties: {
                                                                        block: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-collection': string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                collection: string;
                                                                                request: {
                                                                                    resource: string;
                                                                                    action: string;
                                                                                    params: {
                                                                                        pageSize: number;
                                                                                        filter: {};
                                                                                        appends: any[];
                                                                                    };
                                                                                };
                                                                            };
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            properties: {
                                                                                table: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        rowKey: string;
                                                                                        objectValue: boolean;
                                                                                        rowSelection: {
                                                                                            type: string;
                                                                                        };
                                                                                        useDataSource: string;
                                                                                    };
                                                                                    'x-initializer': string;
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
                                                                item: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        drawer1: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                name: string;
                                                                            };
                                                                            'x-component': string;
                                                                            'x-component-props': {
                                                                                className: string;
                                                                            };
                                                                            type: string;
                                                                            title: string;
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
                                                };
                                            };
                                            'x-uid': string;
                                            'x-async': boolean;
                                            'x-index': number;
                                        };
                                        '34hycnw3car': {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            properties: {
                                                col_udhmczrizax: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-index': number;
                                                    properties: {
                                                        f_z27302tl2bf: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                    };
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                };
                                                col_9qlipaqkwdc: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-index': number;
                                                    properties: {
                                                        f_cht6rsiiiko: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            title: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                    };
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                };
                                            };
                                            'x-uid': string;
                                            'x-async': boolean;
                                            'x-index': number;
                                        };
                                        row_0rsawx3b7kj: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            'x-index': number;
                                            properties: {
                                                col_n49a866bnrr: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-index': number;
                                                    properties: {
                                                        f_ksgzy9vmgce: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-component-props': {
                                                                fieldNames: {
                                                                    label: string;
                                                                    value: string;
                                                                };
                                                            };
                                                            properties: {
                                                                options: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    type: string;
                                                                    title: string;
                                                                    properties: {
                                                                        block: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-collection': string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                collection: string;
                                                                                request: {
                                                                                    resource: string;
                                                                                    action: string;
                                                                                    params: {
                                                                                        pageSize: number;
                                                                                        filter: {};
                                                                                        appends: any[];
                                                                                    };
                                                                                };
                                                                            };
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            properties: {
                                                                                table: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        rowKey: string;
                                                                                        objectValue: boolean;
                                                                                        rowSelection: {
                                                                                            type: string;
                                                                                        };
                                                                                        useDataSource: string;
                                                                                    };
                                                                                    'x-initializer': string;
                                                                                    properties: {
                                                                                        gpysrsz6uw3: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-decorator': string;
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                f_zio9ewkxss7: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-read-pretty': boolean;
                                                                                                    'x-collection-field': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        ellipsis: boolean;
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
                                                                                        rwqed9xotrw: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-decorator': string;
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                f_ojboh2wxpju: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-read-pretty': boolean;
                                                                                                    'x-collection-field': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        ellipsis: boolean;
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
                                                                item: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        drawer1: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                name: string;
                                                                            };
                                                                            'x-component': string;
                                                                            'x-component-props': {
                                                                                className: string;
                                                                            };
                                                                            type: string;
                                                                            title: string;
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
                                                };
                                                i2x7embbyfi: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        f_u007sq2jg93: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-component-props': {
                                                                fieldNames: {
                                                                    label: string;
                                                                    value: string;
                                                                };
                                                            };
                                                            properties: {
                                                                options: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    type: string;
                                                                    title: string;
                                                                    properties: {
                                                                        block: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-collection': string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                collection: string;
                                                                                request: {
                                                                                    resource: string;
                                                                                    action: string;
                                                                                    params: {
                                                                                        pageSize: number;
                                                                                        filter: {};
                                                                                        appends: any[];
                                                                                    };
                                                                                };
                                                                            };
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            properties: {
                                                                                table: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        rowKey: string;
                                                                                        objectValue: boolean;
                                                                                        rowSelection: {
                                                                                            type: string;
                                                                                        };
                                                                                        useDataSource: string;
                                                                                    };
                                                                                    'x-initializer': string;
                                                                                    properties: {
                                                                                        ppttymwsr3d: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-decorator': string;
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                nickname: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-read-pretty': boolean;
                                                                                                    'x-collection-field': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {};
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
                                                                item: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        drawer1: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                name: string;
                                                                            };
                                                                            'x-component': string;
                                                                            'x-component-props': {
                                                                                className: string;
                                                                            };
                                                                            type: string;
                                                                            title: string;
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
                                        };
                                        row_n6hconqufuq: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            'x-index': number;
                                            properties: {
                                                col_iar1zhjpur7: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-index': number;
                                                    properties: {
                                                        f_yc8jbfiqfvh: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                    };
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                };
                                                col_k4je1g5zxha: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-index': number;
                                                    properties: {
                                                        f_hpmvdltzs6m: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                    };
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                };
                                            };
                                            'x-uid': string;
                                            'x-async': boolean;
                                        };
                                        row_nzinx0ogano: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            'x-index': number;
                                            properties: {
                                                dxaed68jtvf: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        f_47f2d9wgofm: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            'x-component-props': {
                                                                fieldNames: {
                                                                    label: string;
                                                                    value: string;
                                                                };
                                                            };
                                                            properties: {
                                                                options: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    type: string;
                                                                    title: string;
                                                                    properties: {
                                                                        block: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-collection': string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                collection: string;
                                                                                request: {
                                                                                    resource: string;
                                                                                    action: string;
                                                                                    params: {
                                                                                        pageSize: number;
                                                                                        filter: {};
                                                                                        appends: any[];
                                                                                    };
                                                                                };
                                                                            };
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            properties: {
                                                                                table: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        rowKey: string;
                                                                                        objectValue: boolean;
                                                                                        rowSelection: {
                                                                                            type: string;
                                                                                        };
                                                                                        useDataSource: string;
                                                                                    };
                                                                                    'x-initializer': string;
                                                                                    properties: {
                                                                                        xfyrokl5xzu: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-decorator': string;
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                f_g8j5jvalqh0: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-read-pretty': boolean;
                                                                                                    'x-collection-field': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        ellipsis: boolean;
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
                                                                item: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        drawer1: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-decorator': string;
                                                                            'x-decorator-props': {
                                                                                name: string;
                                                                            };
                                                                            'x-component': string;
                                                                            'x-component-props': {
                                                                                className: string;
                                                                            };
                                                                            type: string;
                                                                            title: string;
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
                                        };
                                        rqek1xc93bi: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            properties: {
                                                pfb8ib4u27c: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        f_jj9cyhron1d: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
                                                            properties: {
                                                                block: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-component-props': {
                                                                        collection: string;
                                                                        association: {
                                                                            collectionName: string;
                                                                            name: string;
                                                                            sourceKey: string;
                                                                            targetKey: string;
                                                                        };
                                                                    };
                                                                    properties: {
                                                                        actions: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-component': string;
                                                                            'x-component-props': {
                                                                                style: {
                                                                                    marginBottom: number;
                                                                                };
                                                                            };
                                                                            properties: {
                                                                                delete: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        useAction: string;
                                                                                        confirm: {
                                                                                            title: string;
                                                                                            content: string;
                                                                                        };
                                                                                    };
                                                                                    'x-uid': string;
                                                                                    'x-async': boolean;
                                                                                    'x-index': number;
                                                                                };
                                                                                create: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    'x-action': string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        type: string;
                                                                                        openMode: string;
                                                                                    };
                                                                                    properties: {
                                                                                        drawer: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            title: string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {};
                                                                                            'x-decorator': string;
                                                                                            properties: {
                                                                                                grid: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-component': string;
                                                                                                    'x-initializer': string;
                                                                                                    properties: {
                                                                                                        jxv7o65t1yx: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                '2kes8qsxrif': {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        f_m7ibo1vrvnm: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            'x-designer': string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-collection-field': string;
                                                                                                                            required: boolean;
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
                                                                                                        baujafikrdl: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                q3m6cj8vtsd: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        f_kukaw9kddyj: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            'x-designer': string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-collection-field': string;
                                                                                                                            'x-component-props': {
                                                                                                                                fieldNames: {
                                                                                                                                    label: string;
                                                                                                                                    value: string;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            properties: {
                                                                                                                                options: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    type: string;
                                                                                                                                    title: string;
                                                                                                                                    properties: {
                                                                                                                                        block: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-collection': string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-decorator-props': {
                                                                                                                                                collection: string;
                                                                                                                                                request: {
                                                                                                                                                    resource: string;
                                                                                                                                                    action: string;
                                                                                                                                                    params: {
                                                                                                                                                        pageSize: number;
                                                                                                                                                        filter: {};
                                                                                                                                                        appends: any[];
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                            };
                                                                                                                                            'x-designer': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                table: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        rowKey: string;
                                                                                                                                                        objectValue: boolean;
                                                                                                                                                        rowSelection: {
                                                                                                                                                            type: string;
                                                                                                                                                        };
                                                                                                                                                        useDataSource: string;
                                                                                                                                                    };
                                                                                                                                                    'x-initializer': string;
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
                                                                                                                                item: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        drawer1: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-decorator-props': {
                                                                                                                                                name: string;
                                                                                                                                            };
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-component-props': {
                                                                                                                                                className: string;
                                                                                                                                            };
                                                                                                                                            type: string;
                                                                                                                                            title: string;
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
                                                                                                        j2zrrumbgx7: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                lcah36xzimy: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        f_4mpiovytw4d: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            'x-designer': string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-collection-field': string;
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
                                                                                                        '4qh7q0vj6q9': {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                '1vkfl4t95um': {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        f_lxsum89wkzd: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            'x-designer': string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-collection-field': string;
                                                                                                                            'x-component-props': {
                                                                                                                                mode: string;
                                                                                                                                fieldNames: {
                                                                                                                                    label: string;
                                                                                                                                    value: string;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            properties: {
                                                                                                                                options: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    type: string;
                                                                                                                                    title: string;
                                                                                                                                    properties: {
                                                                                                                                        block: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-collection': string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-decorator-props': {
                                                                                                                                                collection: string;
                                                                                                                                                request: {
                                                                                                                                                    resource: string;
                                                                                                                                                    action: string;
                                                                                                                                                    params: {
                                                                                                                                                        pageSize: number;
                                                                                                                                                        filter: {};
                                                                                                                                                        appends: any[];
                                                                                                                                                    };
                                                                                                                                                };
                                                                                                                                            };
                                                                                                                                            'x-designer': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                table: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        rowKey: string;
                                                                                                                                                        objectValue: boolean;
                                                                                                                                                        rowSelection: {
                                                                                                                                                            type: string;
                                                                                                                                                        };
                                                                                                                                                        useDataSource: string;
                                                                                                                                                    };
                                                                                                                                                    'x-initializer': string;
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
                                                                                                                                item: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        drawer1: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-decorator-props': {
                                                                                                                                                name: string;
                                                                                                                                            };
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-component-props': {
                                                                                                                                                className: string;
                                                                                                                                            };
                                                                                                                                            type: string;
                                                                                                                                            title: string;
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
                                                                                                footer: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        actions: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {
                                                                                                                layout: string;
                                                                                                            };
                                                                                                            properties: {
                                                                                                                cancel: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    title: string;
                                                                                                                    'x-action': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        useAction: string;
                                                                                                                    };
                                                                                                                    'x-uid': string;
                                                                                                                    'x-async': boolean;
                                                                                                                    'x-index': number;
                                                                                                                };
                                                                                                                submit: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    title: string;
                                                                                                                    'x-action': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        type: string;
                                                                                                                        useAction: string;
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
                                                                        f_jj9cyhron1d: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            title: string;
                                                                            'x-component': string;
                                                                            'x-initializer': string;
                                                                            'x-component-props': {
                                                                                pagination: boolean;
                                                                                expandable: {
                                                                                    childrenColumnName: string;
                                                                                };
                                                                                rowSelection: {
                                                                                    type: string;
                                                                                };
                                                                                useSelectedRowKeys: string;
                                                                                useDataSource: string;
                                                                            };
                                                                            properties: {
                                                                                actions: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    'x-decorator': string;
                                                                                    'x-component': string;
                                                                                    'x-designer': string;
                                                                                    'x-initializer': string;
                                                                                    properties: {
                                                                                        actions: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-decorator': string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                split: string;
                                                                                            };
                                                                                            properties: {
                                                                                                '8hr6690k12m': {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    title: string;
                                                                                                    type: string;
                                                                                                    'x-action': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {};
                                                                                                    properties: {
                                                                                                        drawer: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            title: string;
                                                                                                            properties: {
                                                                                                                tabs: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {};
                                                                                                                    properties: {
                                                                                                                        tab1: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            title: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-component-props': {};
                                                                                                                            properties: {
                                                                                                                                grid: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-read-pretty': boolean;
                                                                                                                                    'x-item-initializer': string;
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
                                                                                                klytvy757ld: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    title: string;
                                                                                                    type: string;
                                                                                                    'x-action': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {};
                                                                                                    properties: {
                                                                                                        drawer: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-decorator-props': {
                                                                                                                useValues: string;
                                                                                                            };
                                                                                                            'x-component': string;
                                                                                                            title: string;
                                                                                                            properties: {
                                                                                                                grid: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-initializer': string;
                                                                                                                    'x-uid': string;
                                                                                                                    'x-async': boolean;
                                                                                                                    'x-index': number;
                                                                                                                };
                                                                                                                footer: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        actions: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-component-props': {
                                                                                                                                layout: string;
                                                                                                                            };
                                                                                                                            properties: {
                                                                                                                                cancel: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-action': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        useAction: string;
                                                                                                                                    };
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                                submit: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-action': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        type: string;
                                                                                                                                        useAction: string;
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
                                                                                tlz1x8jbzbo: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    'x-decorator': string;
                                                                                    'x-designer': string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        f_m7ibo1vrvnm: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-read-pretty': boolean;
                                                                                            'x-collection-field': string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {};
                                                                                            'x-uid': string;
                                                                                            'x-async': boolean;
                                                                                            'x-index': number;
                                                                                        };
                                                                                    };
                                                                                    'x-uid': string;
                                                                                    'x-async': boolean;
                                                                                    'x-index': number;
                                                                                };
                                                                                erx3j87t4fe: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    'x-decorator': string;
                                                                                    'x-designer': string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        f_kukaw9kddyj: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-read-pretty': boolean;
                                                                                            'x-collection-field': string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                mode: string;
                                                                                                fieldNames: {
                                                                                                    label: string;
                                                                                                    value: string;
                                                                                                };
                                                                                            };
                                                                                            properties: {
                                                                                                options: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    type: string;
                                                                                                    title: string;
                                                                                                    properties: {
                                                                                                        block: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-collection': string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-decorator-props': {
                                                                                                                collection: string;
                                                                                                                request: {
                                                                                                                    resource: string;
                                                                                                                    action: string;
                                                                                                                    params: {
                                                                                                                        pageSize: number;
                                                                                                                        filter: {};
                                                                                                                        appends: any[];
                                                                                                                    };
                                                                                                                };
                                                                                                            };
                                                                                                            'x-designer': string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                table: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        rowKey: string;
                                                                                                                        objectValue: boolean;
                                                                                                                        rowSelection: {
                                                                                                                            type: string;
                                                                                                                        };
                                                                                                                        useDataSource: string;
                                                                                                                    };
                                                                                                                    'x-initializer': string;
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
                                                                                                item: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        drawer1: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-decorator-props': {
                                                                                                                name: string;
                                                                                                            };
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {
                                                                                                                className: string;
                                                                                                            };
                                                                                                            type: string;
                                                                                                            title: string;
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
                                                                                '7xa1l99d4zu': {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    'x-decorator': string;
                                                                                    'x-designer': string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        f_4mpiovytw4d: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-read-pretty': boolean;
                                                                                            'x-collection-field': string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {};
                                                                                            'x-uid': string;
                                                                                            'x-async': boolean;
                                                                                            'x-index': number;
                                                                                        };
                                                                                    };
                                                                                    'x-uid': string;
                                                                                    'x-async': boolean;
                                                                                    'x-index': number;
                                                                                };
                                                                                c9yfgt81i08: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    'x-decorator': string;
                                                                                    'x-designer': string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        f_lxsum89wkzd: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-read-pretty': boolean;
                                                                                            'x-collection-field': string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                mode: string;
                                                                                                fieldNames: {
                                                                                                    label: string;
                                                                                                    value: string;
                                                                                                };
                                                                                            };
                                                                                            properties: {
                                                                                                options: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    type: string;
                                                                                                    title: string;
                                                                                                    properties: {
                                                                                                        block: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-collection': string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-decorator-props': {
                                                                                                                collection: string;
                                                                                                                request: {
                                                                                                                    resource: string;
                                                                                                                    action: string;
                                                                                                                    params: {
                                                                                                                        pageSize: number;
                                                                                                                        filter: {};
                                                                                                                        appends: any[];
                                                                                                                    };
                                                                                                                };
                                                                                                            };
                                                                                                            'x-designer': string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                table: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        rowKey: string;
                                                                                                                        objectValue: boolean;
                                                                                                                        rowSelection: {
                                                                                                                            type: string;
                                                                                                                        };
                                                                                                                        useDataSource: string;
                                                                                                                    };
                                                                                                                    'x-initializer': string;
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
                                                                                                item: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        drawer1: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-decorator-props': {
                                                                                                                name: string;
                                                                                                            };
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {
                                                                                                                className: string;
                                                                                                            };
                                                                                                            type: string;
                                                                                                            title: string;
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
                                        row_irfj5lt3j19: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-component': string;
                                            'x-index': number;
                                            properties: {
                                                '82ajtplhy7l': {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        f_bwf3d9caoj6: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            'x-designer': string;
                                                            'x-component': string;
                                                            'x-decorator': string;
                                                            'x-collection-field': string;
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
                                        };
                                    };
                                    'x-uid': string;
                                    'x-async': boolean;
                                    'x-index': number;
                                };
                                footer: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    type: string;
                                    'x-component': string;
                                    properties: {
                                        actions: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-initializer': string;
                                            'x-decorator': string;
                                            'x-component': string;
                                            'x-component-props': {
                                                layout: string;
                                            };
                                            properties: {
                                                j1ixqn2h3l9: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    title: string;
                                                    'x-action': string;
                                                    'x-component': string;
                                                    'x-designer': string;
                                                    'x-component-props': {
                                                        useAction: string;
                                                    };
                                                    type: string;
                                                    'x-uid': string;
                                                    'x-async': boolean;
                                                    'x-index': number;
                                                };
                                                '6k91ad0u0v9': {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    title: string;
                                                    'x-action': string;
                                                    'x-component': string;
                                                    'x-designer': string;
                                                    'x-component-props': {
                                                        type: string;
                                                        useAction: string;
                                                    };
                                                    type: string;
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
        table: {
            _isJSONSchemaObject: boolean;
            version: string;
            type: string;
            'x-component': string;
            'x-component-props': {
                rowKey: string;
                rowSelection: {
                    type: string;
                };
                useAction: string;
                useDataSource: string;
            };
            'x-initializer': string;
            properties: {
                actions: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    title: string;
                    'x-decorator': string;
                    'x-component': string;
                    'x-designer': string;
                    'x-initializer': string;
                    properties: {
                        actions: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            type: string;
                            'x-decorator': string;
                            'x-component': string;
                            'x-component-props': {
                                split: string;
                            };
                            properties: {
                                rmknij6wfz2: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    title: string;
                                    type: string;
                                    'x-action': string;
                                    'x-designer': string;
                                    'x-component': string;
                                    'x-component-props': {
                                        openMode: string;
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
                                                                        mcadrj0ivmq: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-component': string;
                                                                            properties: {
                                                                                i27ow3g3ukd: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        '05gn9zkb0bt': {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                collection: string;
                                                                                                request: {
                                                                                                    resource: string;
                                                                                                    action: string;
                                                                                                    params: {};
                                                                                                };
                                                                                            };
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                form: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-decorator': string;
                                                                                                    'x-decorator-props': {
                                                                                                        useValues: string;
                                                                                                    };
                                                                                                    properties: {
                                                                                                        actions: {
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
                                                                                                            'x-uid': string;
                                                                                                            'x-async': boolean;
                                                                                                            'x-index': number;
                                                                                                        };
                                                                                                        grid: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-component': string;
                                                                                                            'x-read-pretty': boolean;
                                                                                                            'x-initializer': string;
                                                                                                            properties: {
                                                                                                                '63f1384fq5m': {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        cufqlfkrax8: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                f_g8j5jvalqh0: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
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
                                                                                                                row_rjf95na375k: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-index': number;
                                                                                                                    properties: {
                                                                                                                        '7t22azumef3': {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                f_tegyd222bcc: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            'x-uid': string;
                                                                                                                            'x-async': boolean;
                                                                                                                            'x-index': number;
                                                                                                                        };
                                                                                                                        col_jsjthsgwyuw: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-index': number;
                                                                                                                            properties: {
                                                                                                                                f_ooar0pto2ko: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        mode: string;
                                                                                                                                        fieldNames: {
                                                                                                                                            label: string;
                                                                                                                                            value: string;
                                                                                                                                        };
                                                                                                                                    };
                                                                                                                                    properties: {
                                                                                                                                        options: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            type: string;
                                                                                                                                            title: string;
                                                                                                                                            properties: {
                                                                                                                                                block: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-collection': string;
                                                                                                                                                    'x-decorator': string;
                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                        collection: string;
                                                                                                                                                        request: {
                                                                                                                                                            resource: string;
                                                                                                                                                            action: string;
                                                                                                                                                            params: {
                                                                                                                                                                pageSize: number;
                                                                                                                                                                filter: {};
                                                                                                                                                                appends: any[];
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                    };
                                                                                                                                                    'x-designer': string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        table: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                rowKey: string;
                                                                                                                                                                objectValue: boolean;
                                                                                                                                                                rowSelection: {
                                                                                                                                                                    type: string;
                                                                                                                                                                };
                                                                                                                                                                useDataSource: string;
                                                                                                                                                            };
                                                                                                                                                            'x-initializer': string;
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
                                                                                                                                        item: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                drawer1: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-decorator': string;
                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                        name: string;
                                                                                                                                                    };
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        className: string;
                                                                                                                                                    };
                                                                                                                                                    type: string;
                                                                                                                                                    title: string;
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
                                                                                                                        };
                                                                                                                    };
                                                                                                                    'x-uid': string;
                                                                                                                    'x-async': boolean;
                                                                                                                };
                                                                                                                row_5obitmk0s28: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-index': number;
                                                                                                                    properties: {
                                                                                                                        col_bq53unjhh9n: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-index': number;
                                                                                                                            properties: {
                                                                                                                                f_z27302tl2bf: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            'x-uid': string;
                                                                                                                            'x-async': boolean;
                                                                                                                        };
                                                                                                                        col_y81gfkj7apo: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-index': number;
                                                                                                                            properties: {
                                                                                                                                f_cht6rsiiiko: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            'x-uid': string;
                                                                                                                            'x-async': boolean;
                                                                                                                        };
                                                                                                                    };
                                                                                                                    'x-uid': string;
                                                                                                                    'x-async': boolean;
                                                                                                                };
                                                                                                                row_7mwvro4heg3: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-index': number;
                                                                                                                    properties: {
                                                                                                                        col_w5lm00ata8v: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-index': number;
                                                                                                                            properties: {
                                                                                                                                f_ksgzy9vmgce: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        fieldNames: {
                                                                                                                                            label: string;
                                                                                                                                            value: string;
                                                                                                                                        };
                                                                                                                                    };
                                                                                                                                    properties: {
                                                                                                                                        options: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            type: string;
                                                                                                                                            title: string;
                                                                                                                                            properties: {
                                                                                                                                                block: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-collection': string;
                                                                                                                                                    'x-decorator': string;
                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                        collection: string;
                                                                                                                                                        request: {
                                                                                                                                                            resource: string;
                                                                                                                                                            action: string;
                                                                                                                                                            params: {
                                                                                                                                                                pageSize: number;
                                                                                                                                                                filter: {};
                                                                                                                                                                appends: any[];
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                    };
                                                                                                                                                    'x-designer': string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        table: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                rowKey: string;
                                                                                                                                                                objectValue: boolean;
                                                                                                                                                                rowSelection: {
                                                                                                                                                                    type: string;
                                                                                                                                                                };
                                                                                                                                                                useDataSource: string;
                                                                                                                                                            };
                                                                                                                                                            'x-initializer': string;
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
                                                                                                                                        item: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                drawer1: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-decorator': string;
                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                        name: string;
                                                                                                                                                    };
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        className: string;
                                                                                                                                                    };
                                                                                                                                                    type: string;
                                                                                                                                                    title: string;
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
                                                                                                                        };
                                                                                                                        col_da8c3mdq79u: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-index': number;
                                                                                                                            properties: {
                                                                                                                                f_u007sq2jg93: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        fieldNames: {
                                                                                                                                            label: string;
                                                                                                                                            value: string;
                                                                                                                                        };
                                                                                                                                    };
                                                                                                                                    properties: {
                                                                                                                                        options: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            type: string;
                                                                                                                                            title: string;
                                                                                                                                            properties: {
                                                                                                                                                block: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-collection': string;
                                                                                                                                                    'x-decorator': string;
                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                        collection: string;
                                                                                                                                                        request: {
                                                                                                                                                            resource: string;
                                                                                                                                                            action: string;
                                                                                                                                                            params: {
                                                                                                                                                                pageSize: number;
                                                                                                                                                                filter: {};
                                                                                                                                                                appends: any[];
                                                                                                                                                            };
                                                                                                                                                        };
                                                                                                                                                    };
                                                                                                                                                    'x-designer': string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        table: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                rowKey: string;
                                                                                                                                                                objectValue: boolean;
                                                                                                                                                                rowSelection: {
                                                                                                                                                                    type: string;
                                                                                                                                                                };
                                                                                                                                                                useDataSource: string;
                                                                                                                                                            };
                                                                                                                                                            'x-initializer': string;
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
                                                                                                                                        item: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                drawer1: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-decorator': string;
                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                        name: string;
                                                                                                                                                    };
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        className: string;
                                                                                                                                                    };
                                                                                                                                                    type: string;
                                                                                                                                                    title: string;
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
                                                                                                                        };
                                                                                                                    };
                                                                                                                    'x-uid': string;
                                                                                                                    'x-async': boolean;
                                                                                                                };
                                                                                                                row_l0d7ewamrk4: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-index': number;
                                                                                                                    properties: {
                                                                                                                        ri7igv40aw9: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                f_yc8jbfiqfvh: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            'x-uid': string;
                                                                                                                            'x-async': boolean;
                                                                                                                            'x-index': number;
                                                                                                                        };
                                                                                                                        col_xav1170vdwy: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-index': number;
                                                                                                                            properties: {
                                                                                                                                f_hpmvdltzs6m: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                            };
                                                                                                                            'x-uid': string;
                                                                                                                            'x-async': boolean;
                                                                                                                        };
                                                                                                                    };
                                                                                                                    'x-uid': string;
                                                                                                                    'x-async': boolean;
                                                                                                                };
                                                                                                                lgzar02d5j6: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        o5zzcu27i23: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                f_jj9cyhron1d: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
                                                                                                                                    properties: {
                                                                                                                                        block: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-component-props': {
                                                                                                                                                collection: string;
                                                                                                                                                association: {
                                                                                                                                                    collectionName: string;
                                                                                                                                                    name: string;
                                                                                                                                                    sourceKey: string;
                                                                                                                                                    targetKey: string;
                                                                                                                                                };
                                                                                                                                            };
                                                                                                                                            properties: {
                                                                                                                                                actions: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        style: {
                                                                                                                                                            marginBottom: number;
                                                                                                                                                        };
                                                                                                                                                    };
                                                                                                                                                    properties: {
                                                                                                                                                        delete: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            title: string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                useAction: string;
                                                                                                                                                                confirm: {
                                                                                                                                                                    title: string;
                                                                                                                                                                    content: string;
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            'x-uid': string;
                                                                                                                                                            'x-async': boolean;
                                                                                                                                                            'x-index': number;
                                                                                                                                                        };
                                                                                                                                                        create: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            title: string;
                                                                                                                                                            'x-action': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                type: string;
                                                                                                                                                                openMode: string;
                                                                                                                                                            };
                                                                                                                                                            properties: {
                                                                                                                                                                drawer: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    title: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {};
                                                                                                                                                                    'x-decorator': string;
                                                                                                                                                                    properties: {
                                                                                                                                                                        grid: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            type: string;
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            'x-initializer': string;
                                                                                                                                                                            'x-uid': string;
                                                                                                                                                                            'x-async': boolean;
                                                                                                                                                                            'x-index': number;
                                                                                                                                                                        };
                                                                                                                                                                        footer: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            type: string;
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            properties: {
                                                                                                                                                                                actions: {
                                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                                    version: string;
                                                                                                                                                                                    type: string;
                                                                                                                                                                                    'x-component': string;
                                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                                        layout: string;
                                                                                                                                                                                    };
                                                                                                                                                                                    properties: {
                                                                                                                                                                                        cancel: {
                                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                                            version: string;
                                                                                                                                                                                            title: string;
                                                                                                                                                                                            'x-action': string;
                                                                                                                                                                                            'x-component': string;
                                                                                                                                                                                            'x-component-props': {
                                                                                                                                                                                                useAction: string;
                                                                                                                                                                                            };
                                                                                                                                                                                            'x-uid': string;
                                                                                                                                                                                            'x-async': boolean;
                                                                                                                                                                                            'x-index': number;
                                                                                                                                                                                        };
                                                                                                                                                                                        submit: {
                                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                                            version: string;
                                                                                                                                                                                            title: string;
                                                                                                                                                                                            'x-action': string;
                                                                                                                                                                                            'x-component': string;
                                                                                                                                                                                            'x-component-props': {
                                                                                                                                                                                                type: string;
                                                                                                                                                                                                useAction: string;
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
                                                                                                                                                f_jj9cyhron1d: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    title: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-initializer': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        pagination: boolean;
                                                                                                                                                        expandable: {
                                                                                                                                                            childrenColumnName: string;
                                                                                                                                                        };
                                                                                                                                                        rowSelection: {
                                                                                                                                                            type: string;
                                                                                                                                                        };
                                                                                                                                                        useSelectedRowKeys: string;
                                                                                                                                                        useDataSource: string;
                                                                                                                                                    };
                                                                                                                                                    properties: {
                                                                                                                                                        actions: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            title: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-initializer': string;
                                                                                                                                                            properties: {
                                                                                                                                                                actions: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    'x-decorator': string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                        split: string;
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
                                                                                                                                                        '21wayhqcr6s': {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            properties: {
                                                                                                                                                                f_m7ibo1vrvnm: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-read-pretty': boolean;
                                                                                                                                                                    'x-collection-field': string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {};
                                                                                                                                                                    'x-uid': string;
                                                                                                                                                                    'x-async': boolean;
                                                                                                                                                                    'x-index': number;
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            'x-uid': string;
                                                                                                                                                            'x-async': boolean;
                                                                                                                                                            'x-index': number;
                                                                                                                                                        };
                                                                                                                                                        xhtov2ldmk9: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            properties: {
                                                                                                                                                                f_kukaw9kddyj: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-read-pretty': boolean;
                                                                                                                                                                    'x-collection-field': string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                        mode: string;
                                                                                                                                                                        fieldNames: {
                                                                                                                                                                            label: string;
                                                                                                                                                                            value: string;
                                                                                                                                                                        };
                                                                                                                                                                    };
                                                                                                                                                                    properties: {
                                                                                                                                                                        options: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            type: string;
                                                                                                                                                                            title: string;
                                                                                                                                                                            properties: {
                                                                                                                                                                                block: {
                                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                                    version: string;
                                                                                                                                                                                    type: string;
                                                                                                                                                                                    'x-collection': string;
                                                                                                                                                                                    'x-decorator': string;
                                                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                                                        collection: string;
                                                                                                                                                                                        request: {
                                                                                                                                                                                            resource: string;
                                                                                                                                                                                            action: string;
                                                                                                                                                                                            params: {
                                                                                                                                                                                                pageSize: number;
                                                                                                                                                                                                filter: {};
                                                                                                                                                                                                appends: any[];
                                                                                                                                                                                            };
                                                                                                                                                                                        };
                                                                                                                                                                                    };
                                                                                                                                                                                    'x-designer': string;
                                                                                                                                                                                    'x-component': string;
                                                                                                                                                                                    properties: {
                                                                                                                                                                                        table: {
                                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                                            version: string;
                                                                                                                                                                                            'x-component': string;
                                                                                                                                                                                            'x-component-props': {
                                                                                                                                                                                                rowKey: string;
                                                                                                                                                                                                objectValue: boolean;
                                                                                                                                                                                                rowSelection: {
                                                                                                                                                                                                    type: string;
                                                                                                                                                                                                };
                                                                                                                                                                                                useDataSource: string;
                                                                                                                                                                                            };
                                                                                                                                                                                            'x-initializer': string;
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
                                                                                                                                                                        item: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            properties: {
                                                                                                                                                                                drawer1: {
                                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                                    version: string;
                                                                                                                                                                                    'x-decorator': string;
                                                                                                                                                                                    'x-decorator-props': {
                                                                                                                                                                                        name: string;
                                                                                                                                                                                    };
                                                                                                                                                                                    'x-component': string;
                                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                                        className: string;
                                                                                                                                                                                    };
                                                                                                                                                                                    type: string;
                                                                                                                                                                                    title: string;
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
                                                                                                                                                        o62wxmx9srp: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            properties: {
                                                                                                                                                                f_4mpiovytw4d: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-read-pretty': boolean;
                                                                                                                                                                    'x-collection-field': string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {};
                                                                                                                                                                    'x-uid': string;
                                                                                                                                                                    'x-async': boolean;
                                                                                                                                                                    'x-index': number;
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            'x-uid': string;
                                                                                                                                                            'x-async': boolean;
                                                                                                                                                            'x-index': number;
                                                                                                                                                        };
                                                                                                                                                        yzrjoq60t2z: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            properties: {
                                                                                                                                                                f_lxsum89wkzd: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-read-pretty': boolean;
                                                                                                                                                                    'x-collection-field': string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                        size: string;
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
                                                                                                                row_teea1c2pinj: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-index': number;
                                                                                                                    properties: {
                                                                                                                        bik69enqpjs: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                f_bwf3d9caoj6: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-designer': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-decorator': string;
                                                                                                                                    'x-collection-field': string;
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
                                caf9h9ddkbc: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    title: string;
                                    type: string;
                                    'x-action': string;
                                    'x-designer': string;
                                    'x-component': string;
                                    'x-component-props': {
                                        openMode: string;
                                    };
                                    properties: {
                                        drawer: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-decorator': string;
                                            'x-decorator-props': {
                                                useValues: string;
                                            };
                                            'x-component': string;
                                            title: string;
                                            properties: {
                                                grid: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    'x-initializer': string;
                                                    properties: {
                                                        kwkuoziqi77: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            properties: {
                                                                zzcgianiivw: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        f_g8j5jvalqh0: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            required: boolean;
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
                                                        qb9mtsxqgkd: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            properties: {
                                                                ppdm2zkcuoq: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        f_tegyd222bcc: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-uid': string;
                                                                            'x-async': boolean;
                                                                            'x-index': number;
                                                                        };
                                                                    };
                                                                    'x-uid': string;
                                                                    'x-async': boolean;
                                                                    'x-index': number;
                                                                };
                                                                col_ssc5awxb5dm: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-index': number;
                                                                    properties: {
                                                                        f_ooar0pto2ko: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-component-props': {
                                                                                mode: string;
                                                                                fieldNames: {
                                                                                    label: string;
                                                                                    value: string;
                                                                                };
                                                                            };
                                                                            required: boolean;
                                                                            properties: {
                                                                                options: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    properties: {
                                                                                        block: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-collection': string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                collection: string;
                                                                                                request: {
                                                                                                    resource: string;
                                                                                                    action: string;
                                                                                                    params: {
                                                                                                        pageSize: number;
                                                                                                        filter: {};
                                                                                                        appends: any[];
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                table: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        rowKey: string;
                                                                                                        objectValue: boolean;
                                                                                                        rowSelection: {
                                                                                                            type: string;
                                                                                                        };
                                                                                                        useDataSource: string;
                                                                                                    };
                                                                                                    'x-initializer': string;
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
                                                                                item: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        drawer1: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                name: string;
                                                                                            };
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                className: string;
                                                                                            };
                                                                                            type: string;
                                                                                            title: string;
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
                                                                };
                                                            };
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                        uwx0vhgmvwx: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            properties: {
                                                                col_eioxpwpgmc7: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-index': number;
                                                                    properties: {
                                                                        f_z27302tl2bf: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            required: boolean;
                                                                            'x-uid': string;
                                                                            'x-async': boolean;
                                                                            'x-index': number;
                                                                        };
                                                                    };
                                                                    'x-uid': string;
                                                                    'x-async': boolean;
                                                                };
                                                                col_min1xdw2bd5: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-index': number;
                                                                    properties: {
                                                                        f_cht6rsiiiko: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            title: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-uid': string;
                                                                            'x-async': boolean;
                                                                            'x-index': number;
                                                                        };
                                                                    };
                                                                    'x-uid': string;
                                                                    'x-async': boolean;
                                                                };
                                                            };
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                        '4yrxpeztr71': {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            properties: {
                                                                col_pgnnr4f8dfj: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-index': number;
                                                                    properties: {
                                                                        f_ksgzy9vmgce: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-component-props': {
                                                                                fieldNames: {
                                                                                    label: string;
                                                                                    value: string;
                                                                                };
                                                                            };
                                                                            properties: {
                                                                                options: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    properties: {
                                                                                        block: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-collection': string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                collection: string;
                                                                                                request: {
                                                                                                    resource: string;
                                                                                                    action: string;
                                                                                                    params: {
                                                                                                        pageSize: number;
                                                                                                        filter: {};
                                                                                                        appends: any[];
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                table: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        rowKey: string;
                                                                                                        objectValue: boolean;
                                                                                                        rowSelection: {
                                                                                                            type: string;
                                                                                                        };
                                                                                                        useDataSource: string;
                                                                                                    };
                                                                                                    'x-initializer': string;
                                                                                                    properties: {
                                                                                                        cj30vjztnkq: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-designer': string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                f_zio9ewkxss7: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-read-pretty': boolean;
                                                                                                                    'x-collection-field': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        ellipsis: boolean;
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
                                                                                                        gct1npfyqpy: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-designer': string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                f_ojboh2wxpju: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-read-pretty': boolean;
                                                                                                                    'x-collection-field': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        ellipsis: boolean;
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
                                                                                item: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        drawer1: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                name: string;
                                                                                            };
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                className: string;
                                                                                            };
                                                                                            type: string;
                                                                                            title: string;
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
                                                                };
                                                                col_1colstj9xtp: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-index': number;
                                                                    properties: {
                                                                        f_u007sq2jg93: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-component-props': {
                                                                                fieldNames: {
                                                                                    label: string;
                                                                                    value: string;
                                                                                };
                                                                            };
                                                                            properties: {
                                                                                options: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    properties: {
                                                                                        block: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-collection': string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                collection: string;
                                                                                                request: {
                                                                                                    resource: string;
                                                                                                    action: string;
                                                                                                    params: {
                                                                                                        pageSize: number;
                                                                                                        filter: {};
                                                                                                        appends: any[];
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                table: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        rowKey: string;
                                                                                                        objectValue: boolean;
                                                                                                        rowSelection: {
                                                                                                            type: string;
                                                                                                        };
                                                                                                        useDataSource: string;
                                                                                                    };
                                                                                                    'x-initializer': string;
                                                                                                    properties: {
                                                                                                        dvv0tf3p4o9: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-designer': string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                nickname: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-read-pretty': boolean;
                                                                                                                    'x-collection-field': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        ellipsis: boolean;
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
                                                                                item: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        drawer1: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                name: string;
                                                                                            };
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                className: string;
                                                                                            };
                                                                                            type: string;
                                                                                            title: string;
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
                                                                };
                                                            };
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                            'x-index': number;
                                                        };
                                                        row_vrsgzqb6wtt: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            'x-index': number;
                                                            properties: {
                                                                '5fp561h1z83': {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        f_yc8jbfiqfvh: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-uid': string;
                                                                            'x-async': boolean;
                                                                            'x-index': number;
                                                                        };
                                                                    };
                                                                    'x-uid': string;
                                                                    'x-async': boolean;
                                                                    'x-index': number;
                                                                };
                                                                col_zvfj9cqatvg: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    'x-index': number;
                                                                    properties: {
                                                                        f_hpmvdltzs6m: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-uid': string;
                                                                            'x-async': boolean;
                                                                            'x-index': number;
                                                                        };
                                                                    };
                                                                    'x-uid': string;
                                                                    'x-async': boolean;
                                                                };
                                                            };
                                                            'x-uid': string;
                                                            'x-async': boolean;
                                                        };
                                                        row_21424xej88l: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            'x-index': number;
                                                            properties: {
                                                                sktdv49s8hm: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        f_47f2d9wgofm: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            'x-component-props': {
                                                                                fieldNames: {
                                                                                    label: string;
                                                                                    value: string;
                                                                                };
                                                                            };
                                                                            properties: {
                                                                                options: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    type: string;
                                                                                    title: string;
                                                                                    properties: {
                                                                                        block: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-collection': string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                collection: string;
                                                                                                request: {
                                                                                                    resource: string;
                                                                                                    action: string;
                                                                                                    params: {
                                                                                                        pageSize: number;
                                                                                                        filter: {};
                                                                                                        appends: any[];
                                                                                                    };
                                                                                                };
                                                                                            };
                                                                                            'x-designer': string;
                                                                                            'x-component': string;
                                                                                            properties: {
                                                                                                table: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        rowKey: string;
                                                                                                        objectValue: boolean;
                                                                                                        rowSelection: {
                                                                                                            type: string;
                                                                                                        };
                                                                                                        useDataSource: string;
                                                                                                    };
                                                                                                    'x-initializer': string;
                                                                                                    properties: {
                                                                                                        dncah8wtscx: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-designer': string;
                                                                                                            'x-component': string;
                                                                                                            properties: {
                                                                                                                f_g8j5jvalqh0: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-read-pretty': boolean;
                                                                                                                    'x-collection-field': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {
                                                                                                                        ellipsis: boolean;
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
                                                                                item: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    'x-component': string;
                                                                                    properties: {
                                                                                        drawer1: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            'x-decorator': string;
                                                                                            'x-decorator-props': {
                                                                                                name: string;
                                                                                            };
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                className: string;
                                                                                            };
                                                                                            type: string;
                                                                                            title: string;
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
                                                        };
                                                        a1ju4grjnlw: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            properties: {
                                                                yekwc0cliyq: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        f_jj9cyhron1d: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            type: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
                                                                            properties: {
                                                                                block: {
                                                                                    _isJSONSchemaObject: boolean;
                                                                                    version: string;
                                                                                    type: string;
                                                                                    'x-component': string;
                                                                                    'x-component-props': {
                                                                                        collection: string;
                                                                                        association: {
                                                                                            collectionName: string;
                                                                                            name: string;
                                                                                            sourceKey: string;
                                                                                            targetKey: string;
                                                                                        };
                                                                                    };
                                                                                    properties: {
                                                                                        actions: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            'x-component': string;
                                                                                            'x-component-props': {
                                                                                                style: {
                                                                                                    marginBottom: number;
                                                                                                };
                                                                                            };
                                                                                            properties: {
                                                                                                delete: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    title: string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        useAction: string;
                                                                                                        confirm: {
                                                                                                            title: string;
                                                                                                            content: string;
                                                                                                        };
                                                                                                    };
                                                                                                    'x-uid': string;
                                                                                                    'x-async': boolean;
                                                                                                    'x-index': number;
                                                                                                };
                                                                                                create: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    title: string;
                                                                                                    'x-action': string;
                                                                                                    'x-component': string;
                                                                                                    'x-component-props': {
                                                                                                        type: string;
                                                                                                        openMode: string;
                                                                                                    };
                                                                                                    properties: {
                                                                                                        drawer: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            title: string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {};
                                                                                                            'x-decorator': string;
                                                                                                            properties: {
                                                                                                                grid: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-initializer': string;
                                                                                                                    properties: {
                                                                                                                        '8qclzttzelf': {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                pk0qp4hn2vn: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        f_m7ibo1vrvnm: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-designer': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-collection-field': string;
                                                                                                                                            required: boolean;
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
                                                                                                                        px4ykkps9hp: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                radqywecqyn: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        f_kukaw9kddyj: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-designer': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-collection-field': string;
                                                                                                                                            'x-component-props': {
                                                                                                                                                mode: string;
                                                                                                                                                fieldNames: {
                                                                                                                                                    label: string;
                                                                                                                                                    value: string;
                                                                                                                                                };
                                                                                                                                            };
                                                                                                                                            properties: {
                                                                                                                                                options: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    type: string;
                                                                                                                                                    title: string;
                                                                                                                                                    properties: {
                                                                                                                                                        block: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            'x-collection': string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                collection: string;
                                                                                                                                                                request: {
                                                                                                                                                                    resource: string;
                                                                                                                                                                    action: string;
                                                                                                                                                                    params: {
                                                                                                                                                                        pageSize: number;
                                                                                                                                                                        filter: {};
                                                                                                                                                                        appends: any[];
                                                                                                                                                                    };
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            properties: {
                                                                                                                                                                table: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                        rowKey: string;
                                                                                                                                                                        objectValue: boolean;
                                                                                                                                                                        rowSelection: {
                                                                                                                                                                            type: string;
                                                                                                                                                                        };
                                                                                                                                                                        useDataSource: string;
                                                                                                                                                                    };
                                                                                                                                                                    'x-initializer': string;
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
                                                                                                                                                item: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        drawer1: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                name: string;
                                                                                                                                                            };
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                className: string;
                                                                                                                                                            };
                                                                                                                                                            type: string;
                                                                                                                                                            title: string;
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
                                                                                                                        '8fhtawbcvdo': {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                '2k6azu4kyin': {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        f_4mpiovytw4d: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-designer': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-collection-field': string;
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
                                                                                                                        sy7jttnleap: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                hqbgstxx40n: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        f_lxsum89wkzd: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            'x-designer': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-collection-field': string;
                                                                                                                                            'x-component-props': {
                                                                                                                                                mode: string;
                                                                                                                                                fieldNames: {
                                                                                                                                                    label: string;
                                                                                                                                                    value: string;
                                                                                                                                                };
                                                                                                                                            };
                                                                                                                                            properties: {
                                                                                                                                                options: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    type: string;
                                                                                                                                                    title: string;
                                                                                                                                                    properties: {
                                                                                                                                                        block: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            type: string;
                                                                                                                                                            'x-collection': string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                collection: string;
                                                                                                                                                                request: {
                                                                                                                                                                    resource: string;
                                                                                                                                                                    action: string;
                                                                                                                                                                    params: {
                                                                                                                                                                        pageSize: number;
                                                                                                                                                                        filter: {};
                                                                                                                                                                        appends: any[];
                                                                                                                                                                    };
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            properties: {
                                                                                                                                                                table: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                        rowKey: string;
                                                                                                                                                                        objectValue: boolean;
                                                                                                                                                                        rowSelection: {
                                                                                                                                                                            type: string;
                                                                                                                                                                        };
                                                                                                                                                                        useDataSource: string;
                                                                                                                                                                    };
                                                                                                                                                                    'x-initializer': string;
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
                                                                                                                                                item: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        drawer1: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                name: string;
                                                                                                                                                            };
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                className: string;
                                                                                                                                                            };
                                                                                                                                                            type: string;
                                                                                                                                                            title: string;
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
                                                                                                                footer: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    type: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        actions: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-component': string;
                                                                                                                            'x-component-props': {
                                                                                                                                layout: string;
                                                                                                                            };
                                                                                                                            properties: {
                                                                                                                                cancel: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-action': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        useAction: string;
                                                                                                                                    };
                                                                                                                                    'x-uid': string;
                                                                                                                                    'x-async': boolean;
                                                                                                                                    'x-index': number;
                                                                                                                                };
                                                                                                                                submit: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    title: string;
                                                                                                                                    'x-action': string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        type: string;
                                                                                                                                        useAction: string;
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
                                                                                        f_jj9cyhron1d: {
                                                                                            _isJSONSchemaObject: boolean;
                                                                                            version: string;
                                                                                            type: string;
                                                                                            title: string;
                                                                                            'x-component': string;
                                                                                            'x-initializer': string;
                                                                                            'x-component-props': {
                                                                                                pagination: boolean;
                                                                                                expandable: {
                                                                                                    childrenColumnName: string;
                                                                                                };
                                                                                                rowSelection: {
                                                                                                    type: string;
                                                                                                };
                                                                                                useSelectedRowKeys: string;
                                                                                                useDataSource: string;
                                                                                            };
                                                                                            properties: {
                                                                                                actions: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    title: string;
                                                                                                    'x-decorator': string;
                                                                                                    'x-component': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-initializer': string;
                                                                                                    properties: {
                                                                                                        actions: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            type: string;
                                                                                                            'x-decorator': string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {
                                                                                                                split: string;
                                                                                                            };
                                                                                                            properties: {
                                                                                                                cji417dhn88: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    title: string;
                                                                                                                    type: string;
                                                                                                                    'x-action': string;
                                                                                                                    'x-designer': string;
                                                                                                                    'x-component': string;
                                                                                                                    'x-component-props': {};
                                                                                                                    properties: {
                                                                                                                        drawer: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-decorator-props': {
                                                                                                                                useValues: string;
                                                                                                                            };
                                                                                                                            'x-component': string;
                                                                                                                            title: string;
                                                                                                                            properties: {
                                                                                                                                grid: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-initializer': string;
                                                                                                                                    properties: {
                                                                                                                                        jp60g9emxci: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                '3165xoudipa': {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        f_m7ibo1vrvnm: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-collection-field': string;
                                                                                                                                                            required: boolean;
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
                                                                                                                                        gvjym37xafd: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                vqiaoht00tw: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        f_kukaw9kddyj: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-collection-field': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                fieldNames: {
                                                                                                                                                                    label: string;
                                                                                                                                                                    value: string;
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            properties: {
                                                                                                                                                                options: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    title: string;
                                                                                                                                                                    properties: {
                                                                                                                                                                        block: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            type: string;
                                                                                                                                                                            'x-collection': string;
                                                                                                                                                                            'x-decorator': string;
                                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                                collection: string;
                                                                                                                                                                                request: {
                                                                                                                                                                                    resource: string;
                                                                                                                                                                                    action: string;
                                                                                                                                                                                    params: {
                                                                                                                                                                                        pageSize: number;
                                                                                                                                                                                        filter: {};
                                                                                                                                                                                        appends: any[];
                                                                                                                                                                                    };
                                                                                                                                                                                };
                                                                                                                                                                            };
                                                                                                                                                                            'x-designer': string;
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            properties: {
                                                                                                                                                                                table: {
                                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                                    version: string;
                                                                                                                                                                                    'x-component': string;
                                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                                        rowKey: string;
                                                                                                                                                                                        objectValue: boolean;
                                                                                                                                                                                        rowSelection: {
                                                                                                                                                                                            type: string;
                                                                                                                                                                                        };
                                                                                                                                                                                        useDataSource: string;
                                                                                                                                                                                    };
                                                                                                                                                                                    'x-initializer': string;
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
                                                                                                                                                                item: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    properties: {
                                                                                                                                                                        drawer1: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            'x-decorator': string;
                                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                                name: string;
                                                                                                                                                                            };
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            'x-component-props': {
                                                                                                                                                                                className: string;
                                                                                                                                                                            };
                                                                                                                                                                            type: string;
                                                                                                                                                                            title: string;
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
                                                                                                                                        bt7aiczcmcg: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                '739ie1depry': {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        f_4mpiovytw4d: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-collection-field': string;
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
                                                                                                                                        t28l1axqts7: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-component': string;
                                                                                                                                            properties: {
                                                                                                                                                o4n78r50icc: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    type: string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    properties: {
                                                                                                                                                        f_lxsum89wkzd: {
                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                            version: string;
                                                                                                                                                            'x-designer': string;
                                                                                                                                                            'x-component': string;
                                                                                                                                                            'x-decorator': string;
                                                                                                                                                            'x-collection-field': string;
                                                                                                                                                            'x-component-props': {
                                                                                                                                                                mode: string;
                                                                                                                                                                fieldNames: {
                                                                                                                                                                    label: string;
                                                                                                                                                                    value: string;
                                                                                                                                                                };
                                                                                                                                                            };
                                                                                                                                                            properties: {
                                                                                                                                                                options: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    type: string;
                                                                                                                                                                    title: string;
                                                                                                                                                                    properties: {
                                                                                                                                                                        block: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            type: string;
                                                                                                                                                                            'x-collection': string;
                                                                                                                                                                            'x-decorator': string;
                                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                                collection: string;
                                                                                                                                                                                request: {
                                                                                                                                                                                    resource: string;
                                                                                                                                                                                    action: string;
                                                                                                                                                                                    params: {
                                                                                                                                                                                        pageSize: number;
                                                                                                                                                                                        filter: {};
                                                                                                                                                                                        appends: any[];
                                                                                                                                                                                    };
                                                                                                                                                                                };
                                                                                                                                                                            };
                                                                                                                                                                            'x-designer': string;
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            properties: {
                                                                                                                                                                                table: {
                                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                                    version: string;
                                                                                                                                                                                    'x-component': string;
                                                                                                                                                                                    'x-component-props': {
                                                                                                                                                                                        rowKey: string;
                                                                                                                                                                                        objectValue: boolean;
                                                                                                                                                                                        rowSelection: {
                                                                                                                                                                                            type: string;
                                                                                                                                                                                        };
                                                                                                                                                                                        useDataSource: string;
                                                                                                                                                                                    };
                                                                                                                                                                                    'x-initializer': string;
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
                                                                                                                                                                item: {
                                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                                    version: string;
                                                                                                                                                                    'x-component': string;
                                                                                                                                                                    properties: {
                                                                                                                                                                        drawer1: {
                                                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                                                            version: string;
                                                                                                                                                                            'x-decorator': string;
                                                                                                                                                                            'x-decorator-props': {
                                                                                                                                                                                name: string;
                                                                                                                                                                            };
                                                                                                                                                                            'x-component': string;
                                                                                                                                                                            'x-component-props': {
                                                                                                                                                                                className: string;
                                                                                                                                                                            };
                                                                                                                                                                            type: string;
                                                                                                                                                                            title: string;
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
                                                                                                                                footer: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    type: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    properties: {
                                                                                                                                        actions: {
                                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                                            version: string;
                                                                                                                                            type: string;
                                                                                                                                            'x-decorator': string;
                                                                                                                                            'x-component': string;
                                                                                                                                            'x-component-props': {
                                                                                                                                                layout: string;
                                                                                                                                            };
                                                                                                                                            properties: {
                                                                                                                                                cancel: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    title: string;
                                                                                                                                                    'x-action': string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        useAction: string;
                                                                                                                                                    };
                                                                                                                                                    'x-uid': string;
                                                                                                                                                    'x-async': boolean;
                                                                                                                                                    'x-index': number;
                                                                                                                                                };
                                                                                                                                                submit: {
                                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                                    version: string;
                                                                                                                                                    title: string;
                                                                                                                                                    'x-action': string;
                                                                                                                                                    'x-component': string;
                                                                                                                                                    'x-component-props': {
                                                                                                                                                        type: string;
                                                                                                                                                        useAction: string;
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
                                                                                                eb529qf5qqv: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-decorator': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        f_m7ibo1vrvnm: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            'x-read-pretty': boolean;
                                                                                                            'x-collection-field': string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {};
                                                                                                            'x-uid': string;
                                                                                                            'x-async': boolean;
                                                                                                            'x-index': number;
                                                                                                        };
                                                                                                    };
                                                                                                    'x-uid': string;
                                                                                                    'x-async': boolean;
                                                                                                    'x-index': number;
                                                                                                };
                                                                                                hy1zgcs7f5y: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-decorator': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        f_kukaw9kddyj: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            'x-read-pretty': boolean;
                                                                                                            'x-collection-field': string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {
                                                                                                                mode: string;
                                                                                                                fieldNames: {
                                                                                                                    label: string;
                                                                                                                    value: string;
                                                                                                                };
                                                                                                            };
                                                                                                            properties: {
                                                                                                                options: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-component': string;
                                                                                                                    type: string;
                                                                                                                    title: string;
                                                                                                                    properties: {
                                                                                                                        block: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            type: string;
                                                                                                                            'x-collection': string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-decorator-props': {
                                                                                                                                collection: string;
                                                                                                                                request: {
                                                                                                                                    resource: string;
                                                                                                                                    action: string;
                                                                                                                                    params: {
                                                                                                                                        pageSize: number;
                                                                                                                                        filter: {};
                                                                                                                                        appends: any[];
                                                                                                                                    };
                                                                                                                                };
                                                                                                                            };
                                                                                                                            'x-designer': string;
                                                                                                                            'x-component': string;
                                                                                                                            properties: {
                                                                                                                                table: {
                                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                                    version: string;
                                                                                                                                    'x-component': string;
                                                                                                                                    'x-component-props': {
                                                                                                                                        rowKey: string;
                                                                                                                                        objectValue: boolean;
                                                                                                                                        rowSelection: {
                                                                                                                                            type: string;
                                                                                                                                        };
                                                                                                                                        useDataSource: string;
                                                                                                                                    };
                                                                                                                                    'x-initializer': string;
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
                                                                                                                item: {
                                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                                    version: string;
                                                                                                                    'x-component': string;
                                                                                                                    properties: {
                                                                                                                        drawer1: {
                                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                                            version: string;
                                                                                                                            'x-decorator': string;
                                                                                                                            'x-decorator-props': {
                                                                                                                                name: string;
                                                                                                                            };
                                                                                                                            'x-component': string;
                                                                                                                            'x-component-props': {
                                                                                                                                className: string;
                                                                                                                            };
                                                                                                                            type: string;
                                                                                                                            title: string;
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
                                                                                                xdgjroykfb8: {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-decorator': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        f_4mpiovytw4d: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            'x-read-pretty': boolean;
                                                                                                            'x-collection-field': string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {};
                                                                                                            'x-uid': string;
                                                                                                            'x-async': boolean;
                                                                                                            'x-index': number;
                                                                                                        };
                                                                                                    };
                                                                                                    'x-uid': string;
                                                                                                    'x-async': boolean;
                                                                                                    'x-index': number;
                                                                                                };
                                                                                                '458fa242xbi': {
                                                                                                    _isJSONSchemaObject: boolean;
                                                                                                    version: string;
                                                                                                    type: string;
                                                                                                    'x-decorator': string;
                                                                                                    'x-designer': string;
                                                                                                    'x-component': string;
                                                                                                    properties: {
                                                                                                        f_lxsum89wkzd: {
                                                                                                            _isJSONSchemaObject: boolean;
                                                                                                            version: string;
                                                                                                            'x-read-pretty': boolean;
                                                                                                            'x-collection-field': string;
                                                                                                            'x-component': string;
                                                                                                            'x-component-props': {
                                                                                                                size: string;
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
                                                        jqgt0895rco: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            properties: {
                                                                '45jxkag9d2n': {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    type: string;
                                                                    'x-component': string;
                                                                    properties: {
                                                                        f_o8dmiub9tp9: {
                                                                            _isJSONSchemaObject: boolean;
                                                                            version: string;
                                                                            title: string;
                                                                            'x-designer': string;
                                                                            'x-component': string;
                                                                            'x-decorator': string;
                                                                            'x-collection-field': string;
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
                                                footer: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    type: string;
                                                    'x-component': string;
                                                    properties: {
                                                        actions: {
                                                            _isJSONSchemaObject: boolean;
                                                            version: string;
                                                            type: string;
                                                            'x-component': string;
                                                            'x-component-props': {
                                                                layout: string;
                                                            };
                                                            properties: {
                                                                cancel: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    title: string;
                                                                    'x-action': string;
                                                                    'x-component': string;
                                                                    'x-component-props': {
                                                                        useAction: string;
                                                                    };
                                                                    'x-uid': string;
                                                                    'x-async': boolean;
                                                                    'x-index': number;
                                                                };
                                                                submit: {
                                                                    _isJSONSchemaObject: boolean;
                                                                    version: string;
                                                                    title: string;
                                                                    'x-action': string;
                                                                    'x-component': string;
                                                                    'x-component-props': {
                                                                        type: string;
                                                                        useAction: string;
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
                wr5tw5nt56s: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_g8j5jvalqh0: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {
                                ellipsis: boolean;
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
                wlt8aafizat: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_tegyd222bcc: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {
                                ellipsis: boolean;
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
                '25gk74kf0y5': {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_ooar0pto2ko: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {
                                size: string;
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
                g1qop86bu4b: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_ksgzy9vmgce: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {
                                fieldNames: {
                                    label: string;
                                    value: string;
                                };
                            };
                            properties: {
                                options: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    'x-component': string;
                                    type: string;
                                    title: string;
                                    properties: {
                                        block: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-collection': string;
                                            'x-decorator': string;
                                            'x-decorator-props': {
                                                collection: string;
                                                request: {
                                                    resource: string;
                                                    action: string;
                                                    params: {
                                                        pageSize: number;
                                                        filter: {};
                                                        appends: any[];
                                                    };
                                                };
                                            };
                                            'x-designer': string;
                                            'x-component': string;
                                            properties: {
                                                table: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    'x-component': string;
                                                    'x-component-props': {
                                                        rowKey: string;
                                                        objectValue: boolean;
                                                        rowSelection: {
                                                            type: string;
                                                        };
                                                        useDataSource: string;
                                                    };
                                                    'x-initializer': string;
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
                                item: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    'x-component': string;
                                    properties: {
                                        drawer1: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            'x-decorator': string;
                                            'x-decorator-props': {
                                                name: string;
                                            };
                                            'x-component': string;
                                            'x-component-props': {
                                                className: string;
                                            };
                                            type: string;
                                            title: string;
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
                t7pobtqthjj: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_z27302tl2bf: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {};
                            'x-uid': string;
                            'x-async': boolean;
                            'x-index': number;
                        };
                    };
                    'x-uid': string;
                    'x-async': boolean;
                    'x-index': number;
                };
                m8soy98oqim: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_yc8jbfiqfvh: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {};
                            'x-uid': string;
                            'x-async': boolean;
                            'x-index': number;
                        };
                    };
                    'x-uid': string;
                    'x-async': boolean;
                    'x-index': number;
                };
                k4d2sqomlrq: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_u007sq2jg93: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {
                                fieldNames: {
                                    label: string;
                                    value: string;
                                };
                            };
                            properties: {
                                options: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    'x-component': string;
                                    type: string;
                                    title: string;
                                    properties: {
                                        block: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            type: string;
                                            'x-collection': string;
                                            'x-decorator': string;
                                            'x-decorator-props': {
                                                collection: string;
                                                request: {
                                                    resource: string;
                                                    action: string;
                                                    params: {
                                                        pageSize: number;
                                                        filter: {};
                                                        appends: any[];
                                                    };
                                                };
                                            };
                                            'x-designer': string;
                                            'x-component': string;
                                            properties: {
                                                table: {
                                                    _isJSONSchemaObject: boolean;
                                                    version: string;
                                                    'x-component': string;
                                                    'x-component-props': {
                                                        rowKey: string;
                                                        objectValue: boolean;
                                                        rowSelection: {
                                                            type: string;
                                                        };
                                                        useDataSource: string;
                                                    };
                                                    'x-initializer': string;
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
                                item: {
                                    _isJSONSchemaObject: boolean;
                                    version: string;
                                    'x-component': string;
                                    properties: {
                                        drawer1: {
                                            _isJSONSchemaObject: boolean;
                                            version: string;
                                            'x-decorator': string;
                                            'x-decorator-props': {
                                                name: string;
                                            };
                                            'x-component': string;
                                            'x-component-props': {
                                                className: string;
                                            };
                                            type: string;
                                            title: string;
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
                tsh1e5o6jjk: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_hpmvdltzs6m: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {};
                            'x-uid': string;
                            'x-async': boolean;
                            'x-index': number;
                        };
                    };
                    'x-uid': string;
                    'x-async': boolean;
                    'x-index': number;
                };
                yskrn3xc0xn: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_cht6rsiiiko: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {};
                            'x-uid': string;
                            'x-async': boolean;
                            'x-index': number;
                        };
                    };
                    'x-uid': string;
                    'x-async': boolean;
                    'x-index': number;
                };
                x5dlcnm8r33: {
                    _isJSONSchemaObject: boolean;
                    version: string;
                    type: string;
                    'x-decorator': string;
                    'x-designer': string;
                    'x-component': string;
                    properties: {
                        f_o8dmiub9tp9: {
                            _isJSONSchemaObject: boolean;
                            version: string;
                            'x-read-pretty': boolean;
                            'x-collection-field': string;
                            'x-component': string;
                            'x-component-props': {};
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
};
export default _default;
