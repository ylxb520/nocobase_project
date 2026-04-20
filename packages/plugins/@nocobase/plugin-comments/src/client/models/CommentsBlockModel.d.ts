/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MultiRecordResource, FlowModel } from '@nocobase/flow-engine';
import React from 'react';
import { CollectionBlockModel } from '@nocobase/client';
export declare class CommentItemModel extends FlowModel {
    onInit(options: any): void;
    render(): React.JSX.Element;
}
export declare class CommentsBlockModel extends CollectionBlockModel {
    static scene: import("@nocobase/client").BlockSceneType;
    static filterCollection(collection: any): boolean;
    createResource(ctx: any, params: any): MultiRecordResource<unknown>;
    onInit(options: any): void;
    getCurrentRecord(): any;
    handlePageChange: (page: number) => Promise<void>;
    refresh(): Promise<void>;
    renderComponent(): React.JSX.Element;
}
