/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare const FLOW_ENGINE_NAMESPACE = 'flow-engine';
export declare const BLOCK_TYPES: {
  readonly DATA: 'dataBlocks';
  readonly FILTER: 'filterBlocks';
  readonly OTHER: 'otherBlocks';
};
export interface BlockBuilderConfig {
  key: string;
  label: string;
  type: 'group';
  hasCurrentFlowContext?: boolean;
}
export declare const BLOCK_GROUP_CONFIGS: Record<string, BlockBuilderConfig>;
export declare const SHOW_CURRENT_MODELS: string[];
export declare const MENU_KEYS: {
  readonly CURRENT_RECORD: 'currentRecord';
  readonly ASSOCIATION_RECORDS: 'associationRecords';
  readonly OTHER_RECORDS: 'otherRecords';
  readonly OTHER_COLLECTIONS: 'otherCollections';
  readonly CURRENT_COLLECTIONS: 'currentCollections';
};
