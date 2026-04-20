/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DetailsAssociationFieldGroupModel } from '@nocobase/client';
import { FlowModelContext } from '@nocobase/flow-engine';
export declare class CCTaskCardDetailsAssociationFieldGroupModel extends DetailsAssociationFieldGroupModel {
    static itemModelName: string;
    static defineChildren(ctx: FlowModelContext): {
        key: string;
        label: string;
        children: () => {
            key: string;
            label: string;
            type: string;
            children: {
                key: string;
                label: string;
                useModel: string;
                toggleable: (subModel: any) => boolean;
                createModelOptions: {
                    stepParams: {
                        fieldSettings: {
                            init: {
                                dataSourceKey: any;
                                collectionName: any;
                                fieldPath: string;
                                associationPathName: any;
                            };
                        };
                    };
                    subModels: {
                        field: {
                            use: string;
                        };
                    };
                };
            }[];
        }[];
    }[];
}
