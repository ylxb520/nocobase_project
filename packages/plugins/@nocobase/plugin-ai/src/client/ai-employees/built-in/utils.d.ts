/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIEmployee } from '../types';
export declare const isBuiltIn: (aiEmployee: AIEmployee) => boolean;
export declare const isEngineer: (aiEmployee: AIEmployee) => boolean;
export declare const isDataModelingAssistant: (aiEmployee: AIEmployee) => boolean;
export declare const isHide: (aiEmployee: AIEmployee) => boolean;
export declare const isSupportLanguage: (language: string) => boolean;
