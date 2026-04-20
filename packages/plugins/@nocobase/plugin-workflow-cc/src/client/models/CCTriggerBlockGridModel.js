/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PlusOutlined } from '@ant-design/icons';
import { BlockGridModel } from '@nocobase/client';
import { AddSubModelButton, FlowSettingsButton, tExpr } from '@nocobase/flow-engine';
import React from 'react';
export class CCTriggerBlockGridModel extends BlockGridModel {
    renderAddSubModelButton() {
        if (!this.context.flowSettingsEnabled) {
            return null;
        }
        const items = [
            {
                key: 'otherBlocks',
                type: 'group',
                label: tExpr('Other blocks'),
                children: [
                    {
                        key: 'markdown',
                        label: tExpr('Markdown'),
                        useModel: 'MarkdownBlockModel',
                        createModelOptions: {
                            use: 'MarkdownBlockModel',
                        },
                    },
                    {
                        key: 'jsBlock',
                        label: tExpr('JS block'),
                        useModel: 'JSBlockModel',
                        createModelOptions: {
                            use: 'JSBlockModel',
                        },
                    },
                ],
            },
        ];
        return (React.createElement(AddSubModelButton, { model: this, subModelKey: "items", items: items },
            React.createElement(FlowSettingsButton, { icon: React.createElement(PlusOutlined, null) }, this.context.t('Add block'))));
    }
}
//# sourceMappingURL=CCTriggerBlockGridModel.js.map