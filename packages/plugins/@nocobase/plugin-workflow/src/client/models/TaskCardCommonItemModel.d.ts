/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DetailsCustomItemModel } from '@nocobase/client';
import { FlowModelContext, ModelRenderMode, SubModelItem } from '@nocobase/flow-engine';
export declare class TaskCardCommonItemModel extends DetailsCustomItemModel {
    static renderMode: ModelRenderMode;
    static defineChildren(ctx: FlowModelContext): Promise<SubModelItem[]> | SubModelItem[];
}
