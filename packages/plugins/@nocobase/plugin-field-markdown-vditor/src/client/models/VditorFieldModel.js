var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FieldModel } from '@nocobase/client';
import { largeField, EditableItemModel } from '@nocobase/flow-engine';
export let VditorFieldModel = class VditorFieldModel extends FieldModel {
    render() {
        const markdown = this.context.markdown;
        return markdown.edit({ ...this.props, enableContextSelect: false });
    }
};
VditorFieldModel = __decorate([
    largeField()
], VditorFieldModel);
EditableItemModel.bindModelToInterface('VditorFieldModel', ['vditor', 'markdown'], { isDefault: true });
//# sourceMappingURL=VditorFieldModel.js.map