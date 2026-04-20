/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockGridModel, CollectionBlockModel, DetailsGridModel } from '@nocobase/client';
import { SingleRecordResource } from '@nocobase/flow-engine';
import React from 'react';
export declare class NodeDetailsModel extends CollectionBlockModel<{
    parent?: BlockGridModel;
    subModels?: {
        grid: DetailsGridModel;
    };
}> {
    isManualRefresh: boolean;
    _defaultCustomModelClasses: {
        RecordActionGroupModel: string;
        DetailsItemModel: string;
        DetailsAssociationFieldGroupModel: string;
        DetailsCustomItemModel: string;
    };
    customModelClasses: {};
    get dataSourceKey(): any;
    get collectionName(): any;
    get collection(): import("@nocobase/flow-engine").Collection;
    get dataPath(): any;
    createResource(ctx: any, params: any): SingleRecordResource<unknown>;
    onInit(options: any): void;
    getCurrentRecord(): any;
    renderComponent(): React.JSX.Element;
}
