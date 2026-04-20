/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
export class AuthModel extends Model {
  async findUser(uuid) {
    let user;
    const users = await this.getUsers({
      through: {
        where: { uuid },
      },
    });
    if (users.length) {
      user = users[0];
      return user;
    }
  }
  async newUser(uuid, userValues) {
    let user;
    const db = this.constructor.database;
    await this.sequelize.transaction(async (transaction) => {
      // Create a new user if not exists
      user = await this.createUser(
        userValues || {
          nickname: uuid,
        },
        {
          through: {
            uuid: uuid,
          },
          transaction,
        },
      );
      await db.emitAsync(`users.afterCreateWithAssociations`, user, {
        transaction,
      });
    });
    return user;
  }
  async findOrCreateUser(uuid, userValues) {
    const user = await this.findUser(uuid);
    if (user) {
      return user;
    }
    return await this.newUser(uuid, userValues);
  }
}
//# sourceMappingURL=authenticator.js.map
