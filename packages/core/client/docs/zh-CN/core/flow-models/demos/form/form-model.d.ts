import { Form } from '@formily/core';
import { Collection, FlowModel, SingleRecordResource } from '@nocobase/flow-engine';
import React from 'react';
export declare class FormModel extends FlowModel {
    form: Form;
    resource: SingleRecordResource;
    collection: Collection;
    render(): React.JSX.Element;
    openDialog({ filterByTk }: {
        filterByTk: any;
    }): Promise<unknown>;
}
