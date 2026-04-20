/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FieldModel } from '@nocobase/client';
export declare const CardUpload: (props: any) => React.JSX.Element;
export declare class UploadFieldModel extends FieldModel {
    selectedRows: {
        value: any[];
    };
    _closeView: any;
    set customRequest(fn: any);
    onInit(options: any): void;
    set onSelectExitRecordClick(fn: any);
    change(): void;
    render(): React.JSX.Element;
}
