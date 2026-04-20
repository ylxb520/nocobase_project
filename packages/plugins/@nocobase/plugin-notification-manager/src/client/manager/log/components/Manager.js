/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ExtendCollectionsProvider, SchemaComponent, SchemaComponentContext, useSchemaComponentContext, } from '@nocobase/client';
import { Card } from 'antd';
import React, { useMemo } from 'react';
import channelCollection from '../../../../collections/channel';
import messageLogCollection from '../../../../collections/messageLog';
import { useNotificationTranslation } from '../../../locale';
import { useEditFormProps, useNotificationTypes } from '../../channel/hooks';
import { messageLogsManagerSchema } from '../schemas';
export const LogManager = () => {
    const { t } = useNotificationTranslation();
    const scCtx = useSchemaComponentContext();
    const notificationTypes = useNotificationTypes();
    const schemaComponentContext = useMemo(() => ({ ...scCtx, designable: false }), [scCtx]);
    return (React.createElement(ExtendCollectionsProvider, { collections: [messageLogCollection, channelCollection] },
        React.createElement(SchemaComponentContext.Provider, { value: schemaComponentContext },
            React.createElement(Card, { bordered: false },
                React.createElement(SchemaComponent, { schema: messageLogsManagerSchema, scope: { t, useEditFormProps, notificationTypeOptions: notificationTypes } })))));
};
LogManager.displayName = 'LogManager';
//# sourceMappingURL=Manager.js.map