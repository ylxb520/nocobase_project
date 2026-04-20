/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import {
  ActionModel,
  ActionSceneEnum,
  CollectionActionGroupModel,
  FormActionGroupModel,
  RecordActionGroupModel,
} from '@nocobase/client';
import { escapeT } from '@nocobase/flow-engine';
import { isHide } from '../../built-in/utils';
import { AIEmployeeListItem } from '../../AIEmployeeListItem';
import { AIEmployeeShortcutModel } from './AIEmployeeShortcutModel';
export class AIEmployeeButtonModel extends AIEmployeeShortcutModel {
  constructor(options) {
    super(options);
    this.props = {
      ...this.props,
      style: {
        size: 40,
        mask: false,
      },
    };
  }
}
export class AIEmployeeActionModel extends ActionModel {
  static scene = ActionSceneEnum.all;
  static async defineChildren(ctx) {
    const aiEmployees = await ctx.aiConfigRepository.getAIEmployees();
    return aiEmployees
      ?.filter((aiEmployee) => !isHide(aiEmployee))
      .map((aiEmployee) => ({
        key: aiEmployee.username,
        label: React.createElement(AIEmployeeListItem, { aiEmployee: aiEmployee }),
        createModelOptions: {
          use: 'AIEmployeeButtonModel',
          props: {
            aiEmployee: {
              username: aiEmployee.username,
            },
            context: {
              workContext: [{ type: 'flow-model', uid: ctx.model.uid }],
            },
            auto: false,
          },
        },
      }));
  }
}
AIEmployeeActionModel.define({
  label: escapeT('AI employees'),
  sort: 8000,
});
CollectionActionGroupModel.registerActionModels({
  AIEmployeeActionModel,
});
RecordActionGroupModel.registerActionModels({
  AIEmployeeActionModel,
});
FormActionGroupModel.registerActionModels({
  AIEmployeeActionModel,
});
//# sourceMappingURL=AIEmployeeActionModel.js.map
