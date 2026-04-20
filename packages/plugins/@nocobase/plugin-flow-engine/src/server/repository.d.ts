/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Cache } from '@nocobase/cache';
import { Repository, Transaction, Transactionable } from '@nocobase/database';
import { ChildOptions, SchemaNode, TargetPosition } from './dao/ui_schema_node_dao';
export interface GetJsonSchemaOptions {
    includeAsyncNode?: boolean;
    readFromCache?: boolean;
    transaction?: Transaction;
}
export interface GetPropertiesOptions {
    readFromCache?: boolean;
    transaction?: Transaction;
}
export type FlowModelAttachPosition = 'first' | 'last' | TargetPosition;
export interface FlowModelAttachOptions {
    parentId: string;
    subKey: string;
    subType: 'array' | 'object';
    position?: FlowModelAttachPosition;
}
type BreakRemoveOnType = {
    [key: string]: any;
};
export interface removeParentOptions extends Transactionable {
    removeParentsIfNoChildren?: boolean;
    breakRemoveOn?: BreakRemoveOnType;
}
interface InsertAdjacentOptions extends removeParentOptions {
    wrap?: any;
}
export declare function transaction(transactionAbleArgPosition?: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare class FlowModelRepository extends Repository {
    cache: Cache;
    get flowModelsTableName(): any;
    get flowModelTreePathTableName(): any;
    static schemaToSingleNodes(schema: any, carry?: SchemaNode[], childOptions?: ChildOptions): SchemaNode[];
    setCache(cache: Cache): void;
    /**
     * clear cache with xUid which in flowModelTreePath's Path
     * @param {string} xUid
     * @param {Transaction} transaction
     * @returns {Promise<void>}
     */
    clearXUidPathCache(xUid: string, transaction: Transaction): Promise<void>;
    tableNameAdapter(tableName: any): any;
    sqlAdapter(sql: string): string;
    getProperties(uid: string, options?: GetPropertiesOptions): Promise<Partial<{
        uid: any;
        "x-async": boolean;
    }>>;
    getParentJsonSchema(uid: string, options?: GetJsonSchemaOptions): Promise<any>;
    getParentProperty(uid: string, options?: GetPropertiesOptions): Promise<any>;
    getJsonSchema(uid: string, options?: GetJsonSchemaOptions): Promise<any>;
    static optionsToJson(options: any): any;
    nodesToSchema(nodes: any, rootUid: any): {
        uid: any;
        "x-async": boolean;
    };
    clearAncestor(uid: string, options?: Transactionable): Promise<void>;
    emitAfterSaveEvent(s: any, options: any): Promise<void>;
    patch(newSchema: any, options?: any): Promise<void>;
    initializeActionContext(newSchema: any, options?: any): Promise<void>;
    batchPatch(schemas: any[], options?: any): Promise<void>;
    removeEmptyParents(options: Transactionable & {
        uid: string;
        breakRemoveOn?: BreakRemoveOnType;
    }): Promise<void>;
    recursivelyRemoveIfNoChildren(options: Transactionable & {
        uid: string;
        breakRemoveOn?: BreakRemoveOnType;
    }): Promise<void>;
    remove(uid: string, options?: Transactionable & removeParentOptions): Promise<void>;
    insertAdjacent(position: 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd', target: string, schema: any, options?: InsertAdjacentOptions): Promise<any>;
    duplicate(modelUid: string, options?: Transactionable): Promise<any>;
    private dedupeNodesForDuplicate;
    private replaceStepParamsModelUids;
    insert(schema: any, options?: Transactionable): Promise<any>;
    insertNewSchema(schema: any, options?: Transactionable & {
        returnNode?: boolean;
    }): Promise<any>;
    insertSingleNode(schema: SchemaNode, options: Transactionable & removeParentOptions): Promise<any>;
    protected updateNode(uid: string, schema: any, transaction?: Transaction): Promise<void>;
    protected childrenCount(uid: any, transaction: any): Promise<number>;
    protected isLeafNode(uid: any, transaction: any): Promise<boolean>;
    protected findParentUid(uid: any, transaction?: any): Promise<string>;
    protected findNodeSchemaWithParent(uid: any, transaction: any): Promise<{
        parentUid: string;
        schema: any;
    }>;
    protected isSingleChild(uid: any, transaction: any): Promise<any>;
    protected insertBeside(targetUid: string, schema: any, side: 'before' | 'after', options?: InsertAdjacentOptions): Promise<any>;
    protected insertInner(targetUid: string, schema: any, position: 'first' | 'last', options?: InsertAdjacentOptions): Promise<any>;
    protected insertAfterBegin(targetUid: string, schema: any, options?: InsertAdjacentOptions): Promise<any>;
    protected insertBeforeEnd(targetUid: string, schema: any, options?: InsertAdjacentOptions): Promise<any>;
    protected insertBeforeBegin(targetUid: string, schema: any, options?: InsertAdjacentOptions): Promise<any>;
    protected insertAfterEnd(targetUid: string, schema: any, options?: InsertAdjacentOptions): Promise<any>;
    protected insertNodes(nodes: SchemaNode[], options?: Transactionable): Promise<any[]>;
    private doGetProperties;
    findNodesById(uid: string, options?: GetJsonSchemaOptions): Promise<unknown[]>;
    private doGetJsonSchema;
    private ignoreSchemaProperties;
    private breakOnMatched;
    private schemaExists;
    private regenerateUid;
    private insertSchemaRecord;
    private prepareSingleNodeForInsert;
    static modelToSingleNodes(model: any, parentChildOptions?: any): SchemaNode[];
    static nodeToModel(node: any): any;
    static nodesToModel(nodes: any[], rootUid: string): any;
    insertModel(model: any, options?: Transactionable): Promise<any>;
    updateSingleNode(node: SchemaNode, options?: Transactionable): Promise<boolean>;
    upsertModel(model: any, options?: Transactionable): Promise<string>;
    findModelById(uid: string, options?: GetJsonSchemaOptions): Promise<any>;
    findModelByParentId(parentUid: string, options?: GetJsonSchemaOptions & {
        subKey?: string;
    }): Promise<any>;
    attach(uid: string, attachOptions: FlowModelAttachOptions, options?: Transactionable): Promise<any>;
    move(options: any): Promise<any>;
}
export default FlowModelRepository;
