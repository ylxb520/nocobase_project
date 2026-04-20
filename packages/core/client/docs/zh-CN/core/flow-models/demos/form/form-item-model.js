import { FormItem, Input } from '@formily/antd-v5';
import { Field as FormilyField } from '@formily/react';
import { FlowModel } from '@nocobase/flow-engine';
import React from 'react';
export class FormItemModel extends FlowModel {
  field;
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(FormilyField, {
        name: this.field.name,
        title: this.field.title,
        required: true,
        decorator: [FormItem],
        component: [
          Input,
          {
            style: {
              width: 240,
            },
          },
        ],
      }),
    );
  }
}
FormItemModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      handler(ctx, params) {
        const field = ctx.dsm.getCollectionField(params.fieldPath);
        ctx.model.field = field;
      },
    },
  },
});
//# sourceMappingURL=form-item-model.js.map
