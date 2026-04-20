/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * [AI_DEBUG] AI Debug Logger
 *
 * To remove this debug feature, search for "[AI_DEBUG]" in the codebase and delete:
 * 1. This file (debug-logger.ts)
 * 2. All import statements with "[AI_DEBUG]" comment
 * 3. All code blocks with "[AI_DEBUG]" comment
 */
export type LogType =
  | 'request'
  | 'stream_text'
  | 'stream_search'
  | 'stream_start'
  | 'stream_tools'
  | 'stream_delta'
  | 'stream_error'
  | 'tool_call'
  | 'tool_result'
  | 'error';
export type LogEntry = {
  id: string;
  type: LogType;
  time: number;
  data: Record<string, any>;
};
type SessionLog = {
  sessionId: string;
  employeeId?: string;
  employeeName?: string;
  createdAt: number;
  updatedAt: number;
  logs: LogEntry[];
};
type DebugData = {
  sessions: SessionLog[];
};
type LogListener = (log: LogEntry, sessionId: string) => void;
declare class AIDebugLogger {
  private listeners;
  subscribe(callback: LogListener): () => void;
  private notifyListeners;
  log(
    sessionId: string,
    type: LogType,
    data: Record<string, any>,
    meta?: {
      employeeId?: string;
      employeeName?: string;
    },
  ): void;
  private getStorage;
  private saveStorage;
  clear(): void;
  clearSession(sessionId: string): void;
  getAll(): DebugData;
  getSession(sessionId: string): SessionLog | undefined;
}
export declare const aiDebugLogger: AIDebugLogger;
export {};
