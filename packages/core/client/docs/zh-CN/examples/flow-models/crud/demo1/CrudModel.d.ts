import { FlowModel, MultiRecordResource } from '@nocobase/flow-engine';
import React from 'react';
export declare class CrudModel extends FlowModel {
    resource: MultiRecordResource;
    onInit(options: any): void;
    render(): React.JSX.Element;
}
