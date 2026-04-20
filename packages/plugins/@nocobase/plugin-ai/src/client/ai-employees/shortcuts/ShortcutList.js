/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AddSubModelButton, FlowModelRenderer } from '@nocobase/flow-engine';
import React, { useEffect } from 'react';
import { useShortcuts } from './useShortcuts';
import { useDesignable } from '@nocobase/client';
import { AIEmployeeListItem } from '../AIEmployeeListItem';
import { observer } from '@nocobase/flow-engine';
import { useAIConfigRepository } from '../../repositories/hooks/useAIConfigRepository';
import { isHide } from '../built-in/utils';
export const ShortcutList = observer(() => {
  const { designable } = useDesignable();
  const { model, builtIn } = useShortcuts();
  const designMode = designable && !builtIn;
  const hasShortcuts = model?.subModels?.shortcuts?.length > 0;
  const aiConfigRepository = useAIConfigRepository();
  const loading = aiConfigRepository.aiEmployeesLoading;
  const aiEmployees = aiConfigRepository.aiEmployees;
  useEffect(() => {
    aiConfigRepository.getAIEmployees();
  }, [aiConfigRepository]);
  return React.createElement(
    React.Fragment,
    null,
    hasShortcuts && React.createElement(FlowModelRenderer, { model: model }),
    !builtIn &&
      React.createElement(
        AddSubModelButton,
        {
          model: model,
          subModelKey: 'shortcuts',
          afterSubModelAdd: async () => {
            if (!model.isNewModel) {
              return;
            }
            await model.save();
            model.isNewModel = false;
          },
          items: async () => {
            return loading
              ? []
              : aiEmployees
                  ?.filter((aiEmployee) => !isHide(aiEmployee))
                  .map((aiEmployee) => ({
                    key: aiEmployee.username,
                    label: React.createElement(AIEmployeeListItem, { aiEmployee: aiEmployee }),
                    createModelOptions: {
                      use: 'AIEmployeeShortcutModel',
                      props: {
                        aiEmployee: {
                          username: aiEmployee.username,
                        },
                      },
                    },
                  }));
          },
        },
        React.createElement(Button, {
          icon: React.createElement(PlusOutlined, null),
          variant: 'dashed',
          color: 'default',
          style: {
            width: '48px',
            height: '48px',
            color: 'var(--colorSettings)',
            borderColor: 'var(--colorSettings)',
            background: 'transparent',
          },
        }),
      ),
  );
});
//# sourceMappingURL=ShortcutList.js.map
