/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CardItemProps } from '@nocobase/client';
import { TreeProps } from '../component';
export declare function useCollectionKey(): string;
export declare function useTreeProps(): TreeProps;
export interface GetTreeSchemaProps {
    dataSource?: string;
    collection: string;
    props?: TreeProps;
    cardProps?: CardItemProps;
    isTreeCollection?: boolean;
}
export declare function getTreeSchema(options: GetTreeSchemaProps): {
    type: string;
    'x-decorator': string;
    'x-decorator-props': {
        dataSource: string;
        collection: string;
        action: string;
        params: {
            pageSize: number;
            tree: boolean;
        };
        tree: TreeProps<import("antd").TreeDataNode>;
    };
    'x-component': string;
    'x-component-props': CardItemProps;
    'x-settings': string;
    'x-toolbar': string;
    'x-filter-targets': any[];
    properties: {
        tree: {
            type: string;
            'x-component': string;
            'x-use-component-props': string;
        };
    };
};
