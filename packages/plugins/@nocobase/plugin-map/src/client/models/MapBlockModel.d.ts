/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MultiRecordResource } from '@nocobase/flow-engine';
import { CollectionBlockModel } from '@nocobase/client';
import React from 'react';
export declare class MapBlockModel extends CollectionBlockModel {
    static scene: import("@nocobase/client").BlockSceneType;
    selectedRecordKeys: any[];
    get resource(): MultiRecordResource<any>;
    onInit(options: any): void;
    createResource(ctx: any, params: any): MultiRecordResource<unknown>;
    renderConfigureAction(): React.JSX.Element;
    getSelectedRecordKeys(): any[];
    setSelectedRecordKeys(keys: any): void;
    getInputArgs(): {};
    protected onMount(): void;
    set onOpenView(fn: any);
    renderComponent(): React.JSX.Element;
}
