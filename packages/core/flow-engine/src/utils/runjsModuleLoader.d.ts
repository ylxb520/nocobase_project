/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * RunJS 外部模块加载辅助（浏览器侧）。
 *
 * 背景：
 * - NocoBase 前端整体使用 requirejs（AMD）来加载插件与模块；
 * - RunJS 场景下又需要支持 `ctx.importAsync(url)` 直接用浏览器原生 `import()` 加载远端 ESM；
 * - 某些第三方库（典型：UMD/CJS 产物，例如 lodash）会在运行时探测 `define.amd`：
 *   - 若存在 AMD，则优先走 `define(...)` 分支；
 *   - 但像 esm.sh 这类 CDN 的“CJS/UMD → ESM 包装”往往依赖 `module.exports` 提取导出；
 *   - 当 UMD 走了 AMD 分支时，`module.exports` 不会被赋值，最终表现为 ESM 导出（default/命名导出）为 `undefined`。
 *
 * 这里的策略：
 * 1) 全局串行锁：避免 `requireAsync` / `importAsync` 并发时互相影响（尤其是临时 patch 全局 `define.amd`）。
 * 2) 尽量缩小影响窗口：先预取模块（不改全局），再等待 requirejs 空闲，最后只在真正执行 `import()` 的瞬间临时屏蔽 `define.amd`。
 * 3) 所有操作均为 best-effort：内部结构变化、浏览器能力差异等情况下不会阻断正常流程。
 */
type RequireJsLike = ((deps: string[], onLoad: (...args: any[]) => void, onError: (err: any) => void) => void) | undefined;
/**
 * 在 RunJS 内部按 URL 通过 requirejs 加载模块：
 * - 与 `runjsImportAsync` 共用同一把锁，避免并发加载期间全局 patch 互相干扰；
 * - 返回 requirejs 回调的第一个模块值（与现有 `ctx.requireAsync` 行为保持一致）。
 */
export declare function runjsRequireAsync(requirejs: RequireJsLike, url: string): Promise<any>;
/**
 * 在 RunJS 内部按 URL 动态导入 ESM 模块（返回模块命名空间对象）。
 *
 * 兼容点：
 * - 若检测到 `globalThis.define.amd`，则会在导入前做预取，并在真正执行 `import()` 时短暂屏蔽 `define.amd`；
 * - 为了进一步降低风险，会先等待 requirejs 没有挂起加载；
 * - 使用带 `@vite-ignore` / `webpackIgnore: true` 标记的 dynamic import，避免被打包器重写；
 * - 若仍被拦截，再用 `eval('u => import(u)')` 兜底。
 *
 * 重要说明：
 * - 这里不做 URL 解析（如拼 CDN base/suffix），调用方应传入“最终可 import 的 URL”；
 * - 缓存通常由上层（例如 `ctx.importAsync`）按 URL 做 Map 缓存，此处只负责导入与兼容逻辑。
 */
export declare function runjsImportAsync(url: string): Promise<any>;
/**
 * RunJS 专用：按“用户 specifier”导入模块，并在导入 core UI libs 时自动覆盖 ctx/libs。
 *
 * 说明：
 * - 这里负责：specifier rewrite（如 esm.sh antd bundle）、URL 解析、全局 import cache、以及 override。
 * - 具体的 dynamic import 由 `options.importer` 执行（默认使用 `runjsImportAsync`）。
 *   这样在测试中可注入 mock importer，避免真实网络导入。
 */
export declare function runjsImportModule(ctx: any, specifier: string, options?: {
    importer?: (url: string) => Promise<any>;
    addSuffix?: boolean;
}): Promise<any>;
export {};
