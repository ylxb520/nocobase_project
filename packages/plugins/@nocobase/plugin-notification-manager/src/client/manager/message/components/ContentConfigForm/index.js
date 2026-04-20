/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { withDynamicSchemaProps } from '@nocobase/client';
import { observer } from '@nocobase/flow-engine';
import { useChannelTypeMap } from '../../../../hooks';
export const ContentConfigForm = withDynamicSchemaProps(observer(({ variableOptions, channelType }) => {
    const channelTypeMap = useChannelTypeMap();
    const { ContentConfigForm = () => null } = (channelType ? channelTypeMap[channelType] : {})?.components || {};
    return React.createElement(ContentConfigForm, { variableOptions: variableOptions });
}, { displayName: 'ContentConfigForm' }));
//# sourceMappingURL=index.js.map