/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button } from 'antd';
import React from 'react';
import { withFlowDesignMode } from './withFlowDesignMode';
const FlowSettingsButtonCore = (props) => {
  return React.createElement(Button, {
    ...props,
    type: 'dashed',
    style: {
      ...props.style,
      borderColor: 'var(--colorSettings)',
      color: 'var(--colorSettings)',
      alignSelf: 'flex-start',
    },
  });
};
export const FlowSettingsButton = withFlowDesignMode(FlowSettingsButtonCore);
FlowSettingsButton.displayName = 'FlowSettingsButton';
//# sourceMappingURL=FlowSettingsButton.js.map
