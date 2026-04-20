/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIEmployee } from '../types';
interface ContextAwareState {
  aiEmployees: AIEmployee[];
  showed: string[];
  setAIEmployees: (aiEmployees: AIEmployee[]) => void;
  isShowed(uid: string): boolean;
  addShowed(uid: string): any;
  clearShowed(): any;
}
export declare const contextAware: ContextAwareState;
export {};
