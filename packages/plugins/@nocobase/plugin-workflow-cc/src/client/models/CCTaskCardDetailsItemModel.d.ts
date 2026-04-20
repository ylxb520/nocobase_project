/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DetailsItemModel } from '@nocobase/client';
import { Collection, FlowModelContext } from '@nocobase/flow-engine';
type CCTaskAssociationContext = {
    flowEngine: FlowModelContext['model']['flowEngine'];
    workflow?: any;
    nodes?: any[];
};
type TempAssociationSource = {
    collection: string;
    nodeId: string | number;
    nodeKey: string;
    nodeType: 'workflow' | 'node';
};
export type CCTaskTempAssociationFieldConfig = {
    nodeId: string | number;
    nodeKey: string;
    nodeType: 'workflow' | 'node';
};
type CCTaskAssociationMetadata = CCTaskTempAssociationFieldConfig & {
    fieldName: string;
    title?: string;
    dataSourceKey: string;
    target: string;
};
export declare const getEligibleTempAssociationSources: (sources?: TempAssociationSource[], collection?: Collection) => CCTaskAssociationMetadata[];
export declare const updateWorkflowCcTaskAssociationFields: ({ flowEngine, workflow, nodes, tempAssociationSources, }: CCTaskAssociationContext & {
    tempAssociationSources?: TempAssociationSource[];
}) => void;
export declare class CCTaskCardDetailsItemModel extends DetailsItemModel {
    static defineChildren(ctx: FlowModelContext): {
        key: any;
        label: string;
        refreshTargets: string[];
        toggleable: (subModel: any) => boolean;
        useModel: string;
        createModelOptions: () => {
            use: string;
            stepParams: {
                fieldSettings: {
                    init: {
                        dataSourceKey: any;
                        collectionName: any;
                        fieldPath: any;
                    };
                };
            };
            subModels: {
                field: {
                    use: string;
                    props: any;
                };
            };
        };
    }[];
    onInit(options: any): void;
}
export {};
