/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import _ from 'lodash';
import { FlowEngine } from '../flowEngine';
import { jioToJoiSchema } from './jioToJoiSchema';
export interface DataSourceOptions extends Record<string, any> {
    key: string;
    displayName?: string;
    description?: string;
    [key: string]: any;
}
export declare class DataSourceManager {
    dataSources: Map<string, DataSource>;
    flowEngine: FlowEngine;
    constructor();
    setFlowEngine(flowEngine: FlowEngine): void;
    addDataSource(ds: DataSource | DataSourceOptions): void;
    upsertDataSource(ds: DataSource | DataSourceOptions): void;
    removeDataSource(key: string): void;
    clearDataSources(): void;
    getDataSources(): DataSource[];
    getDataSource(key: string): DataSource | undefined;
    getCollection(dataSourceKey: string, collectionName: string): Collection | undefined;
    getCollectionField(fieldPathWithDataSource: string): CollectionField;
}
export declare class DataSource {
    dataSourceManager: DataSourceManager;
    collectionManager: CollectionManager;
    options: Record<string, any>;
    constructor(options?: Record<string, any>);
    get flowEngine(): FlowEngine;
    get displayName(): any;
    get key(): any;
    get name(): any;
    setDataSourceManager(dataSourceManager: DataSourceManager): void;
    getCollections(): Collection[];
    getCollection(name: string): Collection | undefined;
    /**
     * @deprecated use getAssociation instead
     */
    getAssocation(associationName: string): CollectionField | undefined;
    getAssociation(associationName: string): CollectionField | undefined;
    addCollection(collection: Collection | CollectionOptions): void;
    updateCollection(newOptions: CollectionOptions): void;
    upsertCollection(options: CollectionOptions): Collection;
    upsertCollections(collections: CollectionOptions[], options?: {
        clearFields?: boolean;
    }): void;
    removeCollection(name: string): void;
    clearCollections(): void;
    setOptions(newOptions?: any): void;
    getCollectionField(fieldPath: string): CollectionField;
}
export interface CollectionOptions {
    name: string;
    title?: string;
    inherits?: string[];
    [key: string]: any;
}
export declare class CollectionManager {
    dataSource: DataSource;
    collections: Map<string, Collection>;
    allCollectionsInheritChain: string[];
    protected childrenCollectionsName: {
        supportView?: string[];
        notSupportView?: string[];
    };
    constructor(dataSource: DataSource);
    get flowEngine(): FlowEngine;
    addCollection(collection: Collection | CollectionOptions): void;
    removeCollection(name: string): void;
    updateCollection(newOptions: CollectionOptions, options?: {
        clearFields?: boolean;
    }): void;
    upsertCollection(options: CollectionOptions): Collection;
    upsertCollections(collections: CollectionOptions[], options?: {
        clearFields?: boolean;
    }): void;
    sortCollectionsByInherits(collections: CollectionOptions[]): CollectionOptions[];
    getCollection(name: string): Collection | undefined;
    getCollections(): Collection[];
    clearCollections(): void;
    getAssociation(associationName: string): CollectionField | undefined;
    getChildrenCollections(name: any): any[];
    getChildrenCollectionsName(name: any, isSupportView?: boolean): string[];
    getAllCollectionsInheritChain(name: any): string[];
}
export declare class Collection {
    fields: Map<string, CollectionField>;
    options: Record<string, any>;
    inherits: Map<string, Collection>;
    dataSource: DataSource;
    constructor(options?: Record<string, any>);
    clone(): Collection;
    getFilterByTK(record: any): any;
    get titleableFields(): CollectionField[];
    get hidden(): any;
    get flowEngine(): FlowEngine;
    get collectionManager(): CollectionManager;
    get sort(): any;
    get filterTargetKey(): any;
    get dataSourceKey(): any;
    get name(): any;
    get template(): any;
    get storage(): any;
    get title(): any;
    get titleCollectionField(): CollectionField;
    initInherits(): void;
    setDataSource(dataSource: DataSource): void;
    setOptions(newOptions?: any, options?: {
        clearFields?: boolean;
    }): void;
    getFields(): CollectionField[];
    getToOneAssociationFields(): CollectionField[];
    getAssociationFields(types?: any[]): CollectionField[];
    mapFields(callback: (field: CollectionField) => any): any[];
    setFields(fields: CollectionField[] | Record<string, any>[]): void;
    upsertFields(fields?: Record<string, any>[]): void;
    getFieldByPath(fieldPath: string): CollectionField | undefined;
    getField(fieldName: string): CollectionField | undefined;
    getFullFieldPath(name: string): string;
    addField(field: CollectionField | Record<string, any>): void;
    removeField(fieldName: string): boolean;
    clearFields(): void;
    refresh(): void;
    /**
     * 获取所有关联字段
     * @returns 关联字段数组
     */
    getRelationshipFields(): CollectionField[];
    /**
     * 获取所有关联的集合
     * @returns 关联集合数组
     */
    getRelatedCollections(): Collection[];
    /**
     * 检查是否有关联字段
     * @returns 是否有关联字段
     */
    hasRelationshipFields(): boolean;
}
export declare class CollectionField {
    options: Record<string, any>;
    collection: Collection;
    constructor(options: Record<string, any>);
    setOptions(newOptions?: any): void;
    setCollection(collection: Collection): void;
    get targetCollectionTitleFieldName(): any;
    get targetCollectionTitleField(): CollectionField;
    get flowEngine(): FlowEngine;
    get dataSourceKey(): any;
    get resourceName(): string;
    get collectionName(): any;
    get readonly(): any;
    get titleable(): boolean;
    get fullpath(): string;
    get name(): any;
    get type(): any;
    get dataType(): any;
    get foreignKey(): any;
    get targetKey(): any;
    get sourceKey(): any;
    get target(): any;
    get title(): string;
    set title(value: string);
    get enum(): any[];
    get defaultValue(): any;
    get interface(): any;
    get filterable(): any;
    get inputable(): any;
    get uiSchema(): any;
    get targetCollection(): Collection;
    get validation(): any;
    getComponentProps(): _.Dictionary<any>;
    getFields(): CollectionField[];
    getInterfaceOptions(): any;
    getFilterOperators(): any;
    getSubclassesOf(baseClass: string): Map<string, import("..").ModelConstructor>;
    getFirstSubclassNameOf(baseClass: string): string;
    isAssociationField(): boolean;
    /**
     * 检查字段是否为关联字段
     * @returns 是否为关联字段
     */
    isRelationshipField(): boolean;
}
/**
 * 判断 fieldInterfaces 是否匹配 targetInterface
 * @param fieldInterfaces string | string[] | null
 * @param targetInterface string
 */
export declare function isFieldInterfaceMatch(fieldInterfaces: string | string[] | null | undefined, targetInterface: string): boolean;
export { jioToJoiSchema };
