/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
export class SMSOTPProviderManager {
    providers = new Registry();
    registerProvider(type, options) {
        this.providers.register(type, options);
    }
    getProvider(type) {
        return this.providers.get(type);
    }
}
//# sourceMappingURL=provider-manager.js.map