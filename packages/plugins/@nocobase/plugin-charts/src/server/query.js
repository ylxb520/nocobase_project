/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const query = {
  api: async (options) => {
    return [];
  },
  json: async (options) => {
    return options.data || [];
  },
  sql: async (options, { db, transaction, skipError, validateSQL }) => {
    try {
      // 分号截取，只取第一段
      const sql = options.sql.trim().split(';').shift();
      if (!sql) {
        throw new Error('SQL is empty');
      }
      if (!/^select/i.test(sql) && !/^with([\s\S]+)select([\s\S]+)/i.test(sql)) {
        throw new Error('Only select query allowed');
      }
      const [data] = await db.sequelize.query(sql, { transaction });
      return data;
    } catch (error) {
      if (skipError) {
        return [];
      }
      throw error;
    }
  },
};
export default query;
//# sourceMappingURL=query.js.map
