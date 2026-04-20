/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export declare function renderTemplateSelectLabel(name: React.ReactNode, maxWidth?: number): React.JSX.Element;
export type TemplateSelectOptionData = {
    rawName?: React.ReactNode;
    description?: React.ReactNode;
    disabledReason?: React.ReactNode;
};
export type TemplateSelectOptionRenderArg = {
    label?: React.ReactNode;
    data?: TemplateSelectOptionData;
};
export declare function renderTemplateSelectOption(option: TemplateSelectOptionRenderArg): React.JSX.Element;
