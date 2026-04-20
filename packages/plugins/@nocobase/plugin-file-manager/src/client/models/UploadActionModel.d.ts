/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel } from '@nocobase/client';
import React from 'react';
export declare function useStorage(storage: any): any;
export declare function useStorageCfg(model: any): {
    storage: any;
    storageType: any;
};
export declare function useStorageUploadProps(props: any, model: any): any;
export declare function validate(file: any, rules: Record<string, any>): string;
export declare function useBeforeUpload(rules: any): (file: any, fileList: any) => false | Promise<any>;
export declare class UploadActionModel extends ActionModel {
    static scene: import("@nocobase/client").ActionSceneType;
    props: any;
    defaultProps: any;
    getAclActionName(): string;
    onInit(options: any): void;
    set onUploadClick(fn: any);
    render(): React.JSX.Element;
}
