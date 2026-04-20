import { FlowModel } from '@nocobase/flow-engine';
import { Button } from 'antd';
import React from 'react';
export class ActionModel extends FlowModel {
  set onClick(fn) {
    this.setProps('onClick', fn);
  }
  render() {
    return React.createElement(Button, { ...this.props }, this.props.title || 'Untitle');
  }
}
export class LinkActionModel extends ActionModel {
  render() {
    return React.createElement(Button, { type: 'link', ...this.props }, this.props.title || 'View');
  }
}
export class DeleteActionModel extends ActionModel {
  render() {
    return React.createElement(Button, { ...this.props }, this.props.title || 'Delete');
  }
}
ActionModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      uiSchema: {
        title: {
          type: 'string',
          title: '标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入标题',
          },
        },
      },
      handler(ctx, params) {
        ctx.model.setProps('title', params.title);
        ctx.model.onClick = (e) => {
          ctx.model.dispatchEvent('click', {
            event: e,
            record: ctx.inputArgs.record,
            ...ctx.inputArgs,
          });
        };
      },
    },
  },
});
LinkActionModel.registerFlow({
  key: 'event1',
  on: {
    eventName: 'click',
  },
  steps: {
    step1: {
      handler(ctx, params) {
        ctx.modal.confirm({
          title: `${ctx.inputArgs.record?.id}`,
          content: 'Are you sure you want to perform this action?',
          onOk: async () => {},
        });
      },
    },
  },
});
DeleteActionModel.registerFlow({
  key: 'event1',
  on: {
    eventName: 'click',
  },
  steps: {
    step1: {
      handler(ctx, params) {
        ctx.modal.confirm({
          title: `Selected Rows`,
          content: React.createElement('pre', null, JSON.stringify(ctx.inputArgs.resource?.getSelectedRows(), null, 2)),
          // onOk: async () => {},
        });
      },
    },
  },
});
//# sourceMappingURL=action-model.js.map
