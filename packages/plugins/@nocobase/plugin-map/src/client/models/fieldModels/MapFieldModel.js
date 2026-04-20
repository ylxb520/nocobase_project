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
import { tExpr, largeField } from '@nocobase/flow-engine';
import { css, FieldModel } from '@nocobase/client';
import React from 'react';
import { MapComponent } from '../MapComponent';
import { NAMESPACE } from '../../locale';
const className = css `
  height: 100%;
  border: 1px solid transparent;
  .ant-formily-item-error & {
    border: 1px solid #ff4d4f;
  }
`;
const InternalMap = (props) => {
    return (React.createElement("div", { className: className },
        React.createElement(MapComponent, { ...props })));
};
export let MapFieldModel = class MapFieldModel extends FieldModel {
    getMapFieldType() {
        return null;
    }
    render() {
        return React.createElement(InternalMap, { ...this.props, type: this.getMapFieldType() });
    }
};
MapFieldModel = __decorate([
    largeField()
], MapFieldModel);
MapFieldModel.registerFlow({
    key: 'mapFieldSetting',
    title: tExpr('Map field settings', { ns: NAMESPACE }),
    sort: 500,
    steps: {
        zoom: {
            use: 'setDefaultZoomLevel',
            handler(ctx, params) {
                ctx.model.setProps({
                    zoom: params.zoom,
                });
            },
        },
    },
});
//# sourceMappingURL=MapFieldModel.js.map