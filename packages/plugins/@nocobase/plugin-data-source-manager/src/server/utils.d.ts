import { DataSourceModel } from './models/data-source';
import { Application } from '@nocobase/server';
export declare function mergeOptions(fieldOptions: any, modelOptions: any): any;
export declare const mapDataSourceWithCollection: (
  app: Application,
  dataSourceModel: DataSourceModel,
  appendCollections?: boolean,
) => any;
