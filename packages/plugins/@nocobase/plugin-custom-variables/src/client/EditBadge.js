/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import { useCurrentRoute, useNocoBaseRoutes, useVariableOptions, Variable } from '@nocobase/client';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SchemaSettingsModalItem } from '@nocobase/client';
import { NAMESPACE } from '../locale';
const BadgeVariableTextArea = (props) => {
  const variables = useVariableOptions({});
  return React.createElement(Variable.TextArea, { ...props, scope: variables });
};
const EditBadge = () => {
  const { t } = useTranslation(NAMESPACE);
  const currentRoute = useCurrentRoute();
  const { updateRoute } = useNocoBaseRoutes();
  const schema = useMemo(() => {
    return {
      type: 'object',
      title: t('Edit badge'),
      properties: {
        count: {
          title: t('Badge'),
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: t('You can enter numbers, text, variables, aggregation variables, expressions, etc.'),
          },
          'x-component': BadgeVariableTextArea,
          description: React.createElement(
            'span',
            null,
            t('Syntax references: '),
            React.createElement(
              'a',
              {
                href: 'https://docs.nocobase.com/handbook/calculation-engines/formula',
                target: '_blank',
                rel: 'noreferrer',
              },
              'Formula.js',
            ),
          ),
        },
        color: {
          title: t('Background color'),
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {},
        },
        textColor: {
          title: t('Text color'),
          'x-decorator': 'FormItem',
          'x-component': 'ColorPicker',
          'x-component-props': {},
        },
        size: {
          title: t('Size'),
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            { label: t('Default'), value: 'default' },
            { label: t('Small'), value: 'small' },
          ],
          default: 'default',
        },
        overflowCount: {
          title: t('Max number'),
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: t('Maximum number to display when the badge is a number'),
          },
          'x-component': 'InputNumber',
          default: 99,
        },
        showZero: {
          title: t('Show zero'),
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: t('Whether to show the badge when it is a number and the number is 0'),
          },
          'x-component': 'Checkbox',
          default: false,
        },
      },
    };
  }, [t]);
  const initialValues = useMemo(() => {
    return currentRoute.options?.badge;
  }, [currentRoute.options?.badge]);
  const onEditBadgeSubmit = useCallback(
    (badge) => {
      // Update the route corresponding to the menu
      if (currentRoute.id !== undefined) {
        updateRoute(currentRoute.id, {
          options: {
            ...currentRoute.options,
            badge: {
              ...currentRoute.options?.badge,
              ...badge,
              count: badge.count == null || badge.count === '' ? undefined : badge.count,
            },
          },
        });
      }
    },
    [currentRoute.id, currentRoute.options, updateRoute],
  );
  return React.createElement(SchemaSettingsModalItem, {
    title: t('Edit badge'),
    eventKey: 'edit-badge',
    schema: schema,
    initialValues: initialValues,
    onSubmit: onEditBadgeSubmit,
  });
};
export default EditBadge;
//# sourceMappingURL=EditBadge.js.map
