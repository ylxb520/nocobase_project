/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { describe, expect, test, vi } from 'vitest';
import { FlowEngine } from '../../flowEngine';
import { FlowModel } from '../../models/flowModel';
describe('InstanceFlowRegistry', () => {
  function createModel() {
    const engine = new FlowEngine();
    class MyModel extends FlowModel {}
    engine.registerModels({ MyModel });
    return engine.createModel({ use: 'MyModel' });
  }
  test('saveFlow calls model.saveStepParams via FlowDefinition.save', async () => {
    const model = createModel();
    const saveStepParamsSpy = vi.spyOn(model, 'saveStepParams').mockResolvedValue(undefined);
    const flow = model.flowRegistry.addFlow('flow1', {
      title: 'Flow 1',
      steps: { s1: { title: 'S1' } },
    });
    await flow.save();
    expect(saveStepParamsSpy).toHaveBeenCalledTimes(1);
  });
  test('destroyFlow removes flow and calls model.saveStepParams', async () => {
    const model = createModel();
    const saveStepParamsSpy = vi.spyOn(model, 'saveStepParams').mockResolvedValue(undefined);
    const flow = model.flowRegistry.addFlow('toRemove', {
      title: 'Remove me',
      steps: {},
    });
    expect(model.flowRegistry.hasFlow('toRemove')).toBe(true);
    await flow.destroy();
    expect(saveStepParamsSpy).toHaveBeenCalledTimes(1);
    expect(model.flowRegistry.hasFlow('toRemove')).toBe(false);
  });
  test('moveStep reorders steps and persists', async () => {
    const model = createModel();
    const saveStepParamsSpy = vi.spyOn(model, 'saveStepParams').mockResolvedValue(undefined);
    const flow = model.flowRegistry.addFlow('reorder', {
      title: 'Reorder',
      steps: {
        a: { title: 'A' },
        b: { title: 'B' },
        c: { title: 'C' },
      },
    });
    await model.flowRegistry.moveStep('reorder', 'c', 'b');
    expect(saveStepParamsSpy).toHaveBeenCalledTimes(1);
    // Ensure integer sorts in new order
    expect(flow.getStep('a')?.serialize().sort).toBe(1);
    expect(flow.getStep('c')?.serialize().sort).toBe(2);
    expect(flow.getStep('b')?.serialize().sort).toBe(3);
  });
  test('getFlows returns Map and includes added flows', () => {
    const model = createModel();
    model.flowRegistry.addFlows({
      x: { title: 'X', steps: {} },
      y: { title: 'Y', steps: {} },
    });
    const flows = model.flowRegistry.getFlows();
    expect(flows).toBeInstanceOf(Map);
    expect(Array.from(flows.keys()).sort()).toEqual(['x', 'y']);
  });
});
//# sourceMappingURL=instanceFlowRegistry.test.js.map
