/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
declare const _default: {
    name: string;
    'x-uid': string;
    properties: {
        p1: {
            'x-uid': string;
            'x-component-props': {
                title: string;
            };
        };
        p2: {
            'x-uid': string;
            properties: {
                p21: {
                    'x-uid': string;
                    properties: {
                        p211: {
                            'x-uid': string;
                        };
                    };
                };
            };
        };
    };
    items: {
        name: string;
        'x-uid': string;
    }[];
};
export default _default;
