/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Card, Collapse, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import { shouldHideStepInSettings } from '../../../../utils';
import { FlowSettings } from './FlowSettings';
import { observer } from '../../../../reactive';
const { Panel } = Collapse;
// 默认使用 Collapse 组件渲染多个流程设置
const FlowsSettingsContent = observer(({ model, expandAll = false }) => {
  const flows = model.getFlows();
  const [filterFlows, setFilterFlows] = useState([]);
  useEffect(() => {
    let mounted = true;
    const buildFilterFlows = async () => {
      const result = [];
      for (const flow of Array.from(flows.values())) {
        const configurableSteps = await Promise.all(
          Object.entries(flow.steps).map(async ([stepKey, actionStep]) => {
            // 如果步骤设置了 hideInSettings: true 或动态隐藏，则跳过此步骤
            if (await shouldHideStepInSettings(model, flow, actionStep)) {
              return null;
            }
            // 从step获取uiSchema（如果存在）
            const stepUiSchema = actionStep.uiSchema || {};
            // 如果step使用了action，也获取action的uiSchema
            let actionUiSchema = {};
            if (actionStep.use) {
              const action = model.flowEngine?.getAction?.(actionStep.use);
              if (action && action.uiSchema) {
                actionUiSchema = action.uiSchema;
              }
            }
            // 合并uiSchema，确保step的uiSchema优先级更高
            // 先复制action的uiSchema，然后用step的uiSchema覆盖相同的字段
            const mergedUiSchema = { ...actionUiSchema };
            // 将stepUiSchema中的字段合并到mergedUiSchema
            Object.entries(stepUiSchema).forEach(([fieldKey, schema]) => {
              if (mergedUiSchema[fieldKey]) {
                // 如果字段已存在，则合并schema对象，保持step中的属性优先级更高
                mergedUiSchema[fieldKey] = { ...mergedUiSchema[fieldKey], ...schema };
              } else {
                // 如果字段不存在，则直接添加
                mergedUiSchema[fieldKey] = schema;
              }
            });
            // 如果没有可配置的UI Schema，返回null
            if (Object.keys(mergedUiSchema).length === 0) {
              return null;
            }
            return { stepKey, step: actionStep, uiSchema: mergedUiSchema };
          }),
        ).then((steps) => steps.filter(Boolean));
        if (configurableSteps.length > 0) {
          result.push(flow);
        }
      }
      if (mounted) {
        setFilterFlows(result);
      }
    };
    buildFilterFlows();
    return () => {
      mounted = false;
    };
  }, [model, flows]);
  const flowKeys = filterFlows.map((flow) => flow.key);
  if (flowKeys.length === 0) {
    return React.createElement(Empty, { description: '\u6CA1\u6709\u53EF\u7528\u7684\u6D41\u7A0B' });
  }
  // 如果expandAll为true，则默认展开所有面板
  const defaultActiveKey = expandAll ? flowKeys : undefined;
  return React.createElement(
    Card,
    { title: 'Flows\u8BBE\u7F6E' },
    React.createElement(
      Collapse,
      { defaultActiveKey: defaultActiveKey },
      flowKeys.map((flowKey) =>
        React.createElement(
          Panel,
          { header: flows.get(flowKey)?.title || flowKey, key: flowKey },
          React.createElement(FlowSettings, { model: model, flowKey: flowKey }),
        ),
      ),
    ),
  );
});
export default FlowsSettingsContent;
//# sourceMappingURL=FlowsSettingsContent.js.map
