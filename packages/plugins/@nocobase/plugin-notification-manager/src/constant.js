/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export var COLLECTION_NAME;
(function (COLLECTION_NAME) {
    COLLECTION_NAME["templates"] = "templates";
    COLLECTION_NAME["channels"] = "notificationChannels";
    COLLECTION_NAME["messages"] = "messages";
    COLLECTION_NAME["logs"] = "notificationSendLogs";
})(COLLECTION_NAME || (COLLECTION_NAME = {}));
export const ChannelsCollectionDefinition = {
    name: COLLECTION_NAME.channels,
    fieldNameMap: {
        name: 'name',
    },
};
//# sourceMappingURL=constant.js.map