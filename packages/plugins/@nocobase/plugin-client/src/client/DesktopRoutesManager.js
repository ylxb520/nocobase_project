/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  ExtendCollectionsProvider,
  SchemaComponent,
  SchemaComponentContext,
  useSchemaComponentContext,
} from '@nocobase/client';
import { Card } from 'antd';
import React, { useMemo } from 'react';
import desktopRoutes from '../collections/desktopRoutes';
import { useRoutesTranslation } from './locale';
import { createRoutesTableSchema } from './routesTableSchema';
const routesSchema = createRoutesTableSchema('desktopRoutes', '/admin');
export const DesktopRoutesManager = () => {
  const { t } = useRoutesTranslation();
  const scCtx = useSchemaComponentContext();
  const schemaComponentContext = useMemo(() => ({ ...scCtx, designable: false }), [scCtx]);
  return React.createElement(
    ExtendCollectionsProvider,
    { collections: [desktopRoutes] },
    React.createElement(
      SchemaComponentContext.Provider,
      { value: schemaComponentContext },
      React.createElement(
        Card,
        { bordered: false },
        React.createElement(SchemaComponent, {
          schema: routesSchema,
          scope: {
            t,
          },
        }),
      ),
    ),
  );
};
//# sourceMappingURL=DesktopRoutesManager.js.map
