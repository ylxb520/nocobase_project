/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Application } from './Application';
export type WebSocketClientOptions = {
  reconnectInterval?: number;
  reconnectAttempts?: number;
  pingInterval?: number;
  url?: string;
  basename?: string;
  protocols?: string | string[];
  onServerDown?: any;
};
export declare class WebSocketClient {
  protected _ws: WebSocket;
  protected _reconnectTimes: number;
  protected events: any[];
  protected options: WebSocketClientOptions;
  app: Application;
  enabled: boolean;
  connected: boolean;
  serverDown: boolean;
  lastMessage: {};
  constructor(options: WebSocketClientOptions | boolean);
  getSubAppName: (app: Application) => string;
  getURL(): string;
  get reconnectAttempts(): number;
  get reconnectInterval(): number;
  get pingInterval(): number;
  get readyState(): number;
  createWebSocket(): WebSocket;
  connect(): void;
  reconnect(): void;
  close(): void;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  on(type: string, listener: any, options?: boolean | AddEventListenerOptions): void;
  emit(type: string, args: any): void;
  off(type: string, listener: any, options?: boolean | EventListenerOptions): void;
  removeAllListeners(): void;
}
