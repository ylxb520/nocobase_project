/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils/client';
import React, { createContext, useCallback, useContext } from 'react';
import { lang, NAMESPACE } from '../locale';
import { css, cx, useCompile, Variable } from '@nocobase/client';
import { useWorkflowVariableOptions } from '../variable';
import { Button, Select } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { CloseCircleOutlined } from '@ant-design/icons';
export const calculators = new Registry();
calculators.register('equal', {
    name: '=',
    type: 'boolean',
    group: 'boolean',
});
calculators.register('notEqual', {
    name: '≠',
    type: 'boolean',
    group: 'boolean',
});
calculators.register('gt', {
    name: '>',
    type: 'boolean',
    group: 'boolean',
});
calculators.register('gte', {
    name: '≥',
    type: 'boolean',
    group: 'boolean',
});
calculators.register('lt', {
    name: '<',
    type: 'boolean',
    group: 'boolean',
});
calculators.register('lte', {
    name: '≤',
    type: 'boolean',
    group: 'boolean',
});
calculators.register('add', {
    name: '+',
    type: 'number',
    group: 'number',
});
calculators.register('minus', {
    name: '-',
    type: 'number',
    group: 'number',
});
calculators.register('multiple', {
    name: '*',
    type: 'number',
    group: 'number',
});
calculators.register('divide', {
    name: '/',
    type: 'number',
    group: 'number',
});
calculators.register('mod', {
    name: '%',
    type: 'number',
    group: 'number',
});
calculators.register('includes', {
    name: '{{t("contains")}}',
    type: 'boolean',
    group: 'string',
});
calculators.register('notIncludes', {
    name: '{{t("does not contain")}}',
    type: 'boolean',
    group: 'string',
});
calculators.register('startsWith', {
    name: '{{t("starts with")}}',
    type: 'boolean',
    group: 'string',
});
calculators.register('notStartsWith', {
    name: '{{t("not starts with")}}',
    type: 'boolean',
    group: 'string',
});
calculators.register('endsWith', {
    name: '{{t("ends with")}}',
    type: 'boolean',
    group: 'string',
});
calculators.register('notEndsWith', {
    name: '{{t("not ends with")}}',
    type: 'boolean',
    group: 'string',
});
calculators.register('concat', {
    name: `{{t("Concatenate", { ns: "${NAMESPACE}" })}}`,
    type: 'string',
    group: 'string',
});
const calculatorGroups = [
    {
        value: 'boolean',
        title: '{{t("Comparision")}}',
    },
    {
        value: 'number',
        title: `{{t("Arithmetic calculation", { ns: "${NAMESPACE}" })}}`,
    },
    {
        value: 'string',
        title: `{{t("String operation", { ns: "${NAMESPACE}" })}}`,
    },
    {
        value: 'date',
        title: `{{t("Date", { ns: "${NAMESPACE}" })}}`,
    },
];
function getGroupCalculators(group) {
    return Array.from(calculators.getEntities()).filter(([key, value]) => value.group === group);
}
function Calculation({ calculator, operands = [], onChange }) {
    const compile = useCompile();
    const useVariableHook = useContext(VariableHookContext);
    const leftOptions = useVariableHook();
    const rightOptions = useVariableHook();
    const leftOperandOnChange = useCallback((v) => onChange({ calculator, operands: [v, operands[1]] }), [calculator, onChange, operands]);
    const rightOperandOnChange = useCallback((v) => onChange({ calculator, operands: [operands[0], v] }), [calculator, onChange, operands]);
    const operatorOnChange = useCallback((v) => onChange({ operands, calculator: v }), [onChange, operands]);
    return (React.createElement("fieldset", { className: css `
        display: flex;
        gap: 0.5em;
        align-items: center;
        flex-wrap: wrap;
      ` },
        React.createElement(Variable.Input, { changeOnSelect: true, value: operands[0], onChange: leftOperandOnChange, scope: leftOptions, useTypedConstant: true }),
        React.createElement(Select
        // @ts-ignore
        , { 
            // @ts-ignore
            role: "button", "aria-label": "select-operator-calc", value: calculator, onChange: operatorOnChange, placeholder: lang('Operator'), popupMatchSelectWidth: false, className: "auto-width" }, calculatorGroups
            .filter((group) => Boolean(getGroupCalculators(group.value).length))
            .map((group) => (React.createElement(Select.OptGroup, { key: group.value, label: compile(group.title) }, getGroupCalculators(group.value).map(([value, { name }]) => (React.createElement(Select.Option, { key: value, value: value }, compile(name)))))))),
        React.createElement(Variable.Input, { changeOnSelect: true, value: operands[1], onChange: rightOperandOnChange, scope: rightOptions, useTypedConstant: true })));
}
function CalculationItem({ value, onChange, onRemove }) {
    if (!value) {
        return null;
    }
    const { calculator, operands = [] } = value;
    return (React.createElement("div", { className: css `
        display: flex;
        position: relative;
        margin: 0.5em 0;
      ` },
        value.group ? (React.createElement(CalculationGroup, { value: value.group, onChange: (group) => onChange({ ...value, group }) })) : (React.createElement(Calculation, { operands: operands, calculator: calculator, onChange: onChange })),
        React.createElement(Button, { "aria-label": "icon-close", onClick: onRemove, type: "link", icon: React.createElement(CloseCircleOutlined, null) })));
}
function CalculationGroup({ value, onChange }) {
    const { t } = useTranslation();
    const { type = 'and', calculations = [] } = value;
    const onAddSingle = useCallback(() => {
        onChange({
            ...value,
            calculations: [...calculations, { not: false, calculator: 'equal' }],
        });
    }, [value, calculations, onChange]);
    const onAddGroup = useCallback(() => {
        onChange({
            ...value,
            calculations: [...calculations, { not: false, group: { type: 'and', calculations: [] } }],
        });
    }, [value, calculations, onChange]);
    const onRemove = useCallback((i) => {
        calculations.splice(i, 1);
        onChange({ ...value, calculations: [...calculations] });
    }, [value, calculations, onChange]);
    const onItemChange = useCallback((i, v) => {
        calculations.splice(i, 1, v);
        onChange({ ...value, calculations: [...calculations] });
    }, [value, calculations, onChange]);
    return (React.createElement("div", { className: cx('node-type-condition-group', css `
          position: relative;
          width: 100%;
          .node-type-condition-group {
            padding: 0.5em 1em;
            border: 1px dashed #ddd;
          }
          + button {
            position: absolute;
            right: 0;
          }
        `) },
        React.createElement("div", { className: css `
          display: flex;
          align-items: center;
          gap: 0.5em;
          .ant-select {
            width: auto;
            min-width: 6em;
          }
        ` },
            React.createElement(Trans, null,
                'Meet ',
                React.createElement(Select
                // @ts-ignore
                , { 
                    // @ts-ignore
                    role: "button", "data-testid": "filter-select-all-or-any", value: type, onChange: (t) => onChange({ ...value, type: t }) },
                    React.createElement(Select.Option, { value: "and" }, "All"),
                    React.createElement(Select.Option, { value: "or" }, "Any")),
                ' conditions in the group')),
        React.createElement("div", { className: "calculation-items" }, calculations.map((calculation, i) => (React.createElement(CalculationItem, { key: `${calculation.calculator}_${i}`, value: calculation, onChange: onItemChange.bind(this, i), onRemove: () => onRemove(i) })))),
        React.createElement("div", { className: css `
          button {
            padding: 0;
            &:not(:last-child) {
              margin-right: 1em;
            }
          }
        ` },
            React.createElement(Button, { type: "link", onClick: onAddSingle }, t('Add condition')),
            React.createElement(Button, { type: "link", onClick: onAddGroup }, t('Add condition group')))));
}
const VariableHookContext = createContext(useWorkflowVariableOptions);
export function CalculationConfig({ value, onChange, useVariableHook = useWorkflowVariableOptions }) {
    const rule = value && Object.keys(value).length ? value : { group: { type: 'and', calculations: [] } };
    return (React.createElement(VariableHookContext.Provider, { value: useVariableHook },
        React.createElement(CalculationGroup, { value: rule.group, onChange: (group) => onChange({ ...rule, group }) })));
}
//# sourceMappingURL=Calculation.js.map