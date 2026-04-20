/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowEngineContext } from '../flowContext';
import { ViewParam as SharedViewParam } from '../utils';
type ViewParams = Omit<SharedViewParam, 'viewUid'> & {
    viewUid?: string;
};
/**
 * 将 ViewParam 数组转换为 pathname
 *
 * @param viewParams - ViewParam 数组
 * @returns 生成的 pathname
 *
 * @example
 * ```typescript
 * generatePathnameFromViewParams([{ viewUid: 'xxx' }]) // '/admin/xxx'
 * generatePathnameFromViewParams([{ viewUid: 'xxx', tabUid: 'yyy' }]) // '/admin/xxx/tab/yyy'
 * generatePathnameFromViewParams([{ viewUid: 'xxx' }, { viewUid: 'yyy' }]) // '/admin/xxx/view/yyy'
 * ```
 */
export declare function generatePathnameFromViewParams(viewParams: ViewParams[]): string;
export declare class ViewNavigation {
    viewStack: ReadonlyArray<ViewParams>;
    ctx: FlowEngineContext;
    viewParams: ViewParams;
    constructor(ctx: FlowEngineContext, viewParams: ViewParams[]);
    setViewStack(viewParams: ViewParams[]): void;
    changeTo(viewParam: ViewParams): void;
    navigateTo(viewParam: ViewParams, opts?: {
        replace?: boolean;
        state?: any;
    }): void;
    back(): void;
}
export {};
