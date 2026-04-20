/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import lodash from 'lodash';
import { Model } from './model';
import { UpdateGuard } from './update-guard';
import { getKeysByPrefix, isStringOrNumber, isUndefinedOrNull } from './utils';
export function modelAssociations(instance) {
  return instance.constructor.associations;
}
export function belongsToManyAssociations(instance) {
  const associations = modelAssociations(instance);
  return Object.entries(associations)
    .filter((entry) => {
      const [key, association] = entry;
      return association.associationType == 'BelongsToMany';
    })
    .map((association) => {
      return association[1];
    });
}
export function modelAssociationByKey(instance, key) {
  return modelAssociations(instance)[key];
}
export async function updateModelByValues(instance, values, options) {
  if (!options?.sanitized) {
    const guard = new UpdateGuard();
    //@ts-ignore
    guard.setModel(instance.constructor);
    guard.setBlackList(options.blacklist);
    guard.setWhiteList(options.whitelist);
    guard.setAssociationKeysToBeUpdate(options.updateAssociationValues);
    values = guard.sanitize(values);
  }
  instance.constructor.collection.validate({
    values,
    operation: 'update',
  });
  await instance.update(values, options);
  await updateAssociations(instance, values, options);
}
export async function updateThroughTableValue(instance, throughName, throughValues, source, transaction = null) {
  // update through table values
  for (const belongsToMany of belongsToManyAssociations(instance)) {
    // @ts-ignore
    const throughModel = belongsToMany.through.model;
    const throughModelName = throughModel.name;
    if (throughModelName === throughModelName) {
      const where = {
        [belongsToMany.foreignKey]: instance.get(belongsToMany.sourceKey),
        [belongsToMany.otherKey]: source.get(belongsToMany.targetKey),
      };
      return await throughModel.update(throughValues, {
        where,
        transaction,
      });
    }
  }
}
/**
 * update association of instance by values
 * @param instance
 * @param values
 * @param options
 */
export async function updateAssociations(instance, values, options = {}) {
  // if no values set, return
  if (!values) {
    return;
  }
  if (options?.updateAssociationValues) {
    options.recursive = true;
  }
  let newTransaction = false;
  let transaction = options.transaction;
  if (!transaction) {
    newTransaction = true;
    transaction = await instance.sequelize.transaction();
  }
  const keys = Object.keys(values);
  try {
    for (const key of Object.keys(modelAssociations(instance))) {
      if (keys.includes(key)) {
        await updateAssociation(instance, key, values[key], {
          ...options,
          transaction,
        });
      }
    }
    // update through table values
    for (const belongsToMany of belongsToManyAssociations(instance)) {
      // @ts-ignore
      const throughModel = belongsToMany.through.model;
      const throughModelName = throughModel.name;
      if (values[throughModelName] && options.sourceModel) {
        const where = {
          [belongsToMany.foreignKey]: instance.get(belongsToMany.sourceKey),
          [belongsToMany.otherKey]: options.sourceModel.get(belongsToMany.targetKey),
        };
        await throughModel.update(values[throughModel.name], {
          where,
          context: options.context,
          transaction,
        });
      }
    }
    if (newTransaction) {
      await transaction.commit();
    }
  } catch (error) {
    if (newTransaction) {
      await transaction.rollback();
    }
    throw error;
  }
}
function isReverseAssociationPair(a, b) {
  const typeSet = new Set();
  typeSet.add(a.associationType);
  typeSet.add(b.associationType);
  if (typeSet.size == 1 && typeSet.has('BelongsToMany')) {
    return (
      a.through.tableName === b.through.tableName &&
      a.target.name === b.source.name &&
      b.target.name === a.source.name &&
      a.foreignKey === b.otherKey &&
      a.sourceKey === b.targetKey &&
      a.otherKey === b.foreignKey &&
      a.targetKey === b.sourceKey
    );
  }
  if ((typeSet.has('HasOne') && typeSet.has('BelongsTo')) || (typeSet.has('HasMany') && typeSet.has('BelongsTo'))) {
    const sourceAssoc = a.associationType == 'BelongsTo' ? b : a;
    const targetAssoc = sourceAssoc == a ? b : a;
    return (
      sourceAssoc.source.name === targetAssoc.target.name &&
      sourceAssoc.target.name === targetAssoc.source.name &&
      sourceAssoc.foreignKey === targetAssoc.foreignKey &&
      sourceAssoc.sourceKey === targetAssoc.targetKey
    );
  }
  return false;
}
/**
 * update model association by key
 * @param instance
 * @param key
 * @param value
 * @param options
 */
export async function updateAssociation(instance, key, value, options = {}) {
  const association = modelAssociationByKey(instance, key);
  if (!association) {
    return false;
  }
  if (options.associationContext && isReverseAssociationPair(association, options.associationContext)) {
    return false;
  }
  switch (association.associationType) {
    case 'HasOne':
    case 'BelongsTo':
      return updateSingleAssociation(instance, key, value, options);
    case 'HasMany':
    case 'BelongsToMany':
      return updateMultipleAssociation(instance, key, value, options);
  }
}
/**
 * update belongsTo and HasOne
 * @param model
 * @param key
 * @param value
 * @param options
 */
export async function updateSingleAssociation(model, key, value, options = {}) {
  const association = modelAssociationByKey(model, key);
  if (!association) {
    return false;
  }
  if (!['undefined', 'string', 'number', 'object'].includes(typeof value)) {
    return false;
  }
  if (Array.isArray(value)) {
    throw new Error(`The value of '${key}' cannot be in array format`);
  }
  const { recursive, context, updateAssociationValues = [], transaction } = options;
  const keys = getKeysByPrefix(updateAssociationValues, key);
  // set method of association
  const setAccessor = association.accessors.set;
  const removeAssociation = async () => {
    await model[setAccessor](null, { transaction });
    model.setDataValue(key, null);
    return true;
  };
  if (isUndefinedOrNull(value)) {
    return await removeAssociation();
  }
  // @ts-ignore
  if (association.associationType === 'HasOne' && !model.get(association.sourceKeyAttribute)) {
    // @ts-ignore
    throw new Error(`The source key ${association.sourceKeyAttribute} is not set in ${model.constructor.name}`);
  }
  const checkBelongsToForeignKeyValue = () => {
    // @ts-ignore
    if (association.associationType === 'BelongsTo' && !model.get(association.foreignKey)) {
      throw new Error(
        // @ts-ignore
        `The target key ${association.targetKey} is not set in ${association.target.name}`,
      );
    }
  };
  let dataKey;
  let M;
  if (association.associationType === 'BelongsTo') {
    M = association.target;
    // @ts-ignore
    dataKey = association.targetKey;
  } else {
    M = association.target;
    dataKey = M.primaryKeyAttribute;
  }
  if (isStringOrNumber(value)) {
    const instance = await M.findOne({
      where: {
        [dataKey]: value,
      },
      transaction,
    });
    if (instance) {
      await model[setAccessor](value, { context, transaction });
    }
    return true;
  }
  if (value instanceof Model) {
    await model[setAccessor](value, { context, transaction });
    model.setDataValue(key, value);
    return true;
  }
  const createAccessor = association.accessors.create;
  if (isStringOrNumber(value[dataKey])) {
    const instance = await M.findOne({
      where: {
        [dataKey]: value[dataKey],
      },
      transaction,
    });
    if (instance) {
      await model[setAccessor](instance, { context, transaction });
      if (!recursive) {
        return;
      }
      if (updateAssociationValues.includes(key)) {
        const updateValues = { ...value };
        if (association.associationType === 'HasOne') {
          delete updateValues[association.foreignKey];
        }
        await instance.update(updateValues, { ...options, transaction, inputValues: updateValues });
      }
      await updateAssociations(instance, value, {
        ...options,
        transaction,
        associationContext: association,
        updateAssociationValues: keys,
      });
      model.setDataValue(key, instance);
      return true;
    }
  }
  association.target.collection.validate({
    values: value,
    operation: 'create',
  });
  const instance = await model[createAccessor](value, { context, transaction, inputValues: value });
  await updateAssociations(instance, value, {
    ...options,
    transaction,
    associationContext: association,
    updateAssociationValues: keys,
  });
  model.setDataValue(key, instance);
  // @ts-ignore
  if (association.targetKey) {
    model.setDataValue(association.foreignKey, instance[dataKey]);
  }
  // must have foreign key value
  checkBelongsToForeignKeyValue();
}
/**
 * update multiple association of model by value
 * @param model
 * @param key
 * @param value
 * @param options
 */
export async function updateMultipleAssociation(model, key, value, options = {}) {
  const association = modelAssociationByKey(model, key);
  if (!association) {
    return false;
  }
  if (!['undefined', 'string', 'number', 'object'].includes(typeof value)) {
    return false;
  }
  const { recursive, context, updateAssociationValues = [], transaction } = options;
  const keys = getKeysByPrefix(updateAssociationValues, key);
  const setAccessor = association.accessors.set;
  const createAccessor = association.accessors.create;
  if (isUndefinedOrNull(value)) {
    await model[setAccessor](null, { transaction, context, individualHooks: true, validate: false });
    model.setDataValue(key, null);
    return;
  }
  // @ts-ignore
  if (association.associationType === 'HasMany' && !model.get(association.sourceKeyAttribute)) {
    // @ts-ignore
    throw new Error(`The source key ${association.sourceKeyAttribute} is not set in ${model.constructor.name}`);
  }
  if (isStringOrNumber(value)) {
    await model[setAccessor](value, { transaction, context, individualHooks: true, validate: false });
    return;
  }
  value = lodash.castArray(value);
  let setItems = []; // to be setted
  const objectItems = []; // to be added
  // iterate item in value
  for (const item of value) {
    if (isUndefinedOrNull(item)) {
      continue;
    }
    if (isStringOrNumber(item)) {
      setItems.push(item);
    } else if (item instanceof Model) {
      setItems.push(item);
    } else if (item.sequelize) {
      setItems.push(item);
    } else if (typeof item === 'object') {
      // @ts-ignore
      const targetKey = association.targetKey || association.options.targetKey || 'id';
      if (item[targetKey]) {
        const attributes = {
          [targetKey]: item[targetKey],
        };
        const instance = association.target.build(attributes, { isNewRecord: false });
        setItems.push(instance);
      }
      objectItems.push(item);
    }
  }
  if (setItems.length > 0) {
    const TargetModel = association.target;
    const pk = TargetModel.primaryKeyAttribute;
    // @ts-ignore
    const targetKey = association.targetKey || association.options.targetKey || pk;
    const rawKeys = [];
    const instanceItems = [];
    for (const item of setItems) {
      if (item instanceof Model) {
        instanceItems.push(item);
      } else if (isStringOrNumber(item)) {
        rawKeys.push(item);
      }
    }
    const validInstances = rawKeys.length
      ? await TargetModel.findAll({
          where: { [targetKey]: rawKeys },
          transaction,
        })
      : [];
    setItems = [...instanceItems, ...validInstances];
  }
  // associate targets in lists1
  await model[setAccessor](setItems, { transaction, context, individualHooks: true, validate: false });
  const newItems = [];
  const pk = association.target.primaryKeyAttribute;
  let targetKey = pk;
  const db = model.constructor['database'];
  const tmpKey = association['options']?.['targetKey'];
  if (tmpKey !== pk) {
    const targetKeyFieldOptions = db.getFieldByPath(`${association.target.name}.${tmpKey}`)?.options;
    if (targetKeyFieldOptions?.unique) {
      targetKey = tmpKey;
    }
  }
  for (const item of objectItems) {
    const through = association.through ? association.through.model.name : null;
    const accessorOptions = {
      context,
      transaction,
    };
    const throughValue = item[through];
    if (throughValue) {
      accessorOptions['through'] = throughValue;
    }
    if (pk !== targetKey && !isUndefinedOrNull(item[pk]) && isUndefinedOrNull(item[targetKey])) {
      throw new Error(`${targetKey} field value is empty`);
    }
    if (isUndefinedOrNull(item[targetKey])) {
      // create new record
      association.target.collection.validate({
        values: item,
        operation: 'create',
      });
      const instance = await model[createAccessor](item, { ...accessorOptions, inputValues: item });
      await updateAssociations(instance, item, {
        ...options,
        transaction,
        associationContext: association,
        updateAssociationValues: keys,
      });
      newItems.push(instance);
    } else {
      // set & update record
      const where = {
        [targetKey]: item[targetKey],
      };
      let instance = await association.target.findOne({
        where,
        transaction,
      });
      if (!instance) {
        // create new record
        association.target.collection.validate({
          values: item,
          operation: 'create',
        });
        instance = await model[createAccessor](item, { ...accessorOptions, inputValues: item });
        await updateAssociations(instance, item, {
          ...options,
          transaction,
          associationContext: association,
          updateAssociationValues: keys,
        });
        newItems.push(instance);
        continue;
      }
      const addAccessor = association.accessors.add;
      await model[addAccessor](instance, accessorOptions);
      if (!recursive) {
        continue;
      }
      if (updateAssociationValues.includes(key)) {
        if (association.associationType === 'HasMany') {
          delete item[association.foreignKey];
        }
        association.target.collection.validate({
          values: item,
          operation: 'update',
        });
        await instance.update(item, { ...options, transaction, inputValues: item });
      }
      await updateAssociations(instance, item, {
        ...options,
        transaction,
        associationContext: association,
        updateAssociationValues: keys,
      });
      newItems.push(instance);
    }
  }
  for (const newItem of newItems) {
    // @ts-ignore
    const findTargetKey = association.targetKey || association.options.targetKey || targetKey;
    const existIndexInSetItems = setItems.findIndex((setItem) => setItem[findTargetKey] === newItem[findTargetKey]);
    if (existIndexInSetItems !== -1) {
      setItems[existIndexInSetItems] = newItem;
    } else {
      setItems.push(newItem);
    }
  }
  model.setDataValue(key, setItems);
}
//# sourceMappingURL=update-associations.js.map
