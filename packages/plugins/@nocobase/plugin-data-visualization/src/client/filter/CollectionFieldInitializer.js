/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { InitializerWithSwitch, useSchemaInitializerItem } from '@nocobase/client';
export const CollectionFieldInitializer = () => {
  const schema = {};
  const itemConfig = useSchemaInitializerItem();
  return React.createElement(InitializerWithSwitch, { ...itemConfig, item: itemConfig, schema: schema, type: 'name' });
};
//# sourceMappingURL=CollectionFieldInitializer.js.map
