import { SchemaInitializerItemType } from '@nocobase/client';
import { Instruction, WorkflowVariableInput } from '@nocobase/plugin-workflow/client';
import React from 'react';
import { SubModelItem } from '@nocobase/flow-engine';
declare function useScriptDescription(): React.JSX.Element;
export default class extends Instruction {
    title: string;
    type: string;
    group: string;
    description: string;
    icon: React.JSX.Element;
    fieldset: {
        arguments: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            default: any[];
            items: {
                type: string;
                'x-component': string;
                properties: {
                    name: {
                        type: string;
                        'x-decorator': string;
                        'x-component': string;
                        'x-component-props': {
                            placeholder: string;
                        };
                        'x-validator': (value: any, rule: any, ctx: any) => string | true;
                    };
                    value: {
                        type: string;
                        'x-decorator': string;
                        'x-component': string;
                        'x-component-props': {
                            changeOnSelect: boolean;
                            useTypedConstant: boolean;
                            placeholder: string;
                        };
                    };
                    remove: {
                        type: string;
                        'x-decorator': string;
                        'x-component': string;
                    };
                };
            };
            properties: {
                add: {
                    type: string;
                    title: string;
                    'x-component': string;
                };
            };
        };
        content: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            default: string;
        };
        timeout: {
            type: string;
            title: string;
            description: string;
            'x-decorator': string;
            'x-component': string;
            'x-component-props': {
                min: number;
                className: string;
                addonAfter: string;
            };
            default: number;
        };
        continue: {
            type: string;
            'x-decorator': string;
            'x-component': string;
            'x-content': string;
            default: boolean;
        };
    };
    scope: {
        useScriptDescription: typeof useScriptDescription;
    };
    components: {
        ArrayItems: import("@formily/reactive-react").ReactFC<React.HTMLAttributes<HTMLDivElement>> & import("@formily/antd-v5").ArrayBaseMixins & {
            Item: import("@formily/reactive-react").ReactFC<React.HTMLAttributes<HTMLDivElement> & {
                type?: "divide" | "card";
            }>;
        };
        CodeEditor: React.LazyExoticComponent<React.FC<{
            onChange: Function;
            value: string;
            disabled: boolean;
        }>>;
        WorkflowVariableInput: typeof WorkflowVariableInput;
        Space: React.ForwardRefExoticComponent<import("antd").SpaceProps & React.RefAttributes<HTMLDivElement>> & {
            Compact: React.FC<import("antd/es/space/Compact").SpaceCompactProps>;
        };
    };
    useVariables({ key, title }: {
        key: any;
        title: any;
    }, { types, fieldNames }: {
        types: any;
        fieldNames?: {
            readonly label: "label";
            readonly value: "value";
            readonly children: "children";
        };
    }): {
        value: any;
        label: any;
    };
    useInitializers(node: any): SchemaInitializerItemType;
    /**
     * 2.0
     */
    getCreateModelMenuItem({ node }: {
        node: any;
    }): SubModelItem;
    testable: boolean;
}
export {};
