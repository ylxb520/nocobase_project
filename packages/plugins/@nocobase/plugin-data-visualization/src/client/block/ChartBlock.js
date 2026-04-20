/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SchemaComponentOptions, SchemaInitializerContext, useSchemaInitializer, useToken } from '@nocobase/client';
import React, { useState } from 'react';
import { ChartConfigProvider } from '../configure';
import { ChartDataProvider } from './ChartDataProvider';
import { ChartRenderer, ChartRendererProvider } from '../renderer';
import { ChartFilterBlockProvider, ChartFilterBlockDesigner } from '../filter';
import { ChartFilterProvider } from '../filter/FilterProvider';
import { RefreshButton } from '../initializers/RefreshAction';
import { css } from '@emotion/css';
export const useChartBlockCardProps = (props) => {
  const { token } = useToken();
  const background = props.style?.background;
  return {
    ...props,
    style: {
      ...props.style,
      background: background !== 'none' ? token.colorBgContainer : 'none',
    },
  };
};
export const ChartV2Block = (props) => {
  const [initialVisible, setInitialVisible] = useState(false);
  const schemaInitializerContextData = useSchemaInitializer();
  return React.createElement(
    SchemaInitializerContext.Provider,
    { value: { ...schemaInitializerContextData, visible: initialVisible, setVisible: setInitialVisible } },
    React.createElement(
      SchemaComponentOptions,
      {
        components: {
          ChartRenderer,
          ChartRendererProvider,
          ChartFilterBlockProvider,
          ChartFilterBlockDesigner,
          RefreshButton,
        },
      },
      React.createElement(
        'div',
        {
          className: css`
            .ant-nb-card-item {
              .ant-card {
                box-shadow: none;
              }
            }
            .nb-grid-warp > button:last-child {
              margin-bottom: 24px !important;
            }
          `,
        },
        React.createElement(
          ChartDataProvider,
          null,
          React.createElement(
            ChartFilterProvider,
            null,
            React.createElement(ChartConfigProvider, null, props.children),
          ),
        ),
      ),
    ),
  );
};
//# sourceMappingURL=ChartBlock.js.map
