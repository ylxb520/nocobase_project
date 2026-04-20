/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Plugin } from '@nocobase/client';
import { orderBy, reject } from 'lodash';
class PluginDataSourceMainClient extends Plugin {
  collectionPresetFields = [];
  addCollectionPresetField(config) {
    this.collectionPresetFields.push(config);
  }
  removeCollectionPresetField(fieldName) {
    this.collectionPresetFields = reject(this.collectionPresetFields, (v) => v.value.name === fieldName);
  }
  getCollectionPresetFields() {
    return orderBy(this.collectionPresetFields, ['order'], ['asc']);
  }
  async load() {
    this.addCollectionPresetField({
      order: 100,
      description: '{{t("Primary key, distributed uniqueness, time-ordering") }}',
      value: {
        name: 'id',
        type: 'snowflakeId',
        autoIncrement: false,
        primaryKey: true,
        allowNull: false,
        uiSchema: {
          type: 'number',
          title: '{{t("ID")}}',
          'x-component': 'InputNumber',
          'x-component-props': {
            stringMode: true,
            separator: '0.00',
            step: '1',
          },
          'x-validator': 'integer',
        },
        interface: 'snowflakeId',
      },
    });
    this.addCollectionPresetField({
      order: 200,
      description: '{{t("Store the creation time of each record")}}',
      value: {
        name: 'createdAt',
        interface: 'createdAt',
        type: 'date',
        field: 'createdAt',
        uiSchema: {
          type: 'datetime',
          title: '{{t("Created at")}}',
          'x-component': 'DatePicker',
          'x-component-props': {},
          'x-read-pretty': true,
        },
      },
    });
    this.addCollectionPresetField({
      order: 300,
      description: '{{t("Store the creation user of each record") }}',
      value: {
        name: 'createdBy',
        interface: 'createdBy',
        type: 'belongsTo',
        target: 'users',
        foreignKey: 'createdById',
        uiSchema: {
          type: 'object',
          title: '{{t("Created by")}}',
          'x-component': 'AssociationField',
          'x-component-props': {
            fieldNames: {
              value: 'id',
              label: 'nickname',
            },
          },
          'x-read-pretty': true,
        },
      },
    });
    this.addCollectionPresetField({
      order: 400,
      description: '{{t("Store the last update time of each record")}}',
      value: {
        type: 'date',
        field: 'updatedAt',
        name: 'updatedAt',
        interface: 'updatedAt',
        uiSchema: {
          type: 'datetime',
          title: '{{t("Last updated at")}}',
          'x-component': 'DatePicker',
          'x-component-props': {},
          'x-read-pretty': true,
        },
      },
    });
    this.addCollectionPresetField({
      order: 500,
      description: '{{t("Store the last update user of each record")}}',
      value: {
        type: 'belongsTo',
        target: 'users',
        foreignKey: 'updatedById',
        name: 'updatedBy',
        interface: 'updatedBy',
        uiSchema: {
          type: 'object',
          title: '{{t("Last updated by")}}',
          'x-component': 'AssociationField',
          'x-component-props': {
            fieldNames: {
              value: 'id',
              label: 'nickname',
            },
          },
          'x-read-pretty': true,
        },
      },
    });
  }
}
export default PluginDataSourceMainClient;
//# sourceMappingURL=index.js.map
