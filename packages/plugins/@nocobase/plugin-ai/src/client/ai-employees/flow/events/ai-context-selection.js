/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { BlockModel } from '@nocobase/client';
import { aiSelection } from '../../stores/ai-selection';
import classNames from 'classnames';
import { contextAware } from '../../stores/context-aware';
import { dialogController } from '../../stores/dialog-controller';
const getAwareModels = (ctx, model) => {
  if (!model) {
    return [];
  }
  return model.filterSubModels('shortcuts', (model) => {
    const tasks = model.props.tasks;
    if (!tasks?.length) {
      return false;
    }
    for (const task of tasks) {
      const workContext = task.message.workContext || [];
      for (const context of workContext) {
        const target = context.type.startsWith('flow-model') && context.uid === ctx.model.uid;
        if (target) {
          return true;
        }
      }
    }
    return false;
  });
};
BlockModel.registerFlow({
  key: 'aiOnSelectSettings',
  steps: {
    aiOnSelect: {
      handler(ctx, params) {
        const { className, onClick, onMouseEnter, onMouseLeave } = ctx.model.decoratorProps;
        const model = ctx.engine.getModel(`ai-shortcuts-${ctx.route.params.name}`);
        ctx.model.setDecoratorProps({
          className: classNames('ai-selectable', className),
          ['data-uid']: ctx.model.uid,
          onClick: (e) => {
            onClick?.(e);
            if (!aiSelection.selectable) {
              return;
            }
            aiSelection.selector?.onSelect({ uid: ctx.model.uid });
            aiSelection.stopSelect();
            dialogController.resume();
          },
          onMouseEnter: (e) => {
            onMouseEnter?.(e);
            if (!model) {
              return;
            }
            const awareModels = getAwareModels(ctx, model);
            awareModels.forEach((subModel) => {
              subModel.setProps('showNotice', true);
            });
            contextAware.setAIEmployees(awareModels.map((model) => model.props.aiEmployee));
          },
          onMouseLeave: (e) => {
            onMouseLeave?.(e);
            const awareModels = getAwareModels(ctx, model);
            awareModels.forEach((subModel) => {
              subModel.setProps('showNotice', false);
            });
            contextAware.setAIEmployees([]);
          },
        });
      },
    },
  },
});
//# sourceMappingURL=ai-context-selection.js.map
