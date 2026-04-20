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
import injectTargetCollection from '../decorators/target-collection-decorator';
import { updateModelByValues } from '../update-associations';
import { RelationRepository, transaction } from './relation-repository';
export class SingleRelationRepository extends RelationRepository {
  async remove(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    return await sourceModel[this.accessors().set](null, {
      transaction,
    });
  }
  async set(options) {
    const transaction = await this.getTransaction(options);
    const sourceModel = await this.getSourceModel(transaction);
    return await sourceModel[this.accessors().set](this.convertTk(options), {
      transaction,
    });
  }
  async find(options) {
    const targetRepository = this.targetCollection.repository;
    const sourceModel = await this.getSourceModel(await this.getTransaction(options));
    if (!sourceModel) return null;
    const addFilter = await this.filterOptions(sourceModel);
    const findOptions = {
      ...options,
      filter: {
        $and: [options?.filter || {}, addFilter],
      },
    };
    return await targetRepository.findOne(findOptions);
  }
  async findOne(options) {
    return this.find({ ...options, filterByTk: null });
  }
  async destroy(options) {
    const transaction = await this.getTransaction(options);
    const target = await this.find({
      transaction,
    });
    await target.destroy({
      transaction,
    });
    return true;
  }
  async update(options) {
    const transaction = await this.getTransaction(options);
    const target = await this.find({
      transaction,
      // @ts-ignore
      targetCollection: options.targetCollection,
    });
    if (!target) {
      throw new Error('The record does not exist');
    }
    await updateModelByValues(target, options?.values, {
      ...options,
      transaction,
    });
    if (options.hooks !== false) {
      await this.db.emitAsync(`${this.targetCollection.name}.afterUpdateWithAssociations`, target, {
        ...options,
        transaction,
      });
      const eventName = `${this.targetCollection.name}.afterSaveWithAssociations`;
      await this.db.emitAsync(eventName, target, { ...options, transaction });
    }
    return target;
  }
  /**
   * @internal
   */
  accessors() {
    return super.accessors();
  }
}
__decorate([transaction()], SingleRelationRepository.prototype, 'remove', null);
__decorate(
  [
    transaction((args, transaction) => {
      return {
        tk: args[0],
        transaction,
      };
    }),
  ],
  SingleRelationRepository.prototype,
  'set',
  null,
);
__decorate([transaction()], SingleRelationRepository.prototype, 'destroy', null);
__decorate([transaction(), injectTargetCollection], SingleRelationRepository.prototype, 'update', null);
//# sourceMappingURL=single-relation-repository.js.map
