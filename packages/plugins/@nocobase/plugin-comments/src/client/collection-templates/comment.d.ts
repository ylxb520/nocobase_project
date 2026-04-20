/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { CollectionTemplate } from '@nocobase/client';
export declare class CommentCollectionTemplate extends CollectionTemplate {
  name: string;
  title: string;
  order: number;
  color: string;
  default: {
    fields: {
      name: string;
      type: string;
      length: string;
      interface: string;
      deletable: boolean;
      uiSchema: {
        type: string;
        title: string;
        interface: string;
        'x-component': string;
      };
    }[];
  };
  presetFieldsDisabled: boolean;
  configurableProperties: Record<
    import('packages/core/client/src/collection-manager/templates/properties').DefaultConfigurableKeys,
    any
  >;
}
