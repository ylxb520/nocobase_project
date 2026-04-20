/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { DndProvider, DragHandler, Droppable, FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
export class AIEmployeeShortcutListModel extends FlowModel {
  isNewModel = false;
  render() {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: '8px',
        },
      },
      React.createElement(
        DndProvider,
        null,
        this.mapSubModels('shortcuts', (shortcut) => {
          return React.createElement(
            Droppable,
            { model: shortcut, key: shortcut.uid },
            React.createElement(FlowModelRenderer, {
              key: shortcut.uid,
              model: shortcut,
              showFlowSettings: !shortcut.props?.builtIn,
              extraToolbarItems: [
                {
                  key: 'drag-handler',
                  component: DragHandler,
                  sort: 1,
                },
              ],
            }),
          );
        }),
      ),
    );
  }
}
//# sourceMappingURL=AIEmployeeShortcutListModel.js.map
