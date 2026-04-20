/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { MenuOutlined } from '@ant-design/icons';
import { DndContext, DragOverlay, MouseSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { RecursionField, observer } from '@formily/react';
import { uid } from '@formily/shared';
import {
  CollectionCategoriesContext,
  SchemaComponent,
  SchemaComponentOptions,
  useAPIClient,
  useCompile,
  usePlugin,
  useResourceActionContext,
} from '@nocobase/client';
import { App, Badge, Card, Dropdown, Space, Tabs } from 'antd';
import _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CollectionFields } from './CollectionFields';
import { collectionTableSchema } from './schemas/collections';
import PluginDatabaseConnectionsClient from '../../../';
function Draggable(props) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
    data: props.data,
  });
  return React.createElement(
    'div',
    { ref: setNodeRef, ...listeners, ...attributes },
    React.createElement('div', null, props.children),
  );
}
function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
  });
  const style = isOver
    ? {
        color: 'green',
      }
    : undefined;
  return React.createElement('div', { ref: setNodeRef, style: style }, props.children);
}
const TabTitle = observer(
  ({ item }) => {
    return React.createElement(
      Droppable,
      { id: item.id.toString(), data: item },
      React.createElement(
        'div',
        null,
        React.createElement(
          Draggable,
          { id: item.id.toString(), data: item },
          React.createElement(TabBar, { item: item }),
        ),
      ),
    );
  },
  { displayName: 'TabTitle' },
);
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
  const { data, refresh } = useContext(CollectionCategoriesContext);
  const { refresh: refreshCM, run, defaultRequest, setState } = useResourceActionContext();
  const [activeKey, setActiveKey] = useState({ tab: 'all' });
  const [key, setKey] = useState(activeKey.tab);
  const compile = useCompile();
  const api = useAPIClient();
  const { modal } = App.useApp();
  const tabsItems = useMemo(() => {
    if (!data) return [];
    const res = data
      .sort((a, b) => b.sort - a.sort)
      .concat()
      .map((v) => {
        return {
          ...v,
          schema: collectionTableSchema,
        };
      });
    !res.find((v) => v.id === 'all') &&
      res.unshift({
        name: '{{t("All collections")}}',
        id: 'all',
        sort: 0,
        closable: false,
        schema: collectionTableSchema,
      });
    return res;
  }, [data]);
  useEffect(() => {
    if (activeKey.tab !== 'all') {
      onChange(activeKey.tab);
    }
  }, []);
  const onChange = (key) => {
    setActiveKey({ tab: key });
    setKey(uid());
    if (key !== 'all') {
      const prevFilter = defaultRequest?.params?.filter;
      const filter = { $and: [prevFilter, { 'category.id': key }] };
      run({ filter });
      setState?.({ category: [+key], params: [{ filter }] });
    } else {
      run();
      setState?.({ category: [], params: [] });
    }
  };
  const remove = (key) => {
    modal.confirm({
      title: compile("{{t('Delete category')}}"),
      content: compile("{{t('Are you sure you want to delete it?')}}"),
      onOk: async () => {
        await api.resource('collectionCategories').destroy({
          filter: {
            id: key,
          },
        });
        key === +activeKey.tab && setActiveKey({ tab: 'all' });
        await refresh();
        await refreshCM();
      },
    });
  };
  const loadCategories = async () => {
    return data.map((item) => ({
      label: t(compile(item.name)),
      value: item.id,
    }));
  };
  const menu = _.memoize((item) => {
    return {
      items: [
        {
          key: 'edit',
          label: React.createElement(SchemaComponent, {
            schema: {
              type: 'void',
              properties: {
                [uid()]: {
                  'x-component': 'EditCategory',
                  'x-component-props': {
                    item: item,
                  },
                },
              },
            },
          }),
        },
        {
          key: 'delete',
          label: compile("{{t('Delete category')}}"),
          onClick: () => remove(item.id),
        },
      ],
    };
  });
  if (!data) return null;
  return React.createElement(
    DndProvider,
    null,
    React.createElement(Tabs, {
      addIcon: React.createElement(SchemaComponent, {
        schema: {
          type: 'void',
          properties: {
            addCategories: {
              type: 'void',
              title: '{{ t("Add category") }}',
              'x-component': 'AddCategory',
              'x-component-props': {
                type: 'primary',
              },
            },
          },
        },
      }),
      onChange: onChange,
      defaultActiveKey: activeKey.tab || 'all',
      type: 'editable-card',
      destroyInactiveTabPane: true,
      tabBarStyle: { marginBottom: '0px' },
      items: tabsItems.map((item) => {
        return {
          label:
            item.id !== 'all'
              ? React.createElement('div', { 'data-no-dnd': 'true' }, React.createElement(TabTitle, { item: item }))
              : compile(item.name),
          key: String(item.id),
          closable: item.closable,
          closeIcon: React.createElement(
            Dropdown,
            { menu: menu(item) },
            React.createElement(MenuOutlined, {
              role: 'button',
              'aria-label': compile(item.name),
              style: { padding: 8, margin: '-8px' },
            }),
          ),
          children: React.createElement(
            Card,
            { bordered: false },
            React.createElement(
              SchemaComponentOptions,
              {
                components: { CollectionFields, ExtendableActions },
                inherit: true,
                scope: { loadCategories, categoryVisible: item.id === 'all', categoryId: item.id },
              },
              React.createElement(RecursionField, { name: key, schema: item.schema, onlyRenderProperties: true }),
            ),
          ),
        };
      }),
    }),
  );
};
const ExtendableActions = () => {
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const managerActions = plugin.extensionManager.getManagerActions();
  return managerActions?.length
    ? React.createElement(
        'div',
        { style: { margin: '0px 8px' } },
        _.sortBy(managerActions, 'order').map((action, index) => React.createElement(action.component, { key: index })),
      )
    : React.createElement(React.Fragment, null);
};
//# sourceMappingURL=ConfigurationTabs.js.map
