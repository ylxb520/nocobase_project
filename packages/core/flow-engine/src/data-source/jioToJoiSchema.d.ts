/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import Joi from 'joi';
type JioType = 'string' | 'number' | 'array' | 'boolean' | 'any';
interface JioRule {
    name: string;
    args?: any;
}
export declare function jioToJoiSchema<T extends JioType>(jioConfig: {
    type: T;
    rules?: JioRule[];
}): T extends 'string' ? Joi.StringSchema : T extends 'number' ? Joi.NumberSchema : T extends 'array' ? Joi.ArraySchema : T extends 'boolean' ? Joi.BooleanSchema : Joi.AnySchema;
export {};
