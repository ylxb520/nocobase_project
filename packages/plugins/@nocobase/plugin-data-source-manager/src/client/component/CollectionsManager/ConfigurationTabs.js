/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { RecursionField, observer } from '@formily/react';
import { Badge, Card, Space } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAPIClient,
  SchemaComponentOptions,
  useCompile,
  useResourceActionContext,
  CollectionCategoriesContext,
} from '@nocobase/client';
import { CollectionFields } from './CollectionFields';
import { CollectionName } from './components/CollectionName';
import { collectionTableSchema } from './schema/collections';
const TabBar = ({ item }) => {
  const { t } = useTranslation();
  const compile = useCompile();
  return React.createElement(Space, null, React.createElement(Badge, { color: item.color }), t(compile(item.name)));
};
const DndProvider = observer(
  (props) => {
    const [activeTab, setActiveId] = useState(null);
    const { refresh } = useContext(CollectionCategoriesContext);
    const { refresh: refreshCM } = useResourceActionContext();
    const api = useAPIClient();
    const onDragEnd = async (props) => {
      const { active, over } = props;
      setTimeout(() => {
        setActiveId(null);
      });
      if (over && over.id !== active.id) {
        await api.resource('collectionCategories').move({
          sourceId: active.id,
          targetId: over.id,
        });
        await refresh();
        await refreshCM();
      }
    };
    function onDragStart(event) {
      setActiveId(event.active?.data.current);
    }
    const mouseSensor = useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    });
    const sensors = useSensors(mouseSensor);
    return React.createElement(
      DndContext,
      { sensors: sensors, onDragEnd: onDragEnd, onDragStart: onDragStart },
      props.children,
      React.createElement(
        DragOverlay,
        null,
        activeTab
          ? React.createElement(
              'span',
              { style: { whiteSpace: 'nowrap' } },
              React.createElement(TabBar, { item: activeTab }),
            )
          : null,
      ),
    );
  },
  { displayName: 'DndProvider' },
);
export const ConfigurationTabs = () => {
  const { t } = useTranslation();
  const { data } = useContext(CollectionCategoriesContext);
  const compile = useCompile();
  if (!data) return null;
  const tabsItems = data
    .sort((a, b) => b.sort - a.sort)
    .concat()
    .map((v) => {
      return {
        ...v,
        schema: collectionTableSchema,
      };
    });
  !tabsItems.find((v) => v.id === 'all') &&
    tabsItems.unshift({
      name: '{{t("All collections")}}',
      id: 'all',
      sort: 0,
      closable: false,
      schema: collectionTableSchema,
    });
  const loadCategories = async () => {
    return data.map((item) => ({
      label: t(compile(item.name)),
      value: item.id,
    }));
  };
  return React.createElement(
    DndProvider,
    null,
    React.createElement(
      Card,
      { bordered: false },
      React.createElement(
        SchemaComponentOptions,
        {
          components: { CollectionFields, CollectionName },
          inherit: true,
          scope: {
            loadCategories,
          },
        },
        React.createElement(RecursionField, { schema: collectionTableSchema, onlyRenderProperties: true }),
      ),
    ),
  );
};
//# sourceMappingURL=ConfigurationTabs.js.map
