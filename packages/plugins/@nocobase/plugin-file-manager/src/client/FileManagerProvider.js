/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ExtendCollectionsProvider, SchemaComponentOptions } from '@nocobase/client';
import React from 'react';
import * as hooks from './hooks';
import { UploadActionInitializer } from './initializers';
import attachmentsCollection from '../common/collections/attachments';
import storagesCollection from '../common/collections/storages';
export const FileManagerProvider = (props) => {
    return (React.createElement(ExtendCollectionsProvider, { collections: [attachmentsCollection, storagesCollection] },
        React.createElement(SchemaComponentOptions, { scope: hooks, components: { UploadActionInitializer } }, props.children)));
};
//# sourceMappingURL=FileManagerProvider.js.map