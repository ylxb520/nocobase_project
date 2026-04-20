/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * 流程正常退出异常类
 * 用于标识通过 ctx.exit() 正常退出的情况
 */
export declare class FlowExitException extends Error {
  readonly flowKey: string;
  readonly modelUid: string;
  constructor(flowKey: string, modelUid: string, message?: string);
}
export declare class FlowExitAllException extends Error {
  readonly flowKey: string;
  readonly modelUid: string;
  constructor(flowKey: string, modelUid: string, message?: string);
}
/**
 * 取消当前保存但保持设置弹窗打开
 * 用于“保存前确认”场景，用户取消时不应关闭弹窗也不应提示错误
 */
export declare class FlowCancelSaveException extends Error {
  constructor(message?: string);
}
