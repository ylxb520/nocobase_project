/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
export default class NotificationManager {
    channelTypes = new Registry();
    registerChannelType(options) {
        this.channelTypes.register(options.type, options);
    }
}
//# sourceMappingURL=notification-manager.js.map