/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ArrayTable, FormButtonGroup, FormDrawer, FormLayout, Submit } from '@formily/antd-v5';
import { onFieldValueChange } from '@formily/core';
import { SchemaOptionsContext, useForm, useFormEffects } from '@formily/react';
import { CollectionFieldInterface, Cron, SchemaComponent, SchemaComponentOptions, css, interfacesProperties, useCompile, useToken, } from '@nocobase/client';
import { error } from '@nocobase/utils/client';
import { Button, Select } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACE, lang } from './locale';
function RuleTypeSelect(props) {
    const compile = useCompile();
    const { setValuesIn } = useForm();
    const index = ArrayTable.useIndex();
    useFormEffects(() => {
        onFieldValueChange(`patterns.${index}.type`, (field) => {
            const type = RuleTypes[field.value];
            setValuesIn(`patterns.${index}.options`, type.defaults ? { ...type.defaults } : {});
        });
    });
    return (React.createElement(Select, { popupMatchSelectWidth: false, ...props }, Object.keys(RuleTypes).map((key) => (React.createElement(Select.Option, { key: key, value: key }, compile(RuleTypes[key].title))))));
}
function RuleOptions() {
    const compile = useCompile();
    const { values } = useForm();
    const index = ArrayTable.useIndex();
    const { type, options } = values.patterns[index];
    const ruleType = RuleTypes[type];
    return (React.createElement("div", { className: css `
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
      ` }, Object.keys(options)
        .filter((key) => typeof options[key] !== 'undefined' && ruleType.optionRenders[key])
        .map((key) => {
        const Component = ruleType.optionRenders[key];
        const { title } = ruleType.fieldset[key];
        return Component ? (React.createElement("dl", { key: key, className: css `
                margin: 0;
                padding: 0;
              ` },
            React.createElement("dt", null, compile(title)),
            React.createElement("dd", { className: css `
                  margin-bottom: 0;
                ` },
                React.createElement(Component, { key: key, value: options[key] })))) : null;
    })));
}
const RuleTypes = {
    string: {
        title: `{{t("Fixed text", { ns: "${NAMESPACE}" })}}`,
        optionRenders: {
            value(options = { value: '' }) {
                return React.createElement("code", null, options.value);
            },
        },
        fieldset: {
            value: {
                type: 'string',
                title: `{{t("Text content", { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
            },
        },
    },
    randomChar: {
        title: `{{t("Random character", { ns: "${NAMESPACE}" })}}`,
        optionRenders: {
            length: function Length({ value }) {
                return React.createElement("code", null, value);
            },
            charsets: function Charsets({ value }) {
                const { t } = useTranslation();
                const charsetLabels = {
                    number: t('Number', { ns: NAMESPACE }),
                    lowercase: t('Lowercase letters', { ns: NAMESPACE }),
                    uppercase: t('Uppercase letters', { ns: NAMESPACE }),
                    symbol: t('Symbols', { ns: NAMESPACE }),
                };
                return (React.createElement("code", null, value?.map((charset) => charsetLabels[charset]).join(', ') || t('Number', { ns: NAMESPACE })));
            },
        },
        fieldset: {
            length: {
                type: 'number',
                title: `{{t("Length", { ns: "${NAMESPACE}" })}}`,
                description: `{{t("Will generate random characters with specified length.", { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                    min: 1,
                    max: 32,
                },
                required: true,
                default: 6,
            },
            charsets: {
                type: 'array',
                title: `{{t("Character sets", { ns: "${NAMESPACE}" })}}`,
                description: `{{t("Select character sets to generate random characters.", { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                    mode: 'multiple',
                    allowClear: false,
                },
                enum: [
                    { value: 'number', label: `{{t("Number", { ns: "${NAMESPACE}" })}}` },
                    { value: 'lowercase', label: `{{t("Lowercase letters", { ns: "${NAMESPACE}" })}}` },
                    { value: 'uppercase', label: `{{t("Uppercase letters", { ns: "${NAMESPACE}" })}}` },
                    { value: 'symbol', label: `{{t("Symbols", { ns: "${NAMESPACE}" })}}` },
                ],
                required: true,
                default: ['number'],
                'x-validator': {
                    minItems: 1,
                    message: `{{t("At least one character set should be selected", { ns: "${NAMESPACE}" })}}`,
                },
            },
        },
        defaults: {
            length: 6,
            charsets: ['number'],
        },
    },
    integer: {
        title: `{{t("Autoincrement", { ns: "${NAMESPACE}" })}}`,
        optionRenders: {
            digits: function Digits({ value }) {
                return React.createElement("code", null, value);
            },
            start: function Start({ value }) {
                return React.createElement("code", null, value);
            },
            cycle: Cron.ReadPretty,
        },
        fieldset: {
            digits: {
                type: 'number',
                title: `{{t("Digits", { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                    min: 1,
                    max: 10,
                },
                required: true,
                default: 1,
                'x-reactions': {
                    target: 'start',
                    fulfill: {
                        schema: {
                            'x-component-props.max': '{{ 10 ** $self.value - 1 }}',
                        },
                    },
                },
            },
            start: {
                type: 'number',
                title: `{{t("Start from", { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
                'x-component-props': {
                    min: 0,
                },
                required: true,
                default: 0,
                // 'x-reactions': {
                //   dependencies: ['.start', '.base'],
                //   fulfill: {
                //     schema: {
                //       'x-component-props.max': '{{ ($deps[1] ?? 10) ** ($deps[0] ?? 1) - 1 }}'
                //     }
                //   }
                // }
            },
            cycle: {
                type: 'string',
                title: `{{t("Reset cycle", { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                ['x-component']({ value, onChange }) {
                    const shortValues = [
                        { label: 'No reset', value: 0 },
                        { label: 'Daily', value: 1, cron: '0 0 * * *' },
                        { label: 'Every Monday', value: 2, cron: '0 0 * * 1' },
                        { label: 'Monthly', value: 3, cron: '0 0 1 * *' },
                        { label: 'Yearly', value: 4, cron: '0 0 1 1 *' },
                        { label: 'Customize', value: 5, cron: '* * * * *' },
                    ];
                    const option = typeof value === 'undefined'
                        ? shortValues[0]
                        : shortValues.find((item) => {
                            return item.cron == value;
                        }) || shortValues[5];
                    return (React.createElement("fieldset", null,
                        React.createElement(Select, { value: option.value, onChange: (v) => onChange(shortValues[v].cron) }, shortValues.map((item) => (React.createElement(Select.Option, { key: item.value, value: item.value }, lang(item.label))))),
                        option.value === 5 ? React.createElement(Cron, { value: value, onChange: onChange, clearButton: false }) : null));
                },
                default: null,
            },
        },
        defaults: {
            digits: 4,
            start: 1,
        },
    },
    date: {
        title: `{{t("Date", { ns: "${NAMESPACE}" })}}`,
        optionRenders: {
            format(options = { value: 'YYYYMMDD' }) {
                return React.createElement("code", null, options.value);
            },
        },
        fieldset: {
            format: {
                type: 'string',
                title: `{{t("Date format", { ns: "${NAMESPACE}" })}}`,
                description: `{{t('Supports all formats of the Day.js library, such as "YYYYMMDD", "YYYY-MM-DD", etc.', { ns: "${NAMESPACE}" })}}`,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: 'YYYYMMDD',
            },
        },
        defaults: {
            format: 'YYYYMMDD',
        },
    },
};
export function RuleConfigForm() {
    const { t } = useTranslation();
    const compile = useCompile();
    const schemaOptions = useContext(SchemaOptionsContext);
    const { values, setValuesIn } = useForm();
    const index = ArrayTable.useIndex();
    const { type, options } = values.patterns[index];
    const ruleType = RuleTypes[type];
    const { token } = useToken();
    return ruleType?.fieldset ? (React.createElement(Button, { type: "link", onClick: () => {
            // fix https://nocobase.height.app/T-2868
            FormDrawer({ title: compile(ruleType.title), zIndex: token.zIndexPopupBase + 1000 }, () => {
                return (React.createElement(FormLayout, { layout: "vertical" },
                    React.createElement(SchemaComponentOptions, { scope: schemaOptions.scope, components: schemaOptions.components },
                        React.createElement(SchemaComponent, { schema: {
                                type: 'object',
                                'x-component': 'fieldset',
                                properties: ruleType.fieldset,
                            } })),
                    React.createElement(FormDrawer.Footer, null,
                        React.createElement(FormButtonGroup, { className: css `
                    justify-content: flex-end;
                  ` },
                            React.createElement(Submit, { onSubmit: (values) => {
                                    return values;
                                } }, t('Submit'))))));
            })
                .open({
                initialValues: options,
            })
                .then((values) => {
                setValuesIn(`patterns.${index}`, { type, options: { ...values } });
            })
                .catch((err) => {
                error(err);
            });
        } }, t('Configure'))) : null;
}
export class SequenceFieldInterface extends CollectionFieldInterface {
    name = 'sequence';
    type = 'object';
    group = 'advanced';
    order = 3;
    title = `{{t("Sequence", { ns: "${NAMESPACE}" })}}`;
    description = `{{t("Automatically generate codes based on configured rules, supporting combinations of dates, numbers, and text.", { ns: "${NAMESPACE}" })}}`;
    sortable = true;
    default = {
        type: 'sequence',
        uiSchema: {
            type: 'string',
            'x-component': 'Input',
            'x-component-props': {},
        },
    };
    availableTypes = ['string'];
    hasDefaultValue = false;
    filterable = {
        operators: interfacesProperties.operators.string,
    };
    titleUsable = true;
    properties = {
        ...interfacesProperties.defaultProps,
        unique: interfacesProperties.unique,
        patterns: {
            type: 'array',
            title: `{{t("Sequence rules", { ns: "${NAMESPACE}" })}}`,
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'ArrayTable',
            items: {
                type: 'object',
                properties: {
                    sort: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { width: 50, title: '', align: 'center' },
                        properties: {
                            sort: {
                                type: 'void',
                                'x-component': 'ArrayTable.SortHandle',
                            },
                        },
                    },
                    type: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { title: `{{t("Type", { ns: "${NAMESPACE}" })}}` },
                        // 'x-hidden': true,
                        properties: {
                            type: {
                                type: 'string',
                                name: 'type',
                                required: true,
                                'x-decorator': 'FormItem',
                                'x-component': RuleTypeSelect,
                            },
                        },
                    },
                    options: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': { title: `{{t("Rule content", { ns: "${NAMESPACE}" })}}` },
                        properties: {
                            options: {
                                type: 'object',
                                name: 'options',
                                'x-component': RuleOptions,
                            },
                        },
                    },
                    operations: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                            title: `{{t("Operations", { ns: "${NAMESPACE}" })}}`,
                            dataIndex: 'operations',
                            fixed: 'right',
                            className: css `
                > *:not(:last-child) {
                  margin-right: 0.5em;
                }
                button {
                  padding: 0;
                }
              `,
                        },
                        properties: {
                            config: {
                                type: 'void',
                                properties: {
                                    options: {
                                        type: 'object',
                                        'x-component': RuleConfigForm,
                                    },
                                },
                            },
                            remove: {
                                type: 'void',
                                'x-component': 'ArrayTable.Remove',
                            },
                        },
                    },
                },
            },
            properties: {
                add: {
                    type: 'void',
                    'x-component': 'ArrayTable.Addition',
                    'x-component-props': {
                        defaultValue: { type: 'integer', options: { ...RuleTypes.integer.defaults } },
                    },
                    title: `{{t("Add rule", { ns: "${NAMESPACE}" })}}`,
                },
            },
        },
        inputable: {
            type: 'boolean',
            title: `{{t("Inputable", { ns: "${NAMESPACE}" })}}`,
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox',
        },
        match: {
            type: 'boolean',
            title: `{{t("Match rules", { ns: "${NAMESPACE}" })}}`,
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox',
            'x-reactions': {
                dependencies: ['inputable'],
                fulfill: {
                    state: {
                        value: '{{$deps[0] && $self.value}}',
                        visible: '{{$deps[0] === true}}',
                    },
                },
            },
        },
    };
}
//# sourceMappingURL=sequence.js.map