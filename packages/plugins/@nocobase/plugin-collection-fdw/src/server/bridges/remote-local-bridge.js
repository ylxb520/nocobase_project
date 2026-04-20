/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const IDENTIFIER_REGEX = String.raw`(?:[\`"'](?:(?![\`"']).)+[\`"']|[a-zA-Z0-9_-]+)`;
// Matches `CREATE TABLE` followed by one or more schema/table identifiers separated by dots
export const REPLACE_TABLE_NAME_REGEX = new RegExp(
  String.raw`CREATE TABLE\s+((?:${IDENTIFIER_REGEX})(?:\.(?:${IDENTIFIER_REGEX}))*)`,
);
export class RemoteLocalBridge {
  localDatabase;
  remoteDatabase;
  constructor(localDatabase, remoteDatabase) {
    this.localDatabase = localDatabase;
    this.remoteDatabase = remoteDatabase;
  }
  replaceTableName(sql, tableName) {
    return sql.replace(REPLACE_TABLE_NAME_REGEX, `CREATE TABLE ${tableName}`);
  }
}
export class RemoteLocalBridgeFactory {
  static bridges = new Map();
  static getKeyOfTuple(remoteDialect, localDialect) {
    return `${remoteDialect}-${localDialect}`;
  }
  static createBridge(options) {
    const { remoteDatabase, localDatabase } = options;
    const remoteDialect = remoteDatabase.options.dialect;
    const localDialect = localDatabase.options.dialect;
    const bridge = this.bridges.get(this.getKeyOfTuple(remoteDialect, localDialect));
    if (!bridge) {
      throw new Error(`bridge not found for ${remoteDialect} to ${localDialect}`);
    }
    // @ts-ignore
    return new bridge(localDatabase, remoteDatabase);
  }
  static registerBridge(remoteDialect, localDialect, bridge) {
    this.bridges.set(this.getKeyOfTuple(remoteDialect, localDialect), bridge);
  }
}
//# sourceMappingURL=remote-local-bridge.js.map
