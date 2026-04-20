import { RecursionField, useFieldSchema } from '@formily/react';
import { withDynamicSchemaProps, DndContext, FormV2 } from '@nocobase/client';
import React from 'react';
import { Steps } from './Steps';
import { AddStepButton } from './AddStepButton';
import { StepsFormContext, useStepsContext } from './context';
export const StepsForm = withDynamicSchemaProps(
  (props) => {
    const schema = useFieldSchema();
    const ctx = useStepsContext(props);
    return React.createElement(
      StepsFormContext.Provider,
      { value: ctx },
      React.createElement(
        'div',
        { style: { display: 'flex', overflow: 'auto' } },
        React.createElement(
          DndContext,
          {
            onDragEnd: (event) => {
              const { items } = ctx;
              const activeIndex = items.findIndex((x) => event.active?.id?.includes(x.name));
              const overIndex = items.findIndex((x) => event.over?.id?.includes(x.name));
              ctx.stepDragEnd(activeIndex, overIndex);
            },
          },
          React.createElement(Steps, { current: ctx.currentStep, items: ctx.items }),
        ),
        React.createElement(AddStepButton, { onClick: ctx.addStep }),
      ),
      React.createElement(
        'div',
        null,
        ctx.items.map((_, index) =>
          React.createElement(
            'div',
            {
              key: index,
              style: {
                visibility: index !== ctx.currentStep ? 'hidden' : 'visible',
                height: index !== ctx.currentStep ? 0 : 'auto',
                overflow: 'hidden',
              },
            },
            React.createElement(RecursionField, {
              name: `${index}.content`,
              schema: ctx.items[index]?.contentSchema,
              onlyRenderProperties: true,
            }),
          ),
        ),
        React.createElement(
          FormV2,
          { form: ctx.form },
          React.createElement(RecursionField, {
            schema: schema,
            onlyRenderProperties: true,
            filterProperties: (s) => {
              return s['x-component'] !== 'StepsForm.Step';
            },
          }),
        ),
      ),
    );
  },
  { displayName: 'StepsForm' },
);
StepsForm['Step'] = () => null;
//# sourceMappingURL=StepsForm.js.map
