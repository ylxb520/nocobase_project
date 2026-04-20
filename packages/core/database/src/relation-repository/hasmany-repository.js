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
import { omit } from 'lodash';
import { Op } from 'sequelize';
import { MultipleRelationRepository } from './multiple-relation-repository';
import { transaction } from './relation-repository';
export class HasManyRepository extends MultipleRelationRepository {
  async find(options) {
    const targetRepository = this.targetCollection.repository;
    const targetFilterOptions = await this.targetRepositoryFilterOptionsBySourceValue();
    const findOptionsOmit = ['where', 'values', 'attributes'];
    if (options?.filterByTk && !this.isMultiTargetKey(options.filterByTk)) {
      // @ts-ignore
      targetFilterOptions[this.associationField.targetKey] = options.filterByTk;
      findOptionsOmit.push('filterByTk');
    }
    const findOptions = {
      ...omit(options, findOptionsOmit),
      filter: {
        $and: [options?.filter || {}, targetFilterOptions],
      },
    };
    return await targetRepository.find(findOptions);
  }
  async aggregate(options) {
    const targetRepository = this.targetCollection.repository;
    const aggOptions = {
      ...options,
      filter: {
        $and: [options.filter || {}, await this.targetRepositoryFilterOptionsBySourceValue()],
      },
    };
    return await targetRepository.aggregate(aggOptions);
  }
  async destroy(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    const where = [
      {
        [this.association.foreignKey]: sourceModel.get(this.association.sourceKey),
      },
    ];
    if (options && options['filter']) {
      const filterResult = this.parseFilter(options['filter'], options);
      if (filterResult.include && filterResult.include.length > 0) {
        return await this.destroyByFilter(
          {
            filter: options['filter'],
            filterByTk: options['filterByTk'],
          },
          transaction,
        );
      }
      where.push(filterResult.where);
    }
    if (options && options['filterByTk']) {
      if (typeof options === 'object' && options['filterByTk']) {
        options = options['filterByTk'];
      }
      where.push({
        [this.targetKey()]: options,
      });
    }
    await this.targetModel.destroy({
      where: {
        [Op.and]: where,
      },
      individualHooks: true,
      transaction,
    });
    return true;
  }
  async set(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    await sourceModel[this.accessors().set](this.convertTks(options), {
      transaction,
    });
  }
  async add(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    await sourceModel[this.accessors().add](this.convertTks(options), {
      transaction,
    });
  }
  /**
   * @internal
   */
  accessors() {
    return this.association.accessors;
  }
}
__decorate(
  [
    transaction((args, transaction) => {
      return {
        filterByTk: args[0],
        transaction,
      };
    }),
  ],
  HasManyRepository.prototype,
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
  HasManyRepository.prototype,
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
  HasManyRepository.prototype,
  'add',
  null,
);
//# sourceMappingURL=hasmany-repository.js.map
