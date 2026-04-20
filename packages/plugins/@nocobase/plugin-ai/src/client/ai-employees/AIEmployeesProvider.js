/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useContext } from 'react';
import { AISelectionProvider } from './1.x/selector/AISelectorProvider';
import { AISettingsProvider } from './AISettingsProvider';
import { ChatBoxLayout } from './chatbox/ChatBoxLayout';
import { AISelection } from './AISelection';
import { AISelectionControl } from './AISelectionControl';
import { CurrentUserContext } from '@nocobase/client';
export const AIEmployeesProvider = (props) => {
  const currentUserCtx = useContext(CurrentUserContext);
  if (!currentUserCtx?.data?.data) {
    return React.createElement(React.Fragment, null, props.children);
  }
  return React.createElement(
    AISelectionProvider,
    null,
    React.createElement(
      AISettingsProvider,
      null,
      React.createElement(ChatBoxLayout, null, props.children),
      React.createElement(AISelection, null),
      React.createElement(AISelectionControl, null),
    ),
  );
};
//# sourceMappingURL=AIEmployeesProvider.js.map
