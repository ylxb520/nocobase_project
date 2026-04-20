import { Collection, FlowModel, MultiRecordResource } from '@nocobase/flow-engine';
import React from 'react';
import { ActionModel } from './action-model';
import { TableColumnModel } from './table-column-model';
type S = {
    subModels: {
        columns: TableColumnModel[];
        actions: ActionModel[];
    };
};
export declare class TableModel extends FlowModel<S> {
    collection: Collection;
    resource: MultiRecordResource;
    getColumns(): {
        render: (value: any, record: any, index: any) => React.JSX.Element;
    }[];
    render(): React.JSX.Element;
}
export {};
