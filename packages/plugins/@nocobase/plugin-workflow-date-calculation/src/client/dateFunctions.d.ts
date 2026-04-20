import React from 'react';
import { MenuItemGroupType } from 'antd/es/menu/interface';
export declare function useFunctionOptions(inputType?: string): MenuItemGroupType<import("antd/es/menu/interface").MenuItemType>[];
export declare const functions: {
    add: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            compact: {
                type: string;
                'x-component': string;
                properties: {
                    number: {
                        'x-component-props': {
                            changeOnSelect: boolean;
                            useTypedConstant: (string | {
                                precision: number;
                            })[][];
                        };
                        'x-component': string;
                        default: number;
                    };
                    unit: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            className: string;
                        };
                        enum: {
                            label: string;
                            value: string;
                        }[];
                        default: string;
                    };
                };
            };
        };
        defaultParams: () => {
            number: number;
            unit: string;
        };
    };
    subtract: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            compact: {
                type: string;
                'x-component': string;
                properties: {
                    number: {
                        'x-component-props': {
                            changeOnSelect: boolean;
                            useTypedConstant: (string | {
                                precision: number;
                            })[][];
                        };
                        'x-component': string;
                        default: number;
                    };
                    unit: {
                        type: string;
                        'x-component': string;
                        'x-component-props': {
                            className: string;
                        };
                        enum: {
                            label: string;
                            value: string;
                        }[];
                    };
                };
            };
        };
        defaultParams: () => {
            number: number;
            unit: string;
        };
    };
    diff: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            date: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    useTypedConstant: string[];
                    variableOptions: {
                        types: string[];
                    };
                };
            };
            unit: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
            };
            isAbs: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    className: string;
                };
                'x-content': string;
            };
            round: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    allowClear: boolean;
                    placeholder: string;
                    className: string;
                };
                enum: ({
                    value: boolean;
                    label: string;
                } | {
                    value: number;
                    label: string;
                })[];
            };
        };
        defaultParams: () => {
            date: Date;
            unit: string;
            isAbs: boolean;
            round: boolean;
        };
    };
    get: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            unit: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
        };
        defaultParams: () => {
            unit: string;
        };
    };
    toTimestamp: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            unitBeforeText: {
                type: string;
                'x-component': string;
                'x-content': string;
            };
            unit: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
        };
    };
    tsToDate: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            unitBeforeText: {
                type: string;
                'x-component': string;
                'x-content': string;
            };
            unit: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
        };
    };
    startOfTime: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            unit: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
        };
        defaultParams: () => {
            unit: string;
        };
    };
    endOfTime: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            unit: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
        };
        defaultParams: () => {
            unit: string;
        };
    };
    isLeapYear: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {};
    };
    format: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            format: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                };
                default: string;
            };
        };
        defaultParams: () => {
            format: string;
        };
    };
    transDuration: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            unitBeforeText: {
                type: string;
                'x-component': string;
                'x-content': string;
            };
            unitBefore: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
            unitAfterText: {
                type: string;
                'x-component': string;
                'x-content': string;
            };
            unitAfter: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    placeholder: string;
                    className: string;
                };
                enum: {
                    label: string;
                    value: string;
                }[];
                default: string;
            };
            round: {
                type: string;
                'x-component': string;
                'x-component-props': {
                    allowClear: boolean;
                    className: string;
                };
                enum: ({
                    value: boolean;
                    label: string;
                } | {
                    value: number;
                    label: string;
                })[];
            };
        };
        defaultParams: () => {
            unitBefore: string;
            unitAfter: string;
            round: boolean;
        };
    };
    changeTimezone: {
        key: string;
        title: string;
        groupKey: string;
        inputType: string;
        outputType: string;
        fieldset: {
            timezone: {
                type: string;
                'x-component': React.ForwardRefExoticComponent<Omit<Partial<any>, "ref"> & React.RefAttributes<unknown>>;
                'x-component-props': {
                    placeholder: string;
                    showSearch: boolean;
                };
            };
        };
    };
};
