import { FlowModel } from '@nocobase/flow-engine';
import React from 'react';
export interface DefaultStructure {
    parent?: FlowModel;
    subModels: {
        sub1: HelloSubModel;
    };
}
declare class HelloSubModel extends FlowModel {
    item: any;
    setItem(item: any): void;
    render(): React.JSX.Element;
}
declare const _default: React.FC<{
    children?: React.ReactNode;
}>;
export default _default;
