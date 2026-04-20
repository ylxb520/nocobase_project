/**
 * defaultShowCode: true
 * title: CreateFormModel - hidden 简明示例
 */
import {
  Application,
  CreateFormModel,
  FilterManager,
  FormFieldModel,
  FormGridModel,
  FormItemModel,
  FormSubmitActionModel,
  Plugin,
} from '@nocobase/client';
import { FlowEngineProvider, FlowModelRenderer } from '@nocobase/flow-engine';
import { APIClient } from '@nocobase/sdk';
import { Card, Switch } from 'antd';
import React from 'react';
class DemoPlugin extends Plugin {
  form;
  field;
  action;
  async load() {
    const api = new APIClient({
      baseURL: 'https://localhost:8000/api',
    });
    // 使用 enable，而非 forceEnable，确保页面开关可以关闭配置模式
    this.flowEngine.flowSettings.enable();
    this.flowEngine.context.defineProperty('api', { value: api });
    const dsm = this.flowEngine.context.dataSourceManager;
    dsm.getDataSource('main') || dsm.addDataSource({ key: 'main', displayName: 'Main' });
    dsm.getDataSource('main').addCollection({
      name: 'users',
      title: 'Users',
      filterTargetKey: 'id',
      fields: [
        { name: 'id', type: 'bigInt', title: 'ID' },
        { name: 'username', type: 'string', title: 'Username' },
      ],
    });
    this.flowEngine.registerModels({
      CreateFormModel,
      FormGridModel,
      FormItemModel,
      FormFieldModel,
      FormSubmitActionModel,
    });
    this.form = this.flowEngine.createModel({
      use: 'CreateFormModel',
      stepParams: { resourceSettings: { init: { dataSourceKey: 'main', collectionName: 'users' } } },
      subModels: {
        grid: {
          use: 'FormGridModel',
          subModels: {
            items: [
              {
                use: 'FormItemModel',
                stepParams: {
                  fieldSettings: { init: { dataSourceKey: 'main', collectionName: 'users', fieldPath: 'username' } },
                },
                subModels: {
                  field: {
                    use: 'FormFieldModel',
                    stepParams: {
                      fieldSettings: {
                        init: { dataSourceKey: 'main', collectionName: 'users', fieldPath: 'username' },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        actions: [{ use: 'FormSubmitActionModel', stepParams: { buttonSettings: { general: { title: 'Submit' } } } }],
      },
    });
    this.field = this.form.subModels.grid.subModels.items[0];
    this.action = this.form.subModels.actions[0];
    // 简单提供 filterManager，避免刷新流程绑定时报错
    this.form.context.defineProperty('filterManager', { value: new FilterManager(this.form) });
    const Page = () => {
      const [cfg, setCfg] = React.useState(false);
      const [hideBlock, setHideBlock] = React.useState(false);
      const [hideField, setHideField] = React.useState(false);
      const [hideAction, setHideAction] = React.useState(false);
      return React.createElement(
        'div',
        { style: { padding: 16 } },
        React.createElement(
          'div',
          null,
          React.createElement('span', null, '\u914D\u7F6E\u6A21\u5F0F'),
          React.createElement(Switch, {
            checked: cfg,
            onChange: (v) => {
              setCfg(v);
              v ? this.flowEngine.flowSettings.enable() : this.flowEngine.flowSettings.disable();
            },
          }),
        ),
        React.createElement(
          Card,
          { style: { marginTop: 12 }, title: '\u8868\u5355\u533A\u5757\uFF08Block\uFF09' },
          React.createElement(
            'div',
            { style: { marginBottom: 8 } },
            React.createElement('span', null, '\u9690\u85CF\u533A\u5757'),
            React.createElement(Switch, {
              checked: hideBlock,
              onChange: (v) => (setHideBlock(v), this.form.setHidden(v)),
            }),
          ),
          React.createElement(FlowModelRenderer, { model: this.form, showFlowSettings: true }),
        ),
        React.createElement(
          Card,
          { title: '\u5B57\u6BB5\u4E0E\u52A8\u4F5C\uFF08Field/Action\uFF09' },
          React.createElement(
            'div',
            { style: { marginBottom: 8 } },
            React.createElement('span', null, '\u9690\u85CF\u5B57\u6BB5 username'),
            React.createElement(Switch, {
              checked: hideField,
              onChange: (v) => (setHideField(v), this.field.setHidden(v)),
            }),
            React.createElement('span', null, '\u9690\u85CF\u52A8\u4F5C Submit'),
            React.createElement(Switch, {
              checked: hideAction,
              onChange: (v) => (setHideAction(v), this.action.setHidden(v)),
            }),
          ),
          React.createElement(FlowModelRenderer, { model: this.form, showFlowSettings: true }),
        ),
      );
    };
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowEngineProvider, { engine: this.flowEngine }, React.createElement(Page, null)),
    });
  }
}
export default new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [DemoPlugin],
}).getRootComponent();
//# sourceMappingURL=create-form.js.map
