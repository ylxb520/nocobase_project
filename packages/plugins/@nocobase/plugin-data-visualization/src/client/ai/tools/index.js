/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { FlowModelRenderer, useFlowEngine } from '@nocobase/flow-engine';
const ChartBlock = ({ toolCall }) => {
  const flowEngine = useFlowEngine();
  const model = flowEngine.createModel({
    uid: 'test',
    use: 'ChartBlockModel',
    stepParams: {
      chartSettings: {
        configure: {
          query: {
            sql: toolCall.args.sql,
          },
          chart: {
            option: {
              raw: JSON.stringify(toolCall.args.echartsOption, null, 2),
            },
          },
        },
      },
    },
  });
  return React.createElement(FlowModelRenderer, { model: model, showFlowSettings: true });
};
export const buildChartBlockTool = [
  'buildChartBlock',
  {
    ui: {
      card: ChartBlock,
    },
  },
];
//# sourceMappingURL=index.js.map
