import { CollectionField, FlowModel, ModelRenderMode } from '@nocobase/flow-engine';
import React from 'react';
export declare class TableColumnModel extends FlowModel {
    static renderMode: ModelRenderMode;
    field: CollectionField;
    fieldPath: string;
    getColumnProps(): {
        render: (value: any, record: any, index: any) => React.JSX.Element;
    };
    render(): (value: any, record: any, index: any) => React.JSX.Element;
}
export declare class TableColumnActionsModel extends TableColumnModel {
    static renderMode: ModelRenderMode;
    getColumnProps(): {
        render: (value: any, record: any, index: any) => React.JSX.Element;
        title: string;
    };
    render(): (value: any, record: any, index: any) => React.JSX.Element;
}
