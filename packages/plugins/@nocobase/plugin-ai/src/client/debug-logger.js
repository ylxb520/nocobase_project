/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const STORAGE_KEY = 'AI_DEBUG_LOGS';
const MAX_SESSIONS = 5;
const MAX_LOGS_PER_SESSION = 500;
// [AI_DEBUG] Generate unique ID, fallback for environments without crypto.randomUUID (e.g. older browsers)
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
class AIDebugLogger {
  // [AI_DEBUG] Listeners for real-time updates
  listeners = new Set();
  // [AI_DEBUG] Subscribe to log updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  // [AI_DEBUG] Notify all listeners
  notifyListeners(log, sessionId) {
    this.listeners.forEach((listener) => listener(log, sessionId));
  }
  log(sessionId, type, data, meta) {
    if (!sessionId) return;
    const storage = this.getStorage();
    let session = storage.sessions.find((s) => s.sessionId === sessionId);
    if (!session) {
      session = {
        sessionId,
        employeeId: meta?.employeeId,
        employeeName: meta?.employeeName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        logs: [],
      };
      storage.sessions.unshift(session);
    }
    // Deduplicate tool_result by toolCallId (backend results may be fetched multiple times)
    if (type === 'tool_result' && data.toolCallId && data.execution === 'backend') {
      const exists = session.logs.some((log) => log.type === 'tool_result' && log.data.toolCallId === data.toolCallId);
      if (exists) return;
    }
    session.updatedAt = Date.now();
    const logEntry = {
      id: generateId(),
      type,
      time: Date.now(),
      data,
    };
    session.logs.push(logEntry);
    // [AI_DEBUG] Notify listeners of new log
    this.notifyListeners(logEntry, sessionId);
    // Limit logs per session
    if (session.logs.length > MAX_LOGS_PER_SESSION) {
      session.logs = session.logs.slice(-MAX_LOGS_PER_SESSION);
    }
    // Keep only the most recent sessions
    storage.sessions = storage.sessions.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_SESSIONS);
    this.saveStorage(storage);
  }
  getStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { sessions: [] };
    } catch {
      return { sessions: [] };
    }
  }
  saveStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage full, clean up oldest session
      if (e.name === 'QuotaExceededError') {
        data.sessions = data.sessions.slice(0, Math.max(1, data.sessions.length - 1));
        this.saveStorage(data);
      }
    }
  }
  // Developer console helper methods
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
  // [AI_DEBUG] Clear logs for a specific session
  clearSession(sessionId) {
    const storage = this.getStorage();
    const session = storage.sessions.find((s) => s.sessionId === sessionId);
    if (session) {
      session.logs = [];
      this.saveStorage(storage);
    }
  }
  getAll() {
    return this.getStorage();
  }
  getSession(sessionId) {
    return this.getStorage().sessions.find((s) => s.sessionId === sessionId);
  }
}
export const aiDebugLogger = new AIDebugLogger();
// Mount to window for console access
if (typeof window !== 'undefined') {
  window.aiDebug = aiDebugLogger;
}
//# sourceMappingURL=debug-logger.js.map
