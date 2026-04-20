/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import React, { useContext } from 'react';
import { Input, Button, Empty, Dropdown, theme } from 'antd';
import { useDepartmentTranslation } from '../locale';
import { createStyles, useAPIClient, useRequest } from '@nocobase/client';
import { ResourcesContext } from '../ResourcesProvider';
const useStyles = createStyles(({ css }) => {
  return {
    searchDropdown: css`
      .ant-dropdown-menu {
        max-height: 500px;
        overflow-y: scroll;
      }
    `,
  };
});
export const AggregateSearch = () => {
  const { t } = useDepartmentTranslation();
  const { token } = theme.useToken();
  const { setDepartment, setUser } = useContext(ResourcesContext);
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [moreUsers, setMoreUsers] = React.useState(true);
  const [moreDepartments, setMoreDepartments] = React.useState(true);
  const { styles } = useStyles();
  const limit = 10;
  const api = useAPIClient();
  const service = useRequest(
    (params) =>
      api
        .resource('departments')
        .aggregateSearch(params)
        .then((res) => res?.data?.data),
    {
      manual: true,
      onSuccess: (data, params) => {
        const {
          values: { type },
        } = params[0] || {};
        if (!data) {
          return;
        }
        if ((!type || type === 'user') && data['users'].length < limit) {
          setMoreUsers(false);
        }
        if ((!type || type === 'department') && data['departments'].length < limit) {
          setMoreDepartments(false);
        }
        setUsers((users) => [...users, ...data['users']]);
        setDepartments((departments) => [...departments, ...data['departments']]);
      },
    },
  );
  const { run } = service;
  const handleSearch = (keyword) => {
    setKeyword(keyword);
    setUsers([]);
    setDepartments([]);
    setMoreUsers(true);
    setMoreDepartments(true);
    if (!keyword) {
      return;
    }
    run({
      values: { keyword, limit },
    });
    setOpen(true);
  };
  const handleChange = (e) => {
    if (e.target.value) {
      return;
    }
    setUser(null);
    setKeyword('');
    setOpen(false);
    service.mutate({});
    setUsers([]);
    setDepartments([]);
  };
  const getTitle = (department) => {
    const title = department.title;
    const parent = department.parent;
    if (parent) {
      return getTitle(parent) + ' / ' + title;
    }
    return title;
  };
  const LoadMore = (props) => {
    return React.createElement(
      Button,
      {
        type: 'link',
        style: { padding: '0 8px' },
        onClick: (e) => {
          setOpen(true);
          run({
            values: { keyword, limit, ...props },
          });
        },
      },
      t('Load more'),
    );
  };
  const getItems = () => {
    const items = [];
    if (!users.length && !departments.length) {
      return [
        {
          key: '0',
          label: React.createElement(Empty, { description: t('No results'), image: Empty.PRESENTED_IMAGE_SIMPLE }),
          disabled: true,
        },
      ];
    }
    if (users.length) {
      items.push({
        key: '0',
        type: 'group',
        label: t('Users'),
        children: users.map((user) => ({
          key: user.username,
          label: React.createElement(
            'div',
            { onClick: () => setUser(user) },
            React.createElement('div', null, user.nickname || user.username),
            React.createElement(
              'div',
              {
                style: {
                  fontSize: token.fontSizeSM,
                  color: token.colorTextDescription,
                },
              },
              `${user.username}${user.phone ? ' | ' + user.phone : ''}${user.email ? ' | ' + user.email : ''}`,
            ),
          ),
        })),
      });
      if (moreUsers) {
        items.push({
          type: 'group',
          key: '0-loadMore',
          label: React.createElement(LoadMore, { type: 'user', last: users[users.length - 1].id }),
        });
      }
    }
    if (departments.length) {
      items.push({
        key: '1',
        type: 'group',
        label: t('Departments'),
        children: departments.map((department) => ({
          key: department.id,
          label: React.createElement('div', { onClick: () => setDepartment(department) }, getTitle(department)),
        })),
      });
      if (moreDepartments) {
        items.push({
          type: 'group',
          key: '1-loadMore',
          label: React.createElement(LoadMore, { type: 'department', last: departments[departments.length - 1].id }),
        });
      }
    }
    return items;
  };
  return React.createElement(
    Dropdown,
    {
      menu: { items: getItems() },
      overlayClassName: styles.searchDropdown,
      trigger: ['click'],
      open: open,
      onOpenChange: (open) => setOpen(open),
    },
    React.createElement(Input.Search, {
      allowClear: true,
      onClick: () => {
        if (!keyword) {
          setOpen(false);
        }
      },
      onFocus: () => setDepartment(null),
      onSearch: handleSearch,
      onChange: handleChange,
      placeholder: t('Search for departments, users'),
      style: { marginBottom: '20px' },
    }),
  );
};
//# sourceMappingURL=AggregateSearch.js.map
