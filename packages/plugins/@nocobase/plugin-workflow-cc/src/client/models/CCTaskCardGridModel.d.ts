/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DetailsGridModel } from '@nocobase/client';
import React from 'react';
/**
 * 抄送任务卡片详情的字段网格
 */
export declare class CCTaskCardGridModel extends DetailsGridModel {
    private lastTempAssociationSnapshot?;
    private readonly tempAssociationSyncHandler;
    onMount(): void;
    onUnmount(): void;
    private getTempAssociationFieldNames;
    private syncTempAssociationFields;
    renderAddSubModelButton(): React.JSX.Element;
    render(): React.JSX.Element;
}
