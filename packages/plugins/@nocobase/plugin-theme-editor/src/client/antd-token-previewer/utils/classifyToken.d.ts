/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { TokenValue } from '../interface';
export declare const TOKEN_SORTS: ("others" | "colorSplit" | "motion" | "colorText" | "colorFill" | "line" | "screen" | "space" | "font" | "seed" | "control" | "radius" | "colorCommon" | "colorBg")[];
export type TokenType = (typeof TOKEN_SORTS)[number];
export declare function getTypeOfToken(tokenName: string): TokenType;
export declare const classifyToken: (token: Record<string, TokenValue>) => Record<string, string[]>;
