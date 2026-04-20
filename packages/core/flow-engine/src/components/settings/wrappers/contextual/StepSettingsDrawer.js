import { openStepSettingsDialog } from './StepSettingsDialog';
/**
 * StepSettingsDrawer组件 - 使用自定义 Drawer 显示单个步骤的配置界面
 * @param props.model 模型实例
 * @param props.flowKey 流程Key
 * @param props.stepKey 步骤Key
 * @param props.drawerWidth 抽屉宽度，默认为600
 * @param props.drawerTitle 自定义抽屉标题，默认使用step的title
 * @returns Promise<any> 返回表单提交的值
 */
const openStepSettingsDrawer = async (options) => {
  const { drawerWidth, drawerTitle, cleanup, ...restOptions } = options;
  return openStepSettingsDialog({
    ...restOptions,
    mode: 'drawer',
    dialogWidth: drawerWidth,
    dialogTitle: drawerTitle,
    cleanup,
  });
};
export { openStepSettingsDrawer };
//# sourceMappingURL=StepSettingsDrawer.js.map
