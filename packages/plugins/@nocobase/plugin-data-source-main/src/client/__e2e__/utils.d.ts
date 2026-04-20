/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Page } from '@nocobase/test/e2e';
export declare function showSettingsMenu(page: Page, fieldName: string): Promise<void>;
export declare function createColumnItem(page: Page, fieldName: string): Promise<void>;
export declare function testEditFieldTitle(page: Page): Promise<void>;
export declare function testDisplayTitle(page: Page, title: string): Promise<void>;
export declare function testEditDescription(page: Page): Promise<void>;
export declare function testRequired(page: Page): Promise<void>;
export declare function clickDeleteAndOk(page: Page): Promise<void>;
export declare function testDefaultValue({ page, openDialog, closeDialog, gotoPage, showMenu, supportedVariables, unsupportedVariables, constantValue, variableValue, inputConstantValue, expectConstantValue, expectVariableValue, }: {
    page: Page;
    openDialog: () => Promise<void>;
    closeDialog: () => Promise<void>;
    gotoPage: () => Promise<void>;
    showMenu: () => Promise<void>;
    /** 支持的变量列表，如：['Current user', 'Date variables', 'Current form'] */
    supportedVariables: string[];
    /** 不应该显示出来的变量列表 */
    unsupportedVariables?: string[];
    /** 常量默认值 */
    constantValue?: string | number;
    /** 变量默认值 */
    variableValue?: string[];
    /** 输入常量默认值 */
    inputConstantValue?: () => Promise<void>;
    /** 对常量默认值进行断言 */
    expectConstantValue?: () => Promise<void>;
    /** 对变量默认值进行断言 */
    expectVariableValue?: () => Promise<void>;
}): Promise<void>;
export declare function testPattern({ page, gotoPage, openDialog, showMenu, expectEditable, expectReadonly, expectEasyReading, }: {
    page: Page;
    gotoPage: () => Promise<void>;
    openDialog: () => Promise<void>;
    showMenu: () => Promise<void>;
    /** 断言选项为 Editable 的情况 */
    expectEditable: () => Promise<void>;
    /** 断言选项为 Readonly 的情况 */
    expectReadonly: () => Promise<void>;
    /** 断言选项为 Easy-reading 的情况 */
    expectEasyReading: () => Promise<void>;
}): Promise<void>;
export declare function testSetValidationRules({ page, gotoPage, openDialog, showMenu, }: {
    page: Page;
    gotoPage: () => Promise<void>;
    openDialog: () => Promise<void>;
    showMenu: () => Promise<void>;
}): Promise<void>;
export declare class CollectionManagerPage {
    page: Page;
    constructor(page: Page);
    goto(): Promise<void>;
    createCollection(template: 'General collection' | 'Calendar collection' | 'Tree collection' | 'Expression collection' | 'SQL collection' | 'File collection' | 'Connect to database view'): Promise<CollectionSettings>;
    /**
     * 对应页面中每行数据表的 Configure fields 按钮
     * @param collectionName 数据表字段标识
     * @returns
     */
    configureFields(collectionName: string): Promise<FieldsSettings>;
    /**
     * 对应页面中每行数据表的 Edit 按钮
     * @param collectionName 数据表字段标识
     * @returns
     */
    edit(collectionName: string): Promise<CollectionSettings>;
    /**
     * 对应页面中每行数据表的 Delete 按钮
     * @param collectionName 数据表字段标识
     */
    deleteItem(collectionName: string): Promise<void>;
    addCategory(name: string, color?: 'Red' | 'Green' | 'Blue'): Promise<void>;
    deleteCategory(name: string): Promise<void>;
}
/**
 * 用来配置 Collection
 */
export declare class CollectionSettings {
    page: Page;
    constructor(page: Page);
    change(name: 'Collection display name', value: string): any;
    change(name: 'Collection name', value: string): any;
    change(name: 'Inherits', value: string[]): any;
    change(name: 'Categories', value: string[]): any;
    change(name: 'Description', value: string): any;
    change(name: 'Primary key, unique identifier, self growth', value: boolean): any;
    change(name: 'Store the creation user of each record', value: boolean): any;
    change(name: 'Store the last update user of each record', value: boolean): any;
    change(name: 'Store the creation time of each record', value: boolean): any;
    change(name: 'Store the last update time of each record', value: boolean): any;
    change(name: 'Records can be sorted', value: boolean): any;
    change(name: 'File storage', value: string): any;
    change(name: 'SQL', value: string): any;
    submit(): Promise<void>;
    private ['SQL'];
    private ['File storage'];
    private ['Collection display name'];
    private ['Collection name'];
    private ['Inherits'];
    private ['Categories'];
    private ['Description'];
    private ['Primary key, unique identifier, self growth'];
    private ['Store the creation user of each record'];
    private ['Store the last update user of each record'];
    private ['Store the creation time of each record'];
    private ['Store the last update time of each record'];
}
export type FieldInterface = 'Single line text' | 'Long text' | 'Phone' | 'Email' | 'URL' | 'Integer' | 'Number' | 'Percent' | 'Password' | 'Color' | 'Icon' | 'Checkbox' | 'Single select' | 'Multiple select' | 'Radio group' | 'Checkbox group' | 'China region' | 'Markdown' | 'Rich Text' | 'Attachment' | 'Datetime (with time zone)' | 'Datetime (without time zone)' | 'Date' | 'Time' | 'Unix Timestamp' | 'One to one (belongs to)' | 'One to one (has one)' | 'One to many' | 'Many to one' | 'Many to many' | 'Formula' | 'Sequence' | 'JSON' | 'Collection selector' | 'ID' | 'Table OID' | 'Created at' | 'Last updated at' | 'Created by' | 'Last updated by';
/**
 * 用来配置 Fields
 */
export declare class FieldsSettings {
    page: Page;
    constructor(page: Page);
    /**
     * 对应页面中 Configure fields 弹窗的 Add field 按钮
     * @param fieldInterface
     * @returns
     */
    addField(fieldInterface: FieldInterface): Promise<FieldSettings>;
    /**
     * 对应页面中 configure fields 弹窗的 Edit 按钮
     * @param fieldName
     * @param fieldInterface
     * @returns
     */
    edit(fieldName: string, fieldInterface: FieldInterface): Promise<FieldSettings>;
    /**
     * 对应页面中 Configure fields 弹窗中每一行的 Delete 按钮
     * @param fieldName
     */
    deleteItem(fieldName: string): Promise<void>;
}
/**
 * 用来配置 Field
 */
export declare class FieldSettings {
    page: Page;
    fieldType: FieldInterface;
    constructor(page: Page, fieldType: FieldInterface);
    change(name: 'Field display name', value: string): any;
    change(name: 'Field name', value: string): any;
    change(name: 'Default value', value: string): any;
    change(name: 'Description', value: string): any;
    change(name: 'Unique', value: boolean): any;
    change(name: 'Precision', value: string): any;
    change(name: 'Options', value: {
        label: string;
        value: string;
        color?: 'Red' | 'Green' | 'Blue';
    }[]): any;
    change(name: 'Select level', value: 'Province' | 'City' | 'Area' | 'Street' | 'Village'): any;
    change(name: 'Must select to the last level', value: boolean): any;
    change(name: 'MIME type', value: string): any;
    change(name: 'Allow uploading multiple files', value: boolean): any;
    change(name: 'Storage', value: string): any;
    change(name: 'Date format', value: 'Year/Month/Day' | 'Year-Month-Day' | 'Day/Month/Year'): any;
    change(name: 'Show time', value: boolean): any;
    change(name: 'GMT', value: boolean): any;
    change(name: 'Time format', value: '12 hour' | '24 hour'): any;
    change(name: 'Target collection', value: string): any;
    change(name: 'Target key', value: string): any;
    change(name: 'Foreign key', value: string): any;
    change(name: 'ON DELETE', value: string): any;
    change(name: 'Create inverse field in the target collection', value: boolean): any;
    change(name: 'Through collection', value: string): any;
    change(name: 'Foreign key 1', value: string): any;
    change(name: 'Foreign key 2', value: string): any;
    change(name: 'Storage type', value: string): any;
    change(name: 'Calculation engine', value: 'Math.js' | 'Formula.js'): any;
    change(name: 'Expression', value: string): any;
    submit(): Promise<void>;
    private ['Field display name'];
    private ['Field name'];
    private ['Target collection'];
    private ['Target key'];
    private ['Expression'];
}
