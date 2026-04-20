/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { vi } from 'vitest';
import { FlowEngine } from '../../flowEngine';
import { FlowModel } from '../flowModel';
import { ForkFlowModel } from '../forkFlowModel';
import { uid } from 'uid/secure';
// Helper functions
const createMockFlowEngine = () => {
  return new FlowEngine();
};
const createMockFlowModel = (overrides = {}) => {
  const flowEngine = createMockFlowEngine();
  const options = {
    uid: 'test-master-uid',
    flowEngine,
    props: { masterProp: 'masterValue' },
    stepParams: { testFlow: { step1: { param1: 'value1' } } },
    sortIndex: 0,
    subModels: {},
    async: false,
    ...overrides,
  };
  const model = new FlowModel(options);
  return model;
};
// Test setup
let mockMaster;
let initialProps;
beforeEach(() => {
  mockMaster = createMockFlowModel();
  initialProps = { forkProp: 'forkValue' };
  vi.clearAllMocks();
});
describe('ForkFlowModel', () => {
  // ==================== CONSTRUCTOR & INITIALIZATION ====================
  describe('Constructor & Initialization', () => {
    test('should create fork with basic parameters', () => {
      const fork = new ForkFlowModel(mockMaster, initialProps, '1');
      expect(fork.uid).toBe(mockMaster.uid);
      expect(fork.localProps).toEqual(initialProps);
      expect(fork.isFork).toBe(true);
      expect(fork.master).toBe(mockMaster);
      expect(fork.disposed).toBe(false);
    });
    test('should create fork with default parameters', () => {
      const fork = new ForkFlowModel(mockMaster);
      expect(fork.uid).toBe(mockMaster.uid);
      expect(fork.localProps).toEqual({});
      expect(fork.isFork).toBe(true);
    });
    test('should return Proxy object', () => {
      const fork = new ForkFlowModel(mockMaster, initialProps);
      // Verify it's a Proxy by checking transparent property access
      expect(typeof fork).toBe('object');
      expect(fork.constructor).toBe(mockMaster.constructor);
    });
  });
  // ==================== HIDDEN STATE ====================
  describe('Hidden State', () => {
    test('should initialize hidden from master', () => {
      mockMaster.hidden = true;
      const fork = new ForkFlowModel(mockMaster);
      expect(fork.hidden).toBe(true);
    });
    test('should keep hidden independent between master and fork', () => {
      mockMaster.hidden = true;
      const fork = new ForkFlowModel(mockMaster);
      // initial copy from master
      expect(fork.hidden).toBe(true);
      // change fork.hidden should not affect master
      fork.hidden = false;
      expect(fork.hidden).toBe(false);
      expect(mockMaster.hidden).toBe(true);
      // change master.hidden should not affect existing fork
      mockMaster.hidden = false;
      expect(mockMaster.hidden).toBe(false);
      expect(fork.hidden).toBe(false);
      // toggle master again; fork remains unchanged
      mockMaster.hidden = true;
      expect(mockMaster.hidden).toBe(true);
      expect(fork.hidden).toBe(false);
    });
  });
  // ==================== PROXY GET MECHANISM ====================
  describe('Proxy Get Mechanism', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, initialProps, '1');
    });
    test('should return disposed status correctly', () => {
      expect(fork['disposed']).toBe(false);
      fork.dispose();
      expect(fork['disposed']).toBe(true);
    });
    test('should return master constructor for constructor property', () => {
      expect(fork.constructor).toBe(mockMaster.constructor);
      expect(fork.constructor).toBe(FlowModel);
    });
    test('should merge props from master and local', () => {
      const masterProps = { masterProp: 'masterValue', shared: 'master' };
      const localProps = { localProp: 'localValue', shared: 'local' };
      mockMaster.getProps = vi.fn(() => masterProps);
      fork.localProps = localProps;
      const mergedProps = fork.props;
      expect(mergedProps).toEqual({
        masterProp: 'masterValue',
        localProp: 'localValue',
        shared: 'local', // Local should override master
      });
    });
    test('should return fork own properties first', () => {
      expect(fork.uid).toBe(mockMaster.uid);
      expect(fork.forkId).toBe('1');
      expect(fork.isFork).toBe(true);
      expect(fork.localProps).toEqual(initialProps);
    });
    test('should access local properties storage', () => {
      // Set a local property directly
      fork.localCustomProp = 'localValue';
      expect(fork.localCustomProp).toBe('localValue');
    });
    test('should fallback to master properties', () => {
      // Access master property that doesn\'t exist on fork
      const masterStepParams = mockMaster.stepParams;
      expect(fork.stepParams).toBe(masterStepParams);
    });
    test('should bind functions to fork instance', () => {
      const testMethod = vi.fn(function () {
        return this.uid;
      });
      mockMaster.testMethod = testMethod;
      const result = fork.testMethod();
      expect(testMethod).toHaveBeenCalled();
      expect(result).toBe(fork.uid);
    });
    test('should preserve master constructor in function context', () => {
      const testMethod = vi.fn(function () {
        return this.constructor;
      });
      mockMaster.testMethod = testMethod;
      const result = fork.testMethod();
      expect(result).toBe(mockMaster.constructor);
    });
    test('should pass arguments to bound functions', () => {
      const testMethod = vi.fn((arg1, arg2) => `${arg1}-${arg2}`);
      mockMaster.testMethod = testMethod;
      const result = fork.testMethod('test', 123);
      expect(testMethod).toHaveBeenCalledWith('test', 123);
      expect(result).toBe('test-123');
    });
    test('should handle non-function master properties', () => {
      mockMaster.masterData = { key: 'value' };
      expect(fork.masterData).toEqual({ key: 'value' });
    });
    test('should handle undefined master properties', () => {
      expect(fork.nonExistentProperty).toBeUndefined();
    });
    test('should create correct context object for functions', () => {
      const contextChecker = vi.fn(function () {
        return {
          hasConstructor: 'constructor' in this,
          constructorValue: this.constructor,
          isConfigurable: Object.getOwnPropertyDescriptor(this, 'constructor')?.configurable,
          isEnumerable: Object.getOwnPropertyDescriptor(this, 'constructor')?.enumerable,
          isWritable: Object.getOwnPropertyDescriptor(this, 'constructor')?.writable,
        };
      });
      mockMaster.contextChecker = contextChecker;
      const result = fork.contextChecker();
      expect(result.hasConstructor).toBe(true);
      expect(result.constructorValue).toBe(mockMaster.constructor);
      expect(result.isConfigurable).toBe(true);
      expect(result.isEnumerable).toBe(false);
      expect(result.isWritable).toBe(false);
    });
  });
  // ==================== PROXY SET MECHANISM ====================
  describe('Proxy Set Mechanism', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, initialProps);
    });
    test('should ignore setting props property', () => {
      const originalProps = fork.props;
      fork.props = { newProp: 'newValue' };
      // Props should remain unchanged since set returns true but doesn't actually set
      expect(fork.props).toEqual(originalProps);
    });
    test('should set fork own properties directly', () => {
      fork.localProps = { newLocal: 'value' };
      expect(fork.localProps).toEqual({ newLocal: 'value' });
    });
    test('should sync shared properties to master', () => {
      const newStepParams = { newFlow: { newStep: { param: 'value' } } };
      fork.stepParams = newStepParams;
      expect(mockMaster.stepParams).toEqual(newStepParams);
    });
    test('should store non-shared properties locally', () => {
      const customValue = { data: 'localData' };
      fork.customProperty = customValue;
      expect(fork.customProperty).toBe(customValue);
      expect(mockMaster.customProperty).toBeUndefined();
    });
    test('should call master setter for shared properties', () => {
      const setterSpy = vi.fn();
      // Mock a setter on master
      Object.defineProperty(mockMaster, 'sortIndex', {
        get: () => 0,
        set: setterSpy,
        configurable: true,
      });
      fork.sortIndex = 5;
      expect(setterSpy).toHaveBeenCalledWith(5);
    });
    test('should handle shared property without setter', () => {
      // stepParams should be a shared property without custom setter
      const newParams = { flow: { step: { param: 'test' } } };
      fork.stepParams = newParams;
      expect(mockMaster.stepParams).toEqual(newParams);
    });
    test('should identify shared properties correctly', () => {
      const originalSharedProps = ForkFlowModel.getSharedProperties();
      expect(originalSharedProps).toContain('stepParams');
      expect(originalSharedProps).toContain('sortIndex');
    });
    test('should handle property descriptor lookup', () => {
      // Create a property with descriptor on master
      Object.defineProperty(mockMaster, 'testDescriptor', {
        get: () => 'test',
        set: vi.fn(),
        configurable: true,
      });
      const fork = new ForkFlowModel(mockMaster, initialProps);
      // Since testDescriptor is not a shared property, our fix now makes
      // non-shared properties also check for setters and call them if they exist
      fork.testDescriptor = 'newValue';
      // With our fix, the setter should be called even for non-shared properties
      const descriptor = Object.getOwnPropertyDescriptor(mockMaster, 'testDescriptor');
      expect(descriptor?.set).toHaveBeenCalledWith('newValue');
    });
    test('should handle non-existent property descriptors', () => {
      ForkFlowModel.setSharedProperties(['nonExistentProp']);
      // Should not throw when setting property without descriptor
      expect(() => {
        fork.nonExistentProp = 'value';
      }).not.toThrow();
      expect(mockMaster.nonExistentProp).toBe('value');
    });
  });
  // ==================== SHARED PROPERTIES MANAGEMENT ====================
  describe('Shared Properties Management', () => {
    test('should set shared properties configuration', () => {
      const newSharedProps = ['customProp1', 'customProp2'];
      ForkFlowModel.setSharedProperties(newSharedProps);
      expect(ForkFlowModel.getSharedProperties()).toEqual(newSharedProps);
    });
    test('should get current shared properties', () => {
      const currentProps = ForkFlowModel.getSharedProperties();
      expect(Array.isArray(currentProps)).toBe(true);
      expect(currentProps.length).toBeGreaterThan(0);
    });
    test('should have default shared properties', () => {
      // Reset to defaults
      ForkFlowModel.setSharedProperties(['stepParams', 'sortIndex']);
      const defaultProps = ForkFlowModel.getSharedProperties();
      expect(defaultProps).toContain('stepParams');
      expect(defaultProps).toContain('sortIndex');
    });
    test('should identify shared property correctly', () => {
      ForkFlowModel.setSharedProperties(['testProp']);
      const fork = new ForkFlowModel(mockMaster, initialProps);
      // Use private method indirectly through property setting behavior
      fork.testProp = 'value';
      expect(mockMaster.testProp).toBe('value');
    });
    test('should identify non-shared property correctly', () => {
      ForkFlowModel.setSharedProperties(['onlyThisProp']);
      const fork = new ForkFlowModel(mockMaster, initialProps);
      fork.nonSharedProp = 'value';
      expect(fork.nonSharedProp).toBe('value');
      expect(mockMaster.nonSharedProp).toBeUndefined();
    });
  });
  // ==================== PROPS MANAGEMENT ====================
  describe('Props Management', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, { initial: 'value' });
    });
    test('should set props with string key-value', () => {
      fork.setProps('newKey', 'newValue');
      expect(fork.localProps.newKey).toBe('newValue');
      expect(fork.localProps.initial).toBe('value'); // Should preserve existing
    });
    test('should set props with object', () => {
      const newProps = { prop1: 'value1', prop2: 'value2' };
      fork.setProps(newProps);
      expect(fork.localProps).toEqual({
        initial: 'value',
        prop1: 'value1',
        prop2: 'value2',
      });
    });
    test('should merge props correctly', () => {
      fork.setProps({ existing: 'updated', new: 'added' });
      expect(fork.localProps).toEqual({
        initial: 'value',
        existing: 'updated',
        new: 'added',
      });
    });
    test('should clear local props with clearProps', () => {
      const masterProps = { master: 'value', conflict: 'master' };
      mockMaster.getProps = vi.fn(() => masterProps);
      // 先设置一些本地属性
      fork.setProps({ local: 'v', conflict: 'local' });
      expect(fork.localProps).toEqual({ initial: 'value', local: 'v', conflict: 'local' });
      // 调用 clearProps，应当返回一个空对象
      const result = fork.clearProps();
      expect(result).toStrictEqual({});
      expect(fork.localProps).toStrictEqual({});
      // 清空后，合并的 props 应回退为仅 master 的 props
      expect(fork.getProps()).toEqual(masterProps);
      expect(fork.props).toEqual(masterProps);
    });
    test('should get merged props from master and local', () => {
      const masterProps = { master: 'value', shared: 'master' };
      const localProps = { local: 'value', shared: 'local' };
      mockMaster.getProps = vi.fn(() => masterProps);
      fork.localProps = localProps;
      const result = fork.getProps();
      expect(result).toEqual({
        master: 'value',
        local: 'value',
        shared: 'local', // Local should override
      });
    });
    test('should maintain local props independence', () => {
      const originalProps = { ...fork.localProps };
      fork.setProps('newKey', 'newValue');
      expect(fork.localProps.newKey).toBe('newValue');
      expect(originalProps).not.toHaveProperty('newKey');
    });
    test('should ignore setProps when disposed', () => {
      fork.dispose();
      const originalProps = { ...fork.localProps };
      fork.setProps('shouldIgnore', 'value');
      expect(fork.localProps).toEqual(originalProps);
    });
    test('should handle props priority in getter', () => {
      mockMaster.getProps = vi.fn(() => ({
        masterOnly: 'master',
        conflict: 'master',
      }));
      fork.localProps = {
        localOnly: 'local',
        conflict: 'local',
      };
      const merged = fork.props;
      expect(merged.masterOnly).toBe('master');
      expect(merged.localOnly).toBe('local');
      expect(merged.conflict).toBe('local'); // Local wins
    });
    test('should handle nested object props', () => {
      const nestedProps = {
        user: { name: 'John', settings: { theme: 'dark' } },
        config: { debug: true },
      };
      fork.setProps(nestedProps);
      expect(fork.localProps.user).toEqual(nestedProps.user);
      expect(fork.localProps.config).toEqual(nestedProps.config);
    });
  });
  // ==================== CONTEXT AND SHARED STATE ====================
  describe('Context and Shared State', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, initialProps);
    });
    test('should set shared context', () => {
      const contextData = { key1: 'value1', key2: 'value2' };
      // Set context properties on the master model first
      mockMaster.context.defineProperty('key1', { value: contextData.key1 });
      mockMaster.context.defineProperty('key2', { value: contextData.key2 });
      // Check that the context properties are accessible through fork
      expect(fork.context.key1).toEqual('value1');
      expect(fork.context.key2).toEqual('value2');
    });
    test('should merge shared context', () => {
      // Set initial context properties on master
      mockMaster.context.defineProperty('initial', { value: 'original' });
      // Update the property on master
      mockMaster.context.defineProperty('initial', { value: 'updated' });
      mockMaster.context.defineProperty('additional', { value: 'data' });
      // Check that context properties are merged correctly
      expect(fork.context.initial).toEqual('updated');
      expect(fork.context.additional).toEqual('data');
    });
    test('should get ctx with globals and shared', () => {
      // Set shared property on master
      mockMaster.context.defineProperty('shared', { value: 'data' });
      const ctx = fork.context;
      // Check that shared properties are accessible through ctx
      expect(ctx.shared).toEqual('data');
      // Verify that fork has its own context instance
      expect(ctx).toBeDefined();
      expect(ctx).toBeInstanceOf(Object);
    });
  });
  // ==================== RENDER MECHANISM ====================
  describe('Render Mechanism', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, { localStyle: 'local' });
    });
    test('should render with merged props', () => {
      const masterProps = { masterStyle: 'master', shared: 'master' };
      const expectedMerged = {
        masterStyle: 'master',
        localStyle: 'local',
        shared: 'local',
      };
      mockMaster.getProps = vi.fn(() => masterProps);
      fork.localProps = { localStyle: 'local', shared: 'local' };
      mockMaster.render = vi.fn(function () {
        return { type: 'div', props: this.props };
      });
      const result = fork.render();
      expect(mockMaster.render).toHaveBeenCalled();
      expect(result.props).toEqual(expectedMerged);
    });
    test('should call master render with fork as this', () => {
      let renderThis;
      mockMaster.render = vi.fn(function () {
        renderThis = this;
        return { type: 'span', props: this.props };
      });
      fork.render();
      expect(renderThis).toBe(fork);
      expect(renderThis.isFork).toBe(true);
    });
    // TODO: This test case indicates a bug? even it is passing... we should not restore!
    // test('should restore original props after render', () => {
    //   const originalProps = fork.props;
    //   mockMaster.render = vi.fn(function(this: any) {
    //     // Modify props during render
    //     this.props = { modified: 'during-render' };
    //     return { type: 'div', props: this.props };
    //   });
    //   fork.render();
    //   // Props should be restored
    //   expect(fork.props).toEqual(originalProps);
    // });
    test('should return null when disposed', () => {
      mockMaster.render = vi.fn();
      fork.dispose();
      const result = fork.render();
      expect(result).toBeNull();
      expect(mockMaster.render).not.toHaveBeenCalled();
    });
    test('should handle render exceptions gracefully', () => {
      mockMaster.render = vi.fn(() => {
        throw new Error('Render error');
      });
      expect(() => fork.render()).toThrow('Render error');
    });
  });
  // ==================== LIFECYCLE MANAGEMENT ====================
  describe('Lifecycle Management', () => {
    let fork;
    beforeEach(() => {
      mockMaster = createMockFlowModel();
      mockMaster.forks = new Set();
      mockMaster.forkCache = new Map();
      fork = new ForkFlowModel(mockMaster, initialProps);
      mockMaster.forks.add(fork);
    });
    test('should dispose and change status', () => {
      expect(fork['disposed']).toBe(false);
      fork.dispose();
      expect(fork['disposed']).toBe(true);
    });
    test('should remove from master forks collection', () => {
      expect(mockMaster.forks.has(fork)).toBe(true);
      fork.dispose();
      expect(mockMaster.forks.has(fork)).toBe(false);
    });
    test('should remove from master fork cache', () => {
      const cacheKey = 'testKey';
      mockMaster.forkCache.set(cacheKey, fork);
      fork.dispose();
      expect(mockMaster.forkCache.has(cacheKey)).toBe(false);
    });
    test('should handle dispose when already disposed', () => {
      fork.dispose();
      // Should not throw on second dispose
      expect(() => fork.dispose()).not.toThrow();
      expect(fork['disposed']).toBe(true);
    });
    test('should find and remove correct fork from cache', () => {
      const fork1 = new ForkFlowModel(mockMaster, {}, '1');
      const fork2 = new ForkFlowModel(mockMaster, {}, '2');
      mockMaster.forkCache.set('key1', fork1);
      mockMaster.forkCache.set('key2', fork2);
      fork1.dispose();
      expect(mockMaster.forkCache.has('key1')).toBe(false);
      expect(mockMaster.forkCache.has('key2')).toBe(true);
    });
    test('forkIds must be unique', () => {
      // 创建第一个 fork
      const fork1 = mockMaster.createFork({}, uid());
      const forkId1 = fork1.forkId;
      expect(forkId1).toBeDefined();
      // 创建第二个 fork
      const fork2 = mockMaster.createFork({}, uid());
      expect(fork2.forkId).not.toBe(forkId1);
      // 销毁第一个 fork
      fork1.dispose();
      // 创建第三个 fork
      const fork3 = mockMaster.createFork({}, uid());
      expect(fork1['disposed']).toBe(true);
      expect(fork3.forkId).not.toBe(fork2.forkId);
    });
  });
  // ==================== FUNCTION BINDING AND CONTEXT ====================
  describe('Function Binding and Context', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, initialProps);
    });
    test('should bind master methods to fork instance', () => {
      const boundMethod = vi.fn(function () {
        return {
          uid: this.uid,
          isFork: this.isFork,
          forkId: this.forkId,
        };
      });
      mockMaster.boundMethod = boundMethod;
      const result = fork.boundMethod();
      expect(result.uid).toBe(fork.uid);
      expect(result.isFork).toBe(true);
      expect(result.forkId).toBe(fork.forkId);
    });
    test('should preserve constructor in bound method context', () => {
      const constructorChecker = vi.fn(function () {
        return this.constructor === mockMaster.constructor;
      });
      mockMaster.constructorChecker = constructorChecker;
      const result = fork.constructorChecker();
      expect(result).toBe(true);
    });
    test('should handle async methods correctly', async () => {
      const asyncMethod = vi.fn(async function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              uid: this.uid,
              constructor: this.constructor,
            });
          }, 0);
        });
      });
      mockMaster.asyncMethod = asyncMethod;
      const result = await fork.asyncMethod();
      expect(result.uid).toBe(fork.uid);
      expect(result.constructor).toBe(mockMaster.constructor);
    });
    test('should pass method arguments correctly', () => {
      const methodWithArgs = vi.fn(function (arg1, arg2, arg3) {
        return { arg1, arg2, arg3 };
      });
      mockMaster.methodWithArgs = methodWithArgs;
      const testObj = { test: 'object' };
      const result = fork.methodWithArgs('test', 123, testObj);
      expect(methodWithArgs).toHaveBeenCalledWith('test', 123, testObj);
      expect(result).toEqual({ arg1: 'test', arg2: 123, arg3: testObj });
    });
    test('should handle method return values correctly', () => {
      const methodWithReturn = vi.fn(() => ({ success: true, data: 'result' }));
      mockMaster.methodWithReturn = methodWithReturn;
      const result = fork.methodWithReturn();
      expect(result).toEqual({ success: true, data: 'result' });
    });
    test('should create correct context object properties', () => {
      const contextInspector = vi.fn(function () {
        const descriptor = Object.getOwnPropertyDescriptor(this, 'constructor');
        return {
          hasOwnConstructor: Object.prototype.hasOwnProperty.call(this, 'constructor'),
          constructorValue: this.constructor,
          descriptorExists: !!descriptor,
          configurable: descriptor?.configurable,
          enumerable: descriptor?.enumerable,
          writable: descriptor?.writable,
        };
      });
      mockMaster.contextInspector = contextInspector;
      const result = fork.contextInspector();
      expect(result.hasOwnConstructor).toBe(true);
      expect(result.constructorValue).toBe(mockMaster.constructor);
      expect(result.descriptorExists).toBe(true);
      expect(result.configurable).toBe(true);
      expect(result.enumerable).toBe(false);
      expect(result.writable).toBe(false);
    });
    test('should handle closure constructor capture', () => {
      // Create a method that captures constructor in closure
      let capturedConstructor;
      const closureMethod = function () {
        capturedConstructor = this.constructor;
        return this.constructor;
      };
      mockMaster.closureMethod = closureMethod;
      const result = fork.closureMethod();
      expect(capturedConstructor).toBe(mockMaster.constructor);
      expect(result).toBe(mockMaster.constructor);
    });
    test('should maintain correct this binding in nested calls', () => {
      const nestedMethod = vi.fn(function () {
        return this.uid;
      });
      const callerMethod = vi.fn(function () {
        return {
          directUid: this.uid,
          nestedUid: nestedMethod.call(this),
        };
      });
      mockMaster.nestedMethod = nestedMethod;
      mockMaster.callerMethod = callerMethod;
      const result = fork.callerMethod();
      expect(result.directUid).toBe(fork.uid);
      expect(result.nestedUid).toBe(fork.uid);
    });
  });
  // ==================== EDGE CASES AND ERROR HANDLING ====================
  describe('Edge Cases and Error Handling', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, initialProps);
    });
    test('should handle accessing non-existent properties', () => {
      const value = fork.totallyNonExistentProperty;
      expect(value).toBeUndefined();
    });
    test('should handle setting props property directly', () => {
      const originalProps = fork.props;
      // This should be ignored by the proxy
      fork.props = { ignored: 'value' };
      // Props should be accessed through the getter mechanism
      expect(fork.props).toEqual(originalProps);
    });
    test('should handle setProps with null/undefined values', () => {
      fork.setProps('nullProp', null);
      fork.setProps('undefinedProp', undefined);
      expect(fork.localProps.nullProp).toBeNull();
      expect(fork.localProps.undefinedProp).toBeUndefined();
    });
    test('should handle complex nested property access patterns', () => {
      // Set up complex nested structure
      mockMaster.nested = {
        deep: {
          property: {
            value: 'deep value',
          },
        },
      };
      expect(fork.nested.deep.property.value).toBe('deep value');
    });
  });
  // ==================== SETTER BEHAVIOR ====================
  describe('Setter Behavior', () => {
    let fork;
    beforeEach(() => {
      fork = new ForkFlowModel(mockMaster, initialProps);
    });
    describe('non-shared properties with setters', () => {
      test('should call master setter methods in fork instances', () => {
        // 直接在 master 上定义 setter
        let testValue = '';
        Object.defineProperty(mockMaster, 'customProperty', {
          get() {
            return testValue;
          },
          set(value) {
            testValue = `processed_${value}`;
          },
          configurable: true,
          enumerable: true,
        });
        // 在 fork 上设置属性应该调用 master 的 setter
        fork.customProperty = 'test_value';
        // 验证 setter 被正确调用（值被处理）
        expect(fork.customProperty).toBe('processed_test_value');
        expect(mockMaster.customProperty).toBe('processed_test_value');
      });
      test('should preserve this context in fork setter calls', () => {
        let setterContext = null;
        let testValue = '';
        Object.defineProperty(mockMaster, 'testProperty', {
          get() {
            return testValue;
          },
          set(value) {
            setterContext = this;
            testValue = value;
            // 验证 this 指向 fork 实例，而不是 master
            expect(this.isFork).toBe(true);
          },
          configurable: true,
          enumerable: true,
        });
        // 在 fork 上设置属性
        fork.testProperty = 'context_test';
        // 验证 setter 中的 this 指向 fork
        expect(setterContext).toBe(fork);
        expect(setterContext.isFork).toBe(true);
        expect(fork.testProperty).toBe('context_test');
      });
      test('should handle non-shared properties with setters correctly', () => {
        let nonSharedValue = 0;
        Object.defineProperty(mockMaster, 'nonSharedProperty', {
          get() {
            return nonSharedValue;
          },
          set(value) {
            nonSharedValue = value * 2;
          },
          configurable: true,
          enumerable: true,
        });
        // 设置非共享属性应该调用 setter
        fork.nonSharedProperty = 5;
        // 验证 setter 被调用且 this 指向正确
        expect(fork.nonSharedProperty).toBe(10); // 5 * 2
        // master 也应该受到影响，因为我们共享同一个变量
        expect(mockMaster.nonSharedProperty).toBe(10);
      });
      test('should fallback to local storage when no setter exists', () => {
        // 设置一个没有 setter 的属性
        fork.customNonSetterProperty = 'local_value';
        // 应该存储在 fork 的本地属性中
        expect(fork.customNonSetterProperty).toBe('local_value');
        // master 不应该有这个属性
        expect(mockMaster.customNonSetterProperty).toBeUndefined();
      });
    });
    describe('shared properties with setters', () => {
      test('should handle shared properties with setters', () => {
        // 临时修改 SHARED_PROPERTIES 来包含我们的测试属性
        const originalSharedProps = ForkFlowModel.getSharedProperties();
        ForkFlowModel.setSharedProperties([...originalSharedProps, 'sharedTestProperty']);
        try {
          let sharedValue = '';
          Object.defineProperty(mockMaster, 'sharedTestProperty', {
            get() {
              return sharedValue;
            },
            set(value) {
              sharedValue = `shared_${value}`;
            },
            configurable: true,
            enumerable: true,
          });
          // 设置共享属性应该调用 setter
          fork.sharedTestProperty = 'test';
          // 验证 setter 被调用
          expect(fork.sharedTestProperty).toBe('shared_test');
          expect(mockMaster.sharedTestProperty).toBe('shared_test');
        } finally {
          // 恢复原始的共享属性
          ForkFlowModel.setSharedProperties(originalSharedProps);
        }
      });
      test('should handle shared properties without setters', () => {
        // 临时修改 SHARED_PROPERTIES 来包含我们的测试属性
        const originalSharedProps = ForkFlowModel.getSharedProperties();
        ForkFlowModel.setSharedProperties([...originalSharedProps, 'plainSharedProperty']);
        try {
          // 设置共享属性（没有 setter）
          fork.plainSharedProperty = 'shared_value';
          // 应该直接设置在 master 上
          expect(mockMaster.plainSharedProperty).toBe('shared_value');
          expect(fork.plainSharedProperty).toBe('shared_value');
        } finally {
          // 恢复原始的共享属性
          ForkFlowModel.setSharedProperties(originalSharedProps);
        }
      });
    });
    describe('UploadEditableFieldModel scenario', () => {
      test('should handle customRequest setter like in UploadEditableFieldModel', () => {
        // 模拟 UploadEditableFieldModel 的 customRequest setter
        let customRequestValue = null;
        Object.defineProperty(mockMaster, 'customRequest', {
          set(fn) {
            customRequestValue = fn;
            // 模拟实际的 setter 逻辑
            console.log('customRequest setter called');
          },
          get() {
            return customRequestValue;
          },
          configurable: true,
          enumerable: true,
        });
        const testFunction = (fileData) => {
          console.log('custom request executed', fileData);
        };
        // 在 fork 上设置 customRequest 应该调用 master 的 setter
        fork.customRequest = testFunction;
        // 验证 setter 被调用，值被正确存储
        expect(mockMaster.customRequest).toBe(testFunction);
        expect(customRequestValue).toBe(testFunction);
        // 注意：由于 ForkFlowModel 的 get proxy 会重新绑定函数，
        // fork.customRequest 返回的是一个绑定的版本，但原始值正确存储了
        expect(typeof fork.customRequest).toBe('function');
      });
    });
  });
});
//# sourceMappingURL=forkFlowModel.test.js.map
