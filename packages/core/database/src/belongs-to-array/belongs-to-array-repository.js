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
import _ from 'lodash';
import { transactionWrapperBuilder } from '../decorators/transaction-decorator';
import { MultipleRelationRepository } from '../relation-repository/multiple-relation-repository';
const transaction = transactionWrapperBuilder(function () {
  return this.collection.model.sequelize.transaction();
});
export class BelongsToArrayAssociation {
  db;
  associationType;
  source;
  foreignKey;
  targetName;
  targetKey;
  identifierField;
  as;
  options;
  constructor(options) {
    const { db, source, as, foreignKey, target, targetKey } = options;
    this.options = options;
    this.associationType = 'BelongsToArray';
    this.db = db;
    this.source = source;
    this.foreignKey = foreignKey;
    this.targetName = target;
    this.targetKey = targetKey;
    this.identifierField = 'undefined';
    this.as = as;
  }
  get target() {
    return this.db.getModel(this.targetName);
  }
  generateInclude(parentAs) {
    const targetCollection = this.db.getCollection(this.targetName);
    const targetField = targetCollection.getField(this.targetKey);
    const sourceCollection = this.db.getCollection(this.source.name);
    const foreignField = sourceCollection.getField(this.foreignKey);
    const queryInterface = this.db.sequelize.getQueryInterface();
    const asLeft = parentAs ? `${parentAs}->${this.as}` : this.as;
    const asRight = parentAs || this.source.collection.name;
    const left = queryInterface.quoteIdentifiers(`${asLeft}.${targetField.columnName()}`);
    const right = queryInterface.quoteIdentifiers(`${asRight}.${foreignField.columnName()}`);
    return {
      on: this.db.queryInterface.generateJoinOnForJSONArray(left, right),
    };
  }
}
export class BelongsToArrayRepository extends MultipleRelationRepository {
  belongsToArrayAssociation;
  constructor(sourceCollection, association, sourceKeyValue) {
    super(sourceCollection, association, sourceKeyValue);
    this.belongsToArrayAssociation = this.association;
  }
  getInstance(options) {
    return this.sourceCollection.repository.findOne({
      filterByTk: this.sourceKeyValue,
    });
  }
  async find(options) {
    const targetRepository = this.targetCollection.repository;
    const instance = await this.getInstance(options);
    const tks = instance.get(this.belongsToArrayAssociation.foreignKey);
    const targetKey = this.belongsToArrayAssociation.targetKey;
    const addFilter = {
      [targetKey]: tks,
    };
    if (options?.filterByTk) {
      addFilter[targetKey] = options.filterByTk;
    }
    const findOptions = {
      ..._.omit(options, ['filterByTk', 'where', 'values', 'attributes']),
      filter: {
        $and: [options.filter || {}, addFilter],
      },
    };
    return await targetRepository.find(findOptions);
  }
}
__decorate([transaction()], BelongsToArrayRepository.prototype, 'find', null);
//# sourceMappingURL=belongs-to-array-repository.js.map
