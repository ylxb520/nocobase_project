/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import 'ses';
export interface JSRunnerOptions {
  timeoutMs?: number;
  globals?: Record<string, any>;
  version?: string;
  /**
   * Enable RunJS template compatibility preprocessing for `{{ ... }}`.
   * When enabled via `ctx.runjs(code, vars, { preprocessTemplates: true })` (default),
   * the code will be rewritten to call `ctx.resolveJsonTemplate(...)` at runtime.
   */
  preprocessTemplates?: boolean;
}
export declare class JSRunner {
  private globals;
  private timeoutMs;
  constructor(options?: JSRunnerOptions);
  /**
   * 注册单个变量或函数
   */
  register(name: string, value: any): void;
  /**
   * 异步运行代码，带错误处理和超时机制
   */
  run(code: string): Promise<{
    success: boolean;
    value?: any;
    error?: any;
    timeout?: boolean;
  }>;
}
