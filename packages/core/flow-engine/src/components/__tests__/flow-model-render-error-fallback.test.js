/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import { App, ConfigProvider } from 'antd';
import { FlowEngine } from '../../flowEngine';
import { FlowModel, ModelRenderMode } from '../../models/flowModel';
import { FlowEngineProvider } from '../../provider';
import { FlowModelRenderer } from '../FlowModelRenderer';
// ---------------- Pure Mocks ----------------
// Intercept Dropdown (capture menu) and Modal.confirm (auto-confirm), stub others
const dropdownMenus = [];
vi.mock('antd', () => {
  const Dropdown = (props) => {
    globalThis.__lastDropdownMenu = props.menu;
    dropdownMenus.push(props.menu);
    return React.createElement('span', { 'data-testid': 'dropdown' }, props.children);
  };
  const Modal = {
    confirm: (opts) => {
      if (opts && typeof opts.onOk === 'function') {
        return opts.onOk();
      }
      return {};
    },
    error: vi.fn(),
  };
  const App = Object.assign(({ children }) => React.createElement(React.Fragment, null, children), {
    useApp: () => ({ message: { success: () => {}, error: () => {}, info: () => {} } }),
  });
  const ConfigProvider = ({ children }) => React.createElement(React.Fragment, null, children);
  const Button = (props) => React.createElement('button', props, props.children ?? 'Button');
  const Result = (props) => React.createElement('div', { 'data-testid': 'result' }, props.children ?? 'Result');
  const Collapse = Object.assign((props) => React.createElement('div', null, props.children ?? 'Collapse'), {
    Panel: (props) => React.createElement('div', null, props.children ?? 'Panel'),
  });
  const Space = ({ children }) => React.createElement('div', null, children);
  const FormItem = (props) => React.createElement('div', null, props.children ?? 'FormItem');
  const Form = Object.assign((props) => React.createElement('form', null, props.children ?? 'Form'), {
    Item: FormItem,
    useForm: () => [{ setFieldsValue: (_) => {} }],
  });
  const Input = (props) => React.createElement('input', props);
  Input.TextArea = (props) => React.createElement('textarea', props);
  const InputNumber = (props) => React.createElement('input', { ...props, type: 'number' });
  const Select = (props) => React.createElement('select', props);
  const Switch = (props) => React.createElement('input', { ...props, type: 'checkbox' });
  const Alert = (props) => React.createElement('div', { role: 'alert' }, props.message ?? 'Alert');
  const Skeleton = () => React.createElement('div', null, 'Skeleton');
  Skeleton.Button = (props) => React.createElement('div', null, 'Skeleton.Button');
  const Spin = (props) => React.createElement('div', null, props.children ?? 'Spin');
  const Typography = {
    Paragraph: ({ children }) => React.createElement('p', null, children ?? 'Paragraph'),
    Text: ({ children }) => React.createElement('span', null, children ?? 'Text'),
  };
  return {
    Dropdown,
    Modal,
    App,
    ConfigProvider,
    Button,
    Result,
    Typography,
    Collapse,
    Space,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Alert,
    Skeleton,
    Spin,
    theme: { useToken: () => ({}) },
  };
});
// ---------------- Helpers ----------------
const clickDeleteFromLastDropdown = async () => {
  await waitFor(() => {
    const menu = globalThis.__lastDropdownMenu;
    expect(menu).toBeTruthy();
  });
  const menu = globalThis.__lastDropdownMenu;
  menu.onClick?.({ key: 'delete' });
};
// ---------------- Tests ----------------
describe('Delete problematic model via FlowSettings menu', () => {
  beforeEach(() => {
    dropdownMenus.length = 0;
    globalThis.__lastDropdownMenu = undefined;
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  it('deletes a broken top-level model when rendering via FlowModelRenderer throws', async () => {
    class BrokenModel extends FlowModel {
      render() {
        throw new Error('boom-top');
      }
    }
    const engine = new FlowEngine();
    engine.flowSettings.forceEnable();
    engine.registerModels({ BrokenModel });
    const model = engine.createModel({ use: 'BrokenModel', uid: 'broken-top-2' });
    // satisfy FlowsFloatContextMenu styles
    model.context.defineProperty('themeToken', { value: { borderRadiusLG: 8 } });
    render(
      React.createElement(
        ConfigProvider,
        null,
        React.createElement(
          App,
          null,
          React.createElement(
            FlowEngineProvider,
            { engine: engine },
            React.createElement(FlowModelRenderer, { model: model, showFlowSettings: true, showErrorFallback: true }),
          ),
        ),
      ),
    );
    await clickDeleteFromLastDropdown();
    expect(engine.getModel(model.uid)).toBeUndefined();
  });
  it('deletes a broken child in array when child FlowModelRenderer throws', async () => {
    class ParentModel extends FlowModel {
      render() {
        const items = this.subModels.items || [];
        return React.createElement(
          'div',
          null,
          items.map((m) =>
            React.createElement(FlowModelRenderer, {
              key: m.uid,
              model: m,
              showFlowSettings: true,
              showErrorFallback: true,
            }),
          ),
        );
      }
    }
    class BrokenChild extends FlowModel {
      render() {
        throw new Error('boom-child');
      }
    }
    const engine = new FlowEngine();
    engine.flowSettings.forceEnable();
    engine.registerModels({ ParentModel, BrokenChild });
    const parent = engine.createModel({ use: 'ParentModel', uid: 'parent-3' });
    const child = engine.createModel({ use: 'BrokenChild', uid: 'child-3' });
    parent.addSubModel('items', child);
    // theme tokens
    parent.context.defineProperty('themeToken', { value: { borderRadiusLG: 8 } });
    child.context.defineProperty('themeToken', { value: { borderRadiusLG: 8 } });
    render(
      React.createElement(
        ConfigProvider,
        null,
        React.createElement(
          App,
          null,
          React.createElement(
            FlowEngineProvider,
            { engine: engine },
            React.createElement(FlowModelRenderer, { model: parent }),
          ),
        ),
      ),
    );
    await clickDeleteFromLastDropdown();
    expect(engine.getModel(child.uid)).toBeUndefined();
    const remain = parent.subModels.items || [];
    expect(remain.find((m) => m.uid === child.uid)).toBeUndefined();
  });
  it('deletes a renderFunction child when child FlowModelRenderer throws before returning fn', async () => {
    class ParentModel extends FlowModel {
      render() {
        const cells = this.subModels.cells || [];
        return React.createElement(
          'div',
          null,
          cells.map((m) =>
            React.createElement(FlowModelRenderer, {
              key: m.uid,
              model: m,
              showFlowSettings: true,
              showErrorFallback: true,
            }),
          ),
        );
      }
    }
    class RenderFnChild extends FlowModel {
      static renderMode = ModelRenderMode.RenderFunction;
      render() {
        throw new Error('boom-render-fn');
      }
    }
    const engine = new FlowEngine();
    engine.flowSettings.forceEnable();
    engine.registerModels({ ParentModel, RenderFnChild });
    const parent = engine.createModel({ use: 'ParentModel', uid: 'parent-4' });
    const child = engine.createModel({ use: 'RenderFnChild', uid: 'cell-4' });
    parent.addSubModel('cells', child);
    parent.context.defineProperty('themeToken', { value: { borderRadiusLG: 8 } });
    child.context.defineProperty('themeToken', { value: { borderRadiusLG: 8 } });
    render(
      React.createElement(
        ConfigProvider,
        null,
        React.createElement(
          App,
          null,
          React.createElement(
            FlowEngineProvider,
            { engine: engine },
            React.createElement(FlowModelRenderer, { model: parent }),
          ),
        ),
      ),
    );
    await clickDeleteFromLastDropdown();
    expect(engine.getModel(child.uid)).toBeUndefined();
    const remain = parent.subModels.cells || [];
    expect(remain.find((m) => m.uid === child.uid)).toBeUndefined();
  });
});
//# sourceMappingURL=flow-model-render-error-fallback.test.js.map
