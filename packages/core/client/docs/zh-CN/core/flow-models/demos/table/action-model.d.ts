import { FlowModel } from '@nocobase/flow-engine';
import React from 'react';
export declare class ActionModel extends FlowModel {
    set onClick(fn: any);
    render(): React.JSX.Element;
}
export declare class LinkActionModel extends ActionModel {
    render(): React.JSX.Element;
}
export declare class DeleteActionModel extends ActionModel {
    render(): React.JSX.Element;
}
