import React from 'react';
import { Form } from '@formily/core';
type StepsFormContextProps = {
  isEdit: boolean;
  form: Form;
  items: Array<{
    title: string;
    contentSchema: any;
    uid: string;
    name: string;
    index?: number;
  }>;
  /** 当前步骤，从0开始 */
  currentStep: number;
  /** 总页数 */
  stepsCount: number;
  /** 设置当前步骤 */
  setCurrentStep: (currentStep: number) => void;
  /** 添加步骤 */
  addStep: () => void;
  /** 下一页 */
  nextStep: () => void;
  /** 上一页 */
  previousStep: () => void;
  /** 提交 */
  submit: () => void;
  /** 注册当前表单实例 */
  registerFormInstance: (params: { uid: string; form: Form }) => void;
  /** 删除某个步骤 */
  deleteStep: (name: string) => void;
  /** 变更步骤标标题 */
  changeStepTitle: (name: string, newTitle: string) => void;
  /**
   * 拖动排序
   * @param activeIndex 需要拖的步骤index
   * @param overIndex 放置的步骤index
   * @returns void
   */
  stepDragEnd: (activeIndex: number, overIndex: number) => void;
};
export declare const StepsFormContext: React.Context<StepsFormContextProps>;
export declare function useStepsContext(props: any): {
  isEdit: any;
  form: any;
  items: any[];
  currentStep: number;
  stepsCount: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  addStep: () => void;
  nextStep: () => Promise<void>;
  previousStep: () => Promise<void>;
  registerFormInstance: () => any;
  submit: () => Promise<void>;
  deleteStep: (name: any) => void;
  changeStepTitle: (name: any, newTitle: any) => void;
  stepDragEnd: (activeIndex: any, overIndex: any) => void;
};
export declare const useStepsFormContext: () => StepsFormContextProps;
export {};
