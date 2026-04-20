/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel, CollectionActionModel, FormActionModel } from '@nocobase/client';
import { ButtonProps } from 'antd';
export declare class FormTriggerWorkflowActionModel extends FormActionModel {
    defaultProps: ButtonProps;
}
export declare class RecordTriggerWorkflowActionModel extends ActionModel {
    static scene: import("@nocobase/client").ActionSceneType;
    defaultProps: ButtonProps;
}
export declare class CollectionTriggerWorkflowActionModel extends CollectionActionModel {
    static scene: import("@nocobase/client").ActionSceneType;
    defaultProps: ButtonProps;
}
export declare class CollectionGlobalTriggerWorkflowActionModel extends ActionModel {
    static scene: import("@nocobase/client").ActionSceneType;
    defaultProps: ButtonProps;
}
