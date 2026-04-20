import { SchemaToolbar } from '@nocobase/client';
import React from 'react';
import { stepsFormStepTitleSettings } from './settings';
export function StepsStepTitleToolbar() {
  return React.createElement(SchemaToolbar, {
    draggable: true,
    initializer: false,
    settings: stepsFormStepTitleSettings.name,
  });
}
//# sourceMappingURL=StepsStepTitleToolbar.js.map
