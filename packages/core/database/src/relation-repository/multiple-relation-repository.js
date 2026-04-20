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
import { HasOne, Sequelize } from 'sequelize';
import injectTargetCollection from '../decorators/target-collection-decorator';
import { updateModelByValues } from '../update-associations';
import { UpdateGuard } from '../update-guard';
import { RelationRepository, transaction } from './relation-repository';
export class MultipleRelationRepository extends RelationRepository {
  async targetRepositoryFilterOptionsBySourceValue() {
    let filterForeignKeyValue = this.sourceKeyValue;
    if (this.isMultiTargetKey()) {
      const sourceModel = await this.getSourceModel();
      // @ts-ignore
      filterForeignKeyValue = sourceModel.get(this.association.sourceKey);
    }
    return {
      [this.association.foreignKey]: filterForeignKeyValue,
    };
  }
  normalizeScope(scope, model) {
    const result = {};
    for (const [key, value] of Object.entries(scope)) {
      const attr = model.getAttributes()[key];
      if (attr?.field) {
        result[attr.field] = value;
      }
    }
    return result;
  }
  async find(options) {
    const targetRepository = this.targetCollection.repository;
    const association = this.association;
    const oneFromTargetOptions = {
      as: '_pivot_',
      foreignKey: association.otherKey,
      sourceKey: association.targetKey,
      realAs: association.through.model.name,
    };
    if (association.through.scope) {
      oneFromTargetOptions['scope'] = this.normalizeScope(association.through.scope, association.through.model);
    }
    const pivotAssoc = new HasOne(association.target, association.through.model, oneFromTargetOptions);
    const appendFilter = {
      isPivotFilter: true,
      association: pivotAssoc,
      where: await this.targetRepositoryFilterOptionsBySourceValue(),
    };
    return targetRepository.find({
      include: [appendFilter],
      ...options,
    });
  }
  async findAndCount(options) {
    const transaction = await this.getTransaction(options, false);
    return [
      await this.find({
        ...options,
        transaction,
      }),
      await this.count({
        ...options,
        transaction,
      }),
    ];
  }
  async count(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    if (!sourceModel) return 0;
    const queryOptions = this.buildQueryOptions(options);
    const include = queryOptions.include?.filter((item) => {
      const association = this.targetModel.associations?.[item.association];
      return association?.associationType !== 'BelongsToArray';
    });
    const count = await sourceModel[this.accessors().get]({
      where: queryOptions.where,
      include,
      includeIgnoreAttributes: false,
      attributes: [
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col(`${this.targetModel.name}.${this.targetKey()}`)),
          ),
          'count',
        ],
      ],
      raw: true,
      plain: true,
      transaction,
    });
    return parseInt(count.count);
  }
  async findOne(options) {
    const transaction = await this.getTransaction(options, false);
    const rows = await this.find({ ...options, limit: 1, transaction });
    return rows.length == 1 ? rows[0] : null;
  }
  async remove(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    await sourceModel[this.accessors().removeMultiple](this.convertTks(options), {
      transaction,
    });
    return;
  }
  async update(options) {
    const transaction = await this.getTransaction(options);
    const guard = UpdateGuard.fromOptions(this.targetModel, options);
    const values = guard.sanitize(options.values);
    const instances = await this.find({
      ...lodash.omit(options, ['values']),
      transaction,
    });
    for (const instance of instances) {
      await updateModelByValues(instance, values, {
        ...options,
        sanitized: true,
        sourceModel: await this.getSourceModel(transaction),
        transaction,
      });
    }
    for (const instance of instances) {
      if (options.hooks !== false) {
        await this.db.emitAsync(`${this.targetCollection.name}.afterUpdateWithAssociations`, instance, {
          ...options,
          transaction,
        });
        await this.db.emitAsync(`${this.targetCollection.name}.afterSaveWithAssociations`, instance, {
          ...options,
          transaction,
        });
      }
    }
    return instances;
  }
  async destroy(options) {
    return false;
  }
  async destroyByFilter(options, transaction) {
    const instances = await this.find({
      ...options,
      transaction,
    });
    return await this.destroy({
      filterByTk: instances.map((instance) => instance.get(this.targetCollection.filterTargetKey)),
      transaction,
    });
  }
  filterHasInclude(filter, options) {
    const filterResult = this.parseFilter(filter, options);
    return filterResult.include && filterResult.include.length > 0;
  }
  accessors() {
    return super.accessors();
  }
  async updateOrCreate(options) {
    const result = await super.updateOrCreate(options);
    return Array.isArray(result) ? result[0] : result;
  }
}
__decorate(
  [
    transaction((args, transaction) => {
      return {
        tk: args[0],
        transaction,
      };
    }),
  ],
  MultipleRelationRepository.prototype,
  'remove',
  null,
);
__decorate([transaction(), injectTargetCollection], MultipleRelationRepository.prototype, 'update', null);
__decorate([transaction()], MultipleRelationRepository.prototype, 'updateOrCreate', null);
//# sourceMappingURL=multiple-relation-repository.js.map
