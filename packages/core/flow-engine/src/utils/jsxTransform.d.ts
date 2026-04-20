/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * Lightweight JSX -> JS compiler for RunJS user code.
 * - Uses sucrase via dynamic import (lazy; avoids static cycles and cost when not needed)
 * - Maps JSX to ctx.React.createElement / ctx.React.Fragment so no global React is required
 * - If sucrase is unavailable or transform throws, returns original code as graceful fallback
 */
export declare function compileRunJs(code: string): Promise<string>;
