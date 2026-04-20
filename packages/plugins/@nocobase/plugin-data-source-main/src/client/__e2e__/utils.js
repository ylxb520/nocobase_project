/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { expect } from '@nocobase/test/e2e';
export async function showSettingsMenu(page, fieldName) {
  await page.getByRole('columnheader', { name: fieldName, exact: true }).hover();
  await page.getByLabel('designer-schema-settings-TableV2.Column-fieldSettings:TableColumn-general').hover();
}
export async function createColumnItem(page, fieldName) {
  await page.getByLabel('schema-initializer-TableV2-table:configureColumns-general').hover();
  await page.getByRole('menuitem', { name: fieldName, exact: true }).click();
  await page.mouse.move(300, 0);
}
export async function testEditFieldTitle(page) {
  await page.getByRole('menuitem', { name: 'Edit field title' }).click();
  await page.getByLabel('block-item-Input-general-').getByRole('textbox').click();
  await page.getByLabel('block-item-Input-general-').getByRole('textbox').fill('testing edit field title');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByText('testing edit field title')).toBeVisible();
}
export async function testDisplayTitle(page, title) {
  // 默认情况下是开启状态
  await expect(page.getByRole('menuitem', { name: 'Display title' }).getByRole('switch')).toBeChecked();
  await page.getByRole('menuitem', { name: 'Display title' }).click();
  await expect(page.getByRole('menuitem', { name: 'Display title' }).getByRole('switch')).not.toBeChecked();
  await expect(page.getByText(`${title}:`, { exact: true })).not.toBeVisible();
}
export async function testEditDescription(page) {
  await page.getByRole('menuitem', { name: 'Edit description' }).click();
  await page.getByLabel('block-item-Input.TextArea-').getByRole('textbox').click();
  await page.getByLabel('block-item-Input.TextArea-').getByRole('textbox').fill('testing edit description');
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByText('testing edit description').last()).toBeVisible();
}
export async function testRequired(page) {
  // 默认情况下是关闭状态
  await expect(page.getByRole('menuitem', { name: 'Required' }).getByRole('switch')).not.toBeChecked();
  await page.getByRole('menuitem', { name: 'Required' }).click();
  await expect(page.getByRole('menuitem', { name: 'Required' }).getByRole('switch')).toBeChecked();
}
export async function clickDeleteAndOk(page) {
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
}
export async function testDefaultValue({
  page,
  openDialog,
  closeDialog,
  gotoPage,
  showMenu,
  supportedVariables,
  unsupportedVariables,
  constantValue,
  variableValue,
  inputConstantValue,
  expectConstantValue,
  expectVariableValue,
}) {
  await gotoPage();
  await openDialog();
  // 设置一个常量作为默认值
  if (constantValue || inputConstantValue) {
    await showMenu();
    await page.getByRole('menuitem', { name: 'Set default value' }).click();
    if (inputConstantValue) {
      await inputConstantValue();
    } else {
      await page.getByLabel('block-item-VariableInput-').getByRole('textbox').click();
      await page.getByLabel('block-item-VariableInput-').getByRole('textbox').fill(String(constantValue));
    }
    if (supportedVariables || unsupportedVariables) {
      await page.getByLabel('variable-button').click();
      await testSupportedAndUnsupportedVariables(page, supportedVariables, unsupportedVariables);
      // 关闭变量列表
      await page.getByLabel('variable-button').click();
    }
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    // 关闭弹窗，然后再次打开后，应该显示刚才设置的默认值
    await closeDialog();
    await openDialog();
    await expectConstantValue?.();
  }
  // 设置一个变量作为默认值
  if (variableValue) {
    await showMenu();
    await page.getByRole('menuitem', { name: 'Set default value' }).click();
    await page.getByLabel('variable-button').click();
    await testSupportedAndUnsupportedVariables(page, supportedVariables, unsupportedVariables);
    for (const value of variableValue) {
      if (value === 'ID') {
        await page.getByRole('menuitemcheckbox', { name: value, exact: true }).click();
      } else {
        await page.getByRole('menuitemcheckbox', { name: value }).click();
      }
    }
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await closeDialog();
    await openDialog();
    await expectVariableValue?.();
  }
}
async function testSupportedAndUnsupportedVariables(page, supportedVariables, unsupportedVariables) {
  for (const value of supportedVariables) {
    await expect(page.getByRole('menuitemcheckbox', { name: value })).toBeVisible();
  }
  for (const value of unsupportedVariables || []) {
    await expect(page.getByRole('menuitemcheckbox', { name: value })).not.toBeVisible();
  }
}
export async function testPattern({
  page,
  gotoPage,
  openDialog,
  showMenu,
  expectEditable,
  expectReadonly,
  expectEasyReading,
}) {
  await gotoPage();
  await openDialog();
  // 默认情况下，显示的是 Editable
  await expectEditable();
  await showMenu();
  await expect(page.getByText('PatternEditable')).toBeVisible();
  // 更改为 Readonly
  await page.getByRole('menuitem', { name: 'Pattern' }).click();
  await page.getByRole('option', { name: 'Readonly' }).click();
  await expectReadonly();
  // 更改为 Easy-reading
  await showMenu();
  await page.waitForTimeout(100);
  await expect(page.getByText('PatternReadonly')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Pattern' }).click();
  await page.getByRole('option', { name: 'Easy-reading' }).click();
  await expectEasyReading();
  await showMenu();
  await expect(page.getByText('PatternEasy-reading')).toBeVisible();
}
export async function testSetValidationRules({ page, gotoPage, openDialog, showMenu }) {
  await gotoPage();
  await openDialog();
  await showMenu();
  await page.getByRole('menuitem', { name: 'Set validation rules' }).click();
  await expect(page.getByRole('dialog').getByText('Set validation rules')).toBeVisible();
  // TODO: 更详细的测试
}
export class CollectionManagerPage {
  page;
  constructor(page) {
    this.page = page;
  }
  async goto() {
    await this.page.goto('admin/settings/data-source-manager/main/collections');
  }
  async createCollection(template) {
    await this.page.getByRole('button', { name: 'Create collection' }).hover();
    await this.page.getByRole('menuitem', { name: template }).click();
    return new CollectionSettings(this.page);
  }
  /**
   * 对应页面中每行数据表的 Configure fields 按钮
   * @param collectionName 数据表字段标识
   * @returns
   */
  async configureFields(collectionName) {
    await this.page
      .getByLabel(`action-Action.Link-Configure fields-collections-${collectionName}`, { exact: true })
      .click();
    return new FieldsSettings(this.page);
  }
  /**
   * 对应页面中每行数据表的 Edit 按钮
   * @param collectionName 数据表字段标识
   * @returns
   */
  async edit(collectionName) {
    await this.page.getByLabel(`edit-button-${collectionName}`).click();
    return new CollectionSettings(this.page);
  }
  /**
   * 对应页面中每行数据表的 Delete 按钮
   * @param collectionName 数据表字段标识
   */
  async deleteItem(collectionName) {
    await this.page.getByLabel(`delete-button-${collectionName}`).click();
    await this.page.getByLabel('action-Action-Ok-collections-').click();
  }
  async addCategory(name, color) {
    await this.page.getByRole('button', { name: 'Add tab' }).click();
    await this.page.getByLabel('block-item-Input-collections-').getByRole('textbox').fill(name);
    if (color) {
      await this.page.getByLabel('block-item-ColorSelect-').locator('.ant-select-selector').click();
      await this.page.getByRole('option', { name: color, exact: true }).click();
    }
    await this.page.getByLabel('action-Action-Submit-').click();
  }
  async deleteCategory(name) {
    await this.page.getByLabel(name).hover();
    await this.page.getByRole('menuitem', { name: 'Delete category' }).click();
    await this.page.getByRole('button', { name: 'OK', exact: true }).click();
  }
}
/**
 * 用来配置 Collection
 */
export class CollectionSettings {
  page;
  constructor(page) {
    this.page = page;
  }
  async change(name, value) {
    await this[name](value);
  }
  async submit() {
    await this.page.getByLabel('action-Action-Submit-').click();
  }
  async ['SQL'](value) {
    await this.page.getByLabel('block-item-collections-SQL').getByRole('textbox').fill(value);
    await this.page.getByRole('button', { name: 'edit Confirm' }).click();
  }
  async ['File storage'](value) {
    await this.page.getByLabel('block-item-RemoteSelect-collections-File storage').getByTestId('select-single').click();
    await this.page.getByTitle(value).click();
  }
  async ['Collection display name'](value) {
    await this.page.getByLabel('block-item-Input-collections-Collection display name').getByRole('textbox').fill(value);
  }
  async ['Collection name'](value) {
    await this.page.getByLabel('block-item-Input-collections-Collection name').getByRole('textbox').fill(value);
  }
  async ['Inherits'](value) {
    // 1. 点击一下打开下拉选项
    await this.page.getByLabel('block-item-Select-collections-Inherits').getByTestId('select-multiple').click();
    // 2. 点击选择
    for (const name of value) {
      await this.page.getByRole('option', { name, exact: true }).click();
    }
    // 3. 关闭下拉选项，以免影响其它操作
    await this.page.getByLabel('block-item-Select-collections-Inherits').getByTestId('select-multiple').click();
  }
  async ['Categories'](value) {
    // 1. 点击一下打开下拉选项
    await this.page.getByLabel('block-item-Select-collections-Categories').getByTestId('select-multiple').click();
    // 2. 点击选择
    for (const name of value) {
      await this.page.getByRole('option', { name, exact: true }).click();
    }
    // 3. 关闭下拉选项，以免影响其它操作
    await this.page.getByLabel('block-item-Select-collections-Categories').getByTestId('select-multiple').click();
  }
  async ['Description'](value) {
    await this.page.getByLabel('block-item-Input.TextArea-').getByRole('textbox').fill(value);
  }
  async ['Primary key, unique identifier, self growth'](value) {
    await this.page
      .getByRole('row', { name: 'Primary key, unique identifier, self growth' })
      .getByLabel('')
      .setChecked(value);
  }
  async ['Store the creation user of each record'](value) {
    await this.page
      .getByRole('row', { name: 'Store the creation user of each record' })
      .getByLabel('')
      .setChecked(value);
  }
  async ['Store the last update user of each record'](value) {
    await this.page
      .getByRole('row', { name: 'Store the last update user of each record' })
      .getByLabel('')
      .setChecked(value);
  }
  async ['Store the creation time of each record'](value) {
    await this.page
      .getByRole('row', { name: 'Store the creation time of each record' })
      .getByLabel('')
      .setChecked(value);
  }
  async ['Store the last update time of each record'](value) {
    await this.page
      .getByRole('row', { name: 'Store the last update time of each record' })
      .getByLabel('')
      .setChecked(value);
  }
}
/**
 * 用来配置 Fields
 */
export class FieldsSettings {
  page;
  constructor(page) {
    this.page = page;
  }
  /**
   * 对应页面中 Configure fields 弹窗的 Add field 按钮
   * @param fieldInterface
   * @returns
   */
  async addField(fieldInterface) {
    await this.page.getByRole('button', { name: 'plus Add field' }).hover();
    await this.page.getByRole('menuitem', { name: fieldInterface, exact: true }).click();
    return new FieldSettings(this.page, fieldInterface);
  }
  /**
   * 对应页面中 configure fields 弹窗的 Edit 按钮
   * @param fieldName
   * @param fieldInterface
   * @returns
   */
  async edit(fieldName, fieldInterface) {
    await this.page.getByLabel(`edit-button-${fieldName}`).click();
    return new FieldSettings(this.page, fieldInterface);
  }
  /**
   * 对应页面中 Configure fields 弹窗中每一行的 Delete 按钮
   * @param fieldName
   */
  async deleteItem(fieldName) {
    await this.page.getByLabel(`action-CollectionFields-Delete-fields-${fieldName}`).click();
    await this.page.getByRole('button', { name: 'OK', exact: true }).click();
  }
}
/**
 * 用来配置 Field
 */
export class FieldSettings {
  page;
  fieldType;
  constructor(page, fieldType) {
    this.page = page;
    this.fieldType = fieldType;
  }
  async change(name, value) {
    await this[name](value);
  }
  async submit() {
    await this.page.getByLabel('action-Action-Submit-fields-').click();
  }
  async ['Field display name'](value) {
    await this.page.getByLabel('block-item-Input-fields-Field display name').getByRole('textbox').fill(value);
  }
  async ['Field name'](value) {
    await this.page.getByLabel('block-item-Input-fields-Field name').getByRole('textbox').fill(value);
  }
  async ['Target collection'](value) {
    await this.page.getByLabel('block-item-Select-fields-Target collection').getByTestId('select-single').click();
    await this.page.getByRole('option', { name: value }).click();
  }
  async ['Target key'](value) {
    await this.page.getByLabel('block-item-TargetKey-fields').locator('.ant-select-selector').click();
    await this.page.getByRole('option', { name: value }).click();
  }
  async ['Expression'](value) {
    await this.page.getByLabel('block-item-Formula.Expression').getByLabel('textbox').fill(value);
  }
}
//# sourceMappingURL=utils.js.map
