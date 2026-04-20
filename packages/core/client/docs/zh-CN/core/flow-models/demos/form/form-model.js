import { FormButtonGroup, FormDialog, Submit } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { FlowEngineProvider, FlowModel, FlowModelRenderer, SingleRecordResource } from '@nocobase/flow-engine';
import { Card } from 'antd';
import React from 'react';
import { api } from '../table/api';
export class FormModel extends FlowModel {
  form;
  resource;
  collection;
  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        FormProvider,
        { form: this.form },
        this.mapSubModels('fields', (field) => React.createElement(FlowModelRenderer, { model: field })),
        React.createElement(
          FormButtonGroup,
          null,
          this.mapSubModels('actions', (action) => React.createElement(FlowModelRenderer, { model: action })),
        ),
        React.createElement('br', null),
        React.createElement(Card, null, React.createElement('pre', null, JSON.stringify(this.form.values, null, 2))),
      ),
    );
  }
  async openDialog({ filterByTk }) {
    return new Promise((resolve) => {
      const dialog = FormDialog(
        {
          footer: null,
          title: 'Form Dialog',
        },
        (form) => {
          return React.createElement(
            'div',
            null,
            React.createElement(
              FlowEngineProvider,
              { engine: this.flowEngine },
              React.createElement(FlowModelRenderer, { model: this, inputArgs: { form, filterByTk } }),
              React.createElement(
                FormButtonGroup,
                null,
                React.createElement(
                  Submit,
                  {
                    onClick: async () => {
                      await this.resource.save(this.form.values);
                      dialog.close();
                      resolve(this.form.values); // 在 close 之后 resolve
                    },
                  },
                  'Submit',
                ),
              ),
            ),
          );
        },
      );
      dialog.open();
      // 可选：如果需要在取消时也 resolve，可以监听 dialog 的 onCancel
    });
  }
}
FormModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      async handler(ctx, params) {
        ctx.model.form = ctx.inputArgs.form || createForm();
        if (ctx.model.collection) {
          return;
        }
        ctx.model.collection = ctx.dsm.getCollection(params.dataSourceKey, params.collectionName);
        const resource = new SingleRecordResource();
        resource.setDataSourceKey(params.dataSourceKey);
        resource.setResourceName(params.collectionName);
        resource.setAPIClient(api);
        ctx.model.resource = resource;
        if (ctx.inputArgs.filterByTk) {
          resource.setFilterByTk(ctx.inputArgs.filterByTk);
          await resource.refresh();
          ctx.model.form.setInitialValues(resource.getData());
        }
      },
    },
  },
});
//# sourceMappingURL=form-model.js.map
