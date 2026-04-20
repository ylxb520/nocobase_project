/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowRunJSContext } from '../../flowContext';
/**
 * RunJS context for JSEditableFieldModel (form editable custom field).
 * NOTE: Some APIs (e.g., getValue/setValue/element) are provided by the model's runtime handler.
 * This doc is used for editor autocomplete and AI coding assistance.
 */
export declare class JSEditableFieldRunJSContext extends FlowRunJSContext {}
