/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { SingleRecordResource } from '@nocobase/flow-engine';
import { DetailsBlockModel } from '@nocobase/client';
/**
 * 抄送任务卡片详情：隐藏顶部按钮，保留详情卡片的字段/标题配置，不支持卡片级操作按钮。
 */
export declare class CCTaskCardDetailsModel extends DetailsBlockModel {
    get hidden(): boolean;
    set hidden(value: boolean);
    onInit(options: any): void;
    createResource(ctx: any, params: any): SingleRecordResource<unknown>;
    refresh(): Promise<void>;
    renderComponent(): React.JSX.Element;
}
