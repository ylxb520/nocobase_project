/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
async function destroyFields(db, transaction, fieldRecords) {
  const fieldsRepo = db.getRepository('fields');
  for (const fieldRecord of fieldRecords) {
    await fieldsRepo.destroy({
      filter: {
        name: fieldRecord.get('name'),
        collectionName: fieldRecord.get('collectionName'),
      },
      transaction,
    });
  }
}
export function afterDestroyForForeignKeyField(db) {
  return async (model, opts) => {
    const { transaction } = opts;
    const options = model.get('options');
    if (!options?.isForeignKey) {
      return;
    }
    const collectionRepo = db.getRepository('collections');
    const foreignKey = model.get('name');
    const foreignKeyCollectionName = model.get('collectionName');
    const collectionRecord = await collectionRepo.findOne({
      filter: {
        name: foreignKeyCollectionName,
      },
      transaction,
    });
    const collectionOptions = collectionRecord.get('options');
    const fieldsRepo = db.getRepository('fields');
    if (collectionOptions?.isThrough) {
      // through collection
      const fieldRecords = await fieldsRepo.find({
        filter: {
          options: { through: foreignKeyCollectionName, foreignKey: foreignKey },
        },
        transaction,
      });
      await destroyFields(db, transaction, fieldRecords);
    } else {
      await destroyFields(
        db,
        transaction,
        await fieldsRepo.find({
          filter: {
            collectionName: foreignKeyCollectionName,
            options: { foreignKey: foreignKey },
          },
          transaction,
        }),
      );
      await destroyFields(
        db,
        transaction,
        await fieldsRepo.find({
          filter: {
            options: { foreignKey: foreignKey, target: foreignKeyCollectionName },
          },
          transaction,
        }),
      );
    }
  };
}
//# sourceMappingURL=afterDestroyForForeignKeyField.js.map
