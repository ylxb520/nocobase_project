/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SettingOutlined } from '@ant-design/icons';
import { DetailsGridModel } from '@nocobase/client';
import { AddSubModelButton, FlowSettingsButton } from '@nocobase/flow-engine';
import React from 'react';
import { getEligibleTempAssociationSources } from './CCTaskCardDetailsItemModel';
import { TEMP_ASSOCIATION_PREFIX } from '../../common/tempAssociation';
/**
 * 抄送任务卡片详情的字段网格
 */
export class CCTaskCardGridModel extends DetailsGridModel {
    lastTempAssociationSnapshot;
    tempAssociationSyncHandler = () => {
        this.syncTempAssociationFields();
    };
    onMount() {
        super.onMount();
        this.emitter.on('onSubModelAdded', this.tempAssociationSyncHandler);
        this.emitter.on('onSubModelDestroyed', this.tempAssociationSyncHandler);
    }
    onUnmount() {
        this.emitter.off('onSubModelAdded', this.tempAssociationSyncHandler);
        this.emitter.off('onSubModelDestroyed', this.tempAssociationSyncHandler);
        super.onUnmount();
    }
    getTempAssociationFieldNames() {
        const fieldNames = this.mapSubModels('items', (item) => {
            const fieldPath = item.getStepParams('fieldSettings', 'init')?.fieldPath;
            if (!fieldPath)
                return null;
            const baseField = fieldPath.split('.')[0];
            if (!baseField.startsWith(TEMP_ASSOCIATION_PREFIX))
                return null;
            return baseField;
        }).filter(Boolean);
        return Array.from(new Set(fieldNames));
    }
    syncTempAssociationFields() {
        if (!this.context.flowSettingsEnabled)
            return;
        const sync = this.context.ccTaskTempAssociationSync;
        if (typeof sync !== 'function')
            return;
        const associationMetadata = getEligibleTempAssociationSources(this.context.tempAssociationSources || []);
        const metadataMap = new Map(associationMetadata.map((association) => [association.fieldName, association]));
        const selectedFields = this.getTempAssociationFieldNames();
        const configs = selectedFields
            .map((fieldName) => metadataMap.get(fieldName))
            .filter(Boolean)
            .map((association) => ({
            nodeId: association.nodeId,
            nodeKey: association.nodeKey,
            nodeType: association.nodeType,
        }))
            .sort((a, b) => a.nodeKey.localeCompare(b.nodeKey));
        const snapshot = JSON.stringify(configs);
        if (snapshot === this.lastTempAssociationSnapshot)
            return;
        this.lastTempAssociationSnapshot = snapshot;
        sync(configs);
    }
    renderAddSubModelButton() {
        if (!this.context.flowSettingsEnabled) {
            return null;
        }
        return (React.createElement(AddSubModelButton, { model: this, subModelKey: 'items', subModelBaseClasses: [
                this.context.getModelClassName('CCTaskCardDetailsItemModel'),
                this.context.getModelClassName('CCTaskCardDetailsAssociationFieldGroupModel'),
                this.context.getModelClassName('TaskCardCommonItemModel'),
            ].filter(Boolean), keepDropdownOpen: true },
            React.createElement(FlowSettingsButton, { icon: React.createElement(SettingOutlined, null) }, this.translate('Fields'))));
    }
    render() {
        this.props.heightMode = 'defaultHeight'; // 强制使用 defaultHeight 模式，避免出现滚动条
        return super.render();
    }
}
//# sourceMappingURL=CCTaskCardGridModel.js.map