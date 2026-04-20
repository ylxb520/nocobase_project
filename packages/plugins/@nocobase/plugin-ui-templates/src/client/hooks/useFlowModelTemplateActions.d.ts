/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionProps } from '@nocobase/client';
export declare const useFlowModelTemplateSearchProps: () => {
    placeholder: string;
    value: string;
    onChange: (e: any) => void;
    onSearch: (value: string) => void;
    allowClear: boolean;
    style: {
        width: number;
    };
};
export declare const useFlowModelTemplateEditFormProps: () => {
    form: import("@formily/core").Form<any>;
};
export declare const useFlowModelTemplateEditActionProps: () => ActionProps;
export declare const useFlowModelTemplateDeleteActionProps: () => ActionProps;
