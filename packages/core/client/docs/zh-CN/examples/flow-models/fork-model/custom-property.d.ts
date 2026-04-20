import { FlowModel } from '@nocobase/flow-engine';
import React from 'react';
export interface DefaultStructure {
    parent?: FlowModel;
    subModels: {
        sub1: HelloSubModel;
    };
}
declare class HelloSubModel extends FlowModel {
    text: string;
    ref: React.RefObject<HTMLDivElement>;
    render(): React.JSX.Element;
    protected onMount(): void;
}
declare const _default: React.FC<{
    children?: React.ReactNode;
}>;
export default _default;
