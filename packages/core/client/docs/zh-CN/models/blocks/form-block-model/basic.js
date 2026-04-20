import { Application, Plugin } from '@nocobase/client';
import { FlowModel, FlowModelRenderer } from '@nocobase/flow-engine';
import { Button, Form, Input, Table } from 'antd';
import React, { useEffect } from 'react';
class InputFieldModel extends FlowModel {
  render() {
    return React.createElement(Input, { ...this.props });
  }
}
function FieldModelRenderer(props) {
  const { model, id, value, onChange, ['aria-describedby']: ariaDescribedby, ...rest } = props;
  useEffect(() => {
    model.setProps({ id, value, onChange, ['aria-describedby']: ariaDescribedby });
  }, [model, id, value, ariaDescribedby, onChange]);
  return React.createElement(FlowModelRenderer, { model: model, ...rest });
}
export function SubTableField(props) {
  const { value = [], onChange, columns } = props;
  // 新增一行
  const handleAdd = () => {
    const newRow = {};
    columns.forEach((col) => (newRow[col.dataIndex] = ''));
    onChange?.([...(value || []), newRow]);
  };
  // 编辑单元格
  const handleCellChange = (rowIdx, dataIndex, cellValue) => {
    const newData = value.map((row, idx) => (idx === rowIdx ? { ...row, [dataIndex]: cellValue } : row));
    onChange?.(newData);
  };
  // 渲染可编辑单元格
  const editableColumns = columns.map((col) => ({
    ...col,
    render: (text, record, rowIdx) => {
      return col.render({
        id: `field-${col.dataIndex}-${rowIdx}`,
        value: text,
        onChange: (e) => handleCellChange(rowIdx, col.dataIndex, e.target.value),
        ['aria-describedby']: `field-${col.dataIndex}-${rowIdx}`,
      });
    },
  }));
  return React.createElement(
    Form.Item,
    null,
    React.createElement(Table, {
      dataSource: value,
      columns: editableColumns,
      rowKey: (row, idx) => idx,
      pagination: false,
    }),
    React.createElement(
      Button,
      { type: 'dashed', onClick: handleAdd, style: { marginTop: 8 } },
      '\u65B0\u589E\u4E00\u884C',
    ),
  );
}
class SubTableFieldModel extends FlowModel {
  render() {
    return React.createElement(SubTableField, {
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          model: this.subModels.field,
          render: (props) => {
            const fork = this.subModels.field.createFork({}, props.id);
            return React.createElement(FieldModelRenderer, { model: fork, ...props });
          },
        },
        // { title: '年龄', dataIndex: 'age' },
      ],
      ...this.props,
    });
  }
}
class FormBlockModel extends FlowModel {
  render() {
    return React.createElement(
      Form,
      { layout: 'vertical', initialValues: { arr: [{ name: '张三', age: 18 }] } },
      React.createElement(
        Form.Item,
        { label: '\u59D3\u540D', name: 'arr' },
        React.createElement(FieldModelRenderer, { model: this.subModels.field }),
      ),
    );
  }
}
class PluginHelloModel extends Plugin {
  async load() {
    // 注册 HelloModel 到 flowEngine
    this.flowEngine.registerModels({ FormBlockModel, SubTableFieldModel, InputFieldModel });
    // 创建 HelloModel 的实例（仅用于示例）
    const model = this.flowEngine.createModel({
      use: 'FormBlockModel',
      subModels: {
        field: {
          use: 'SubTableFieldModel',
          subModels: {
            field: {
              use: 'InputFieldModel',
            },
          },
        },
      },
    });
    // 添加路由，将模型渲染到根路径（仅用于示例）
    this.router.add('root', {
      path: '/',
      element: React.createElement(FlowModelRenderer, { model: model }),
    });
  }
}
// 创建应用实例，注册插件（仅用于示例）
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=basic.js.map
