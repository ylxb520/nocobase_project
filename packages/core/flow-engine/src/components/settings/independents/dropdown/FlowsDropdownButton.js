/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Alert, Button, Dropdown, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useFlowModelById } from '../../../../hooks';
import { shouldHideStepInSettings } from '../../../../utils';
import { observer } from '../../../../reactive';
// 判断是否是通过ID获取模型的props
const isModelByIdProps = (props) => {
  return 'uid' in props && 'modelClassName' in props && Boolean(props.uid) && Boolean(props.modelClassName);
};
/**
 * 可自定义的下拉菜单触发按钮组件
 * 支持两种使用方式：
 * 1. 直接提供model: <FlowsDropdownButton model={myModel} />
 * 2. 通过uid和modelClassName获取model: <FlowsDropdownButton uid="model1" modelClassName="MyModel" />
 *
 * 菜单结构：按flow分组显示steps
 */
export const FlowsDropdownButton = (props) => {
  if (isModelByIdProps(props)) {
    const { uid, modelClassName, ...restProps } = props;
    return React.createElement(FlowsDropdownButtonWithModelById, {
      uid: uid,
      modelClassName: modelClassName,
      ...restProps,
    });
  } else {
    const { model, ...restProps } = props;
    return React.createElement(FlowsDropdownButtonWithModel, { model: model, ...restProps });
  }
};
// 使用传入的model
const FlowsDropdownButtonWithModel = observer(
  ({
    model,
    text = '流程配置',
    icon = React.createElement(SettingOutlined, null),
    size = 'middle',
    type = 'default',
    disabled = false,
    showDropdownIcon = true,
    onClick,
    style,
    className,
  }) => {
    const handleClick = () => {
      onClick?.();
    };
    const handleMenuClick = useCallback(
      ({ key }) => {
        // key格式为 "flowKey:stepKey"
        const [flowKey, stepKey] = key.split(':');
        try {
          model.openFlowSettings({
            flowKey,
            stepKey,
          });
        } catch (error) {
          // 用户取消或出错
          console.log('配置弹窗已取消或出错:', error);
        }
      },
      [model],
    );
    if (!model) {
      return React.createElement(Alert, { message: '\u63D0\u4F9B\u7684\u6A21\u578B\u65E0\u6548', type: 'error' });
    }
    // 获取可配置的flows和steps
    const getConfigurableFlowsAndSteps = useCallback(async () => {
      try {
        // const ModelClass = model.constructor as typeof FlowModel;
        const flows = model.getFlows();
        const flowsArray = Array.from(flows.values());
        const result = await Promise.all(
          flowsArray.map(async (flow) => {
            const configurableSteps = await Promise.all(
              Object.entries(flow.steps).map(async ([stepKey, stepDefinition]) => {
                const actionStep = stepDefinition;
                // 支持静态与动态 hideInSettings
                if (await shouldHideStepInSettings(model, flow, actionStep)) {
                  return null;
                }
                // 从step获取uiSchema（如果存在）
                const stepUiSchema = actionStep.uiSchema || {};
                // 如果step使用了action，也获取action的uiSchema
                let actionUiSchema = {};
                if (actionStep.use) {
                  const action = model.getAction?.(actionStep.use);
                  if (action && action.uiSchema) {
                    actionUiSchema = action.uiSchema;
                  }
                }
                // 合并uiSchema，确保step的uiSchema优先级更高
                const mergedUiSchema = { ...actionUiSchema };
                // 将stepUiSchema中的字段合并到mergedUiSchema
                Object.entries(stepUiSchema).forEach(([fieldKey, schema]) => {
                  if (mergedUiSchema[fieldKey]) {
                    mergedUiSchema[fieldKey] = { ...mergedUiSchema[fieldKey], ...schema };
                  } else {
                    mergedUiSchema[fieldKey] = schema;
                  }
                });
                // 如果没有可配置的UI Schema，返回null
                if (Object.keys(mergedUiSchema).length === 0) {
                  return null;
                }
                return {
                  stepKey,
                  step: actionStep,
                  uiSchema: mergedUiSchema,
                  title: actionStep.title || stepKey,
                };
              }),
            ).then((steps) => steps.filter(Boolean));
            return configurableSteps.length > 0 ? { flow, steps: configurableSteps } : null;
          }),
        );
        return result.filter(Boolean);
      } catch (error) {
        console.warn('[FlowsDropdownButton] 获取可配置flows失败:', error);
        return [];
      }
    }, [model]);
    const [configurableFlowsAndSteps, setConfigurableFlowsAndSteps] = useState([]);
    useEffect(() => {
      let mounted = true;
      (async () => {
        const flows = await getConfigurableFlowsAndSteps();
        if (mounted) {
          setConfigurableFlowsAndSteps(flows);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [getConfigurableFlowsAndSteps]);
    // 构建菜单项
    const buildMenuItems = () => {
      const items = [];
      configurableFlowsAndSteps.forEach(({ flow, steps }) => {
        // 始终按flow分组显示
        items.push({
          key: `flow-group-${flow.key}`,
          label: flow.title || flow.key,
          type: 'group',
        });
        steps.forEach((stepInfo) => {
          items.push({
            key: `${flow.key}:${stepInfo.stepKey}`,
            icon: React.createElement(SettingOutlined, null),
            label: stepInfo.title,
          });
        });
      });
      return items;
    };
    const menuItems = buildMenuItems();
    const button = React.createElement(
      Button,
      {
        type: type,
        size: size,
        disabled: disabled,
        icon: icon,
        onClick: handleClick,
        style: style,
        className: className,
      },
      React.createElement(Space, null, text, showDropdownIcon && React.createElement(DownOutlined, null)),
    );
    // 如果没有可配置的flows，返回普通按钮
    if (configurableFlowsAndSteps.length === 0) {
      return button;
    }
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Dropdown,
        {
          menu: {
            items: menuItems,
            onClick: handleMenuClick,
          },
          trigger: ['click'],
          placement: 'bottomRight',
        },
        button,
      ),
    );
  },
);
// 通过useFlowModelById hook获取model
const FlowsDropdownButtonWithModelById = observer(
  ({
    uid,
    modelClassName,
    text = '流程配置',
    icon = React.createElement(SettingOutlined, null),
    size = 'middle',
    type = 'default',
    disabled = false,
    showDropdownIcon = true,
    onClick,
    style,
    className,
  }) => {
    const model = useFlowModelById(uid, modelClassName);
    if (!model) {
      return React.createElement(Alert, { message: `未找到ID为 ${uid} 的模型`, type: 'error' });
    }
    return React.createElement(FlowsDropdownButtonWithModel, {
      model: model,
      text: text,
      icon: icon,
      size: size,
      type: type,
      disabled: disabled,
      showDropdownIcon: showDropdownIcon,
      onClick: onClick,
      style: style,
      className: className,
    });
  },
);
//# sourceMappingURL=FlowsDropdownButton.js.map
