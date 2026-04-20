/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { CollectionBlockModel } from '@nocobase/client';
import { BaseRecordResource, FlowModel } from '@nocobase/flow-engine';
export declare class FlowUtils {
  static getSubModels(model: FlowModel): FlowModel<import('@nocobase/flow-engine').DefaultStructure>[];
  static walkthrough(model: FlowModel, callback: (model: FlowModel) => void): void;
  static getCollection(model: CollectionBlockModel):
    | {
        dataSource?: undefined;
        name?: undefined;
        title?: undefined;
        fields?: undefined;
      }
    | {
        dataSource: any;
        name: any;
        title: any;
        fields: {
          readonly: any;
          name: any;
          type: any;
          dataType: any;
          title: string;
          enum: any[];
          defaultValue: any;
        }[];
      };
  static getResource(model: { resource: BaseRecordResource }): Promise<any>;
}
