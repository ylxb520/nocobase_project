/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { ComponentType } from 'react';
export declare function normalizeContainer(container: Element | ShadowRoot | string): Element | null;
export declare const compose: (...components: [ComponentType, any][]) => (LastChild?: ComponentType) => React.FC;
