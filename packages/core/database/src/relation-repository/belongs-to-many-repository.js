/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
import lodash from 'lodash';
import { Op } from 'sequelize';
import { updateAssociations, updateThroughTableValue } from '../update-associations';
import { MultipleRelationRepository } from './multiple-relation-repository';
import { transaction } from './relation-repository';
export class BelongsToManyRepository extends MultipleRelationRepository {
  async aggregate(options) {
    const targetRepository = this.targetCollection.repository;
    const sourceModel = await this.getSourceModel(await this.getTransaction(options));
    const association = this.association;
    return await targetRepository.aggregate({
      ...options,
      optionsTransformer: (modelOptions) => {
        modelOptions.include = modelOptions.include || [];
        const throughWhere = {};
        throughWhere[association.foreignKey] = sourceModel.get(association.sourceKey);
        modelOptions.include.push({
          association: association.oneFromTarget,
          required: true,
          attributes: [],
          where: throughWhere,
        });
      },
    });
  }
  async create(options) {
    if (Array.isArray(options.values)) {
      return Promise.all(options.values.map((record) => this.create({ ...options, values: record })));
    }
    const transaction = await this.getTransaction(options);
    const createAccessor = this.accessors().create;
    const values = options.values || {};
    const sourceModel = await this.getSourceModel(transaction);
    const createOptions = {
      ...options,
      through: values[this.throughName()],
      transaction,
    };
    this.collection.validate({
      values,
      operation: 'create',
    });
    const instance = await sourceModel[createAccessor](values, createOptions);
    await updateAssociations(instance, values, { ...options, transaction });
    return instance;
  }
  async destroy(options) {
    const transaction = await this.getTransaction(options);
    const association = this.association;
    const throughModel = this.throughModel();
    const instancesToIds = (instances) => {
      return instances.map((instance) => instance.get(this.targetKey()));
    };
    // Through Table
    const throughTableWhere = [
      {
        [throughModel.rawAttributes[association.foreignKey].field]: this.sourceKeyValue,
      },
    ];
    let ids;
    if (options && options['filter']) {
      const instances = await this.find({
        filter: options['filter'],
        transaction,
      });
      ids = instancesToIds(instances);
    }
    if (options && options['filterByTk']) {
      const instances = this.association.toInstanceArray(options['filterByTk']);
      ids = ids ? lodash.intersection(ids, instancesToIds(instances)) : instancesToIds(instances);
    }
    if (options && !options['filterByTk'] && !options['filter']) {
      const sourceModel = await this.getSourceModel(transaction);
      const instances = await sourceModel[this.accessors().get]({
        transaction,
      });
      ids = instancesToIds(instances);
    }
    throughTableWhere.push({
      [throughModel.rawAttributes[association.otherKey].field]: {
        [Op.in]: ids,
      },
    });
    // delete through table data
    await this.throughModel().destroy({
      where: throughTableWhere,
      transaction,
    });
    await this.targetModel.destroy({
      where: {
        [this.targetKey()]: {
          [Op.in]: ids,
        },
      },
      individualHooks: true,
      transaction,
    });
    return true;
  }
  async add(options) {
    await this.setTargets('add', options);
  }
  async set(options) {
    await this.setTargets('set', options);
  }
  async toggle(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    const has = await sourceModel[this.accessors().hasSingle](options['tk'], {
      transaction,
    });
    if (has) {
      await this.remove({
        ...options,
        transaction,
      });
    } else {
      await this.add({
        ...options,
        transaction,
      });
    }
    return;
  }
  throughName() {
    return this.throughModel().name;
  }
  throughModel() {
    return this.association.through.model;
  }
  async setTargets(call, options) {
    const handleKeys = this.convertTks(options);
    const transaction = await this.getTransaction(options, false);
    const sourceModel = await this.getSourceModel(transaction);
    const setObj = handleKeys.reduce((carry, item) => {
      if (Array.isArray(item)) {
        carry[item[0]] = item[1];
      } else {
        carry[item] = true;
      }
      return carry;
    }, {});
    const targetKeys = Object.keys(setObj);
    const association = this.association;
    const targetObjects = await this.targetModel.findAll({
      where: {
        [association['targetKey']]: targetKeys,
      },
      transaction,
    });
    await sourceModel[this.accessors()[call]](targetObjects, {
      transaction,
    });
    for (const [id, throughValues] of Object.entries(setObj)) {
      if (typeof throughValues === 'object') {
        const instance = await this.targetModel.findByPk(id, {
          transaction,
        });
        await updateThroughTableValue(instance, this.throughName(), throughValues, sourceModel, transaction);
      }
    }
  }
}
__decorate([transaction()], BelongsToManyRepository.prototype, 'create', null);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        filterByTk: args[0],
        transaction,
      };
    }),
  ],
  BelongsToManyRepository.prototype,
  'destroy',
  null,
);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        tk: args[0],
        transaction,
      };
    }),
  ],
  BelongsToManyRepository.prototype,
  'add',
  null,
);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        tk: args[0],
        transaction,
      };
    }),
  ],
  BelongsToManyRepository.prototype,
  'set',
  null,
);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        tk: args[0],
        transaction,
      };
    }),
  ],
  BelongsToManyRepository.prototype,
  'toggle',
  null,
);
//# sourceMappingURL=belongs-to-many-repository.js.map
