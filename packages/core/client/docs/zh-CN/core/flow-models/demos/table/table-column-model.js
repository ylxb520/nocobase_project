import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { FlowModel, FlowModelRenderer, ModelRenderMode } from '@nocobase/flow-engine';
import { Space } from 'antd';
import React from 'react';
export class TableColumnModel extends FlowModel {
  // 标记该类 render 返回函数
  static renderMode = ModelRenderMode.RenderFunction;
  field;
  fieldPath;
  getColumnProps() {
    return { ...this.props, render: this.render() };
  }
  render() {
    return (value, record, index) =>
      React.createElement(
        'span',
        {
          className: css`
            .anticon {
              display: none;
            }
            &:hover {
              .anticon {
                display: inline-flex;
              }
            }
          `,
        },
        value,
        React.createElement(EditOutlined, {
          onClick: async () => {
            const model = this.createRootModel({
              use: 'FormModel',
              stepParams: {
                default: {
                  step1: {
                    dataSourceKey: 'main',
                    collectionName: 'users',
                  },
                },
              },
              subModels: {
                fields: [
                  {
                    use: 'FormItemModel',
                    stepParams: {
                      default: {
                        step1: {
                          fieldPath: this.fieldPath,
                        },
                      },
                    },
                  },
                ],
              },
            });
            await model.openDialog({ filterByTk: record.id });
            await this.parent.resource.refresh();
            this.flowEngine.removeModel(model.uid);
          },
        }),
      );
  }
}
export class TableColumnActionsModel extends TableColumnModel {
  static renderMode = ModelRenderMode.RenderFunction;
  getColumnProps() {
    return { title: 'Actions', ...this.props, render: this.render() };
  }
  render() {
    return (value, record, index) =>
      React.createElement(
        Space,
        null,
        this.mapSubModels('actions', (action) =>
          React.createElement(FlowModelRenderer, {
            key: action.uid,
            model: action.createFork({}, `${record.id || index}`),
            showFlowSettings: true,
            inputArgs: { record },
          }),
        ),
      );
  }
}
TableColumnModel.registerFlow({
  key: 'default',
  steps: {
    step1: {
      handler(ctx, params) {
        if (!params.fieldPath) {
          return;
        }
        if (ctx.model.field) {
          return;
        }
        const field = ctx.dsm.getCollectionField(params.fieldPath);
        ctx.model.fieldPath = params.fieldPath;
        ctx.model.setProps('title', field.title);
        ctx.model.setProps('dataIndex', field.name);
        ctx.model.field = field;
      },
    },
  },
});
//# sourceMappingURL=table-column-model.js.map
