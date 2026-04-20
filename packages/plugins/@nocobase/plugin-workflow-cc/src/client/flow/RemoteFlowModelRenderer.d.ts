/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModel } from '@nocobase/flow-engine';
import React from 'react';
export declare function RemoteFlowModelRenderer({ uid, onModelLoaded, enableUIConfiguration, mapModel, useCache, reloadKey, }: {
    uid: string;
    onModelLoaded?: (model: FlowModel) => void;
    enableUIConfiguration?: boolean;
    mapModel?: (model: FlowModel) => FlowModel;
    useCache?: boolean;
    reloadKey?: string | number;
}): React.JSX.Element;
