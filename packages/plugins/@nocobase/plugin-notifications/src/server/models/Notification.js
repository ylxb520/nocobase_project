/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Model } from '@nocobase/database';
import lodash from 'lodash';
export class Notification extends Model {
    get db() {
        return this.constructor['database'];
    }
    async getReceiversByOptions() {
        const { data, fromTable, filter, dataField } = this.receiver_options;
        let receivers = [];
        if (data) {
            receivers = Array.isArray(data) ? data : [data];
        }
        else if (fromTable) {
            const collection = this.db.getCollection(fromTable);
            const rows = await collection.repository.find({
                filter,
            });
            receivers = rows.map((row) => row[dataField]);
        }
        return receivers;
    }
    async send(options = {}) {
        const { transaction } = options;
        if (!this.service) {
            this.service = await this.getService();
        }
        const receivers = await this.getReceiversByOptions();
        let { to } = options;
        if (to) {
            to = Array.isArray(to) ? to : [to];
            receivers.push(...to);
        }
        console.log(receivers);
        for (const receiver of receivers) {
            try {
                const response = await this.service.send({
                    to: receiver,
                    subject: this.getSubject(),
                    html: this.getBody(options),
                });
                await this.createLog({
                    receiver,
                    state: 'success',
                    response,
                }, {
                    transaction,
                });
                await new Promise((resolve) => {
                    setTimeout(resolve, 100);
                });
            }
            catch (error) {
                console.error(error);
                await this.createLog({
                    receiver,
                    state: 'fail',
                    response: {},
                }, {
                    transaction,
                });
            }
        }
    }
    getSubject() {
        return this.subject;
    }
    getBody(data) {
        const compiled = lodash.template(this.body);
        const body = compiled(data);
        return body;
    }
}
//# sourceMappingURL=Notification.js.map