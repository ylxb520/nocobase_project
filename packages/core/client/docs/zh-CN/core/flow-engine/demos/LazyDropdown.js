import { Dropdown, Menu, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
const LazyDropdown = ({ menu, ...props }) => {
  const [loadedChildren, setLoadedChildren] = useState({});
  const [loadingKeys, setLoadingKeys] = useState(new Set());
  const [menuVisible, setMenuVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState(new Set());
  const [rootItems, setRootItems] = useState([]);
  const [rootLoading, setRootLoading] = useState(false);
  const getKeyPath = (path, key) => [...path, key].join('/');
  // 通用的异步/同步 children 解析
  const resolveChildren = async (children) => {
    if (typeof children === 'function') {
      const res = children();
      return res instanceof Promise ? await res : res;
    }
    return children;
  };
  const handleLoadChildren = async (keyPath, loader) => {
    if (loadedChildren[keyPath] || loadingKeys.has(keyPath)) return;
    setLoadingKeys((prev) => new Set(prev).add(keyPath));
    try {
      const children = loader();
      const resolved = children instanceof Promise ? await children : children;
      setLoadedChildren((prev) => ({ ...prev, [keyPath]: resolved }));
    } catch (err) {
      console.error(`Failed to load children for ${keyPath}`, err);
    } finally {
      setLoadingKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyPath);
        return next;
      });
    }
  };
  // 收集所有异步 group
  const collectAsyncGroups = (items, path = []) => {
    const result = [];
    for (const item of items) {
      const keyPath = getKeyPath(path, item.key);
      if (item.type === 'group' && typeof item.children === 'function') {
        result.push([keyPath, item.children]);
      }
      if (Array.isArray(item.children)) {
        result.push(...collectAsyncGroups(item.children, [...path, item.key]));
      }
    }
    return result;
  };
  // 加载根 items，支持同步/异步函数
  useEffect(() => {
    const loadRootItems = async () => {
      let items;
      if (typeof menu.items === 'function') {
        setRootLoading(true);
        try {
          const res = menu.items();
          items = res instanceof Promise ? await res : res;
        } finally {
          setRootLoading(false);
        }
      } else {
        items = menu.items;
      }
      setRootItems(items);
    };
    if (menuVisible) {
      loadRootItems();
    }
  }, [menu.items, menuVisible]);
  // 自动加载所有 group 的异步 children
  useEffect(() => {
    if (!menuVisible || !rootItems.length) return;
    const asyncGroups = collectAsyncGroups(rootItems);
    for (const [keyPath, loader] of asyncGroups) {
      if (!loadedChildren[keyPath] && !loadingKeys.has(keyPath)) {
        handleLoadChildren(keyPath, loader);
      }
    }
  }, [menuVisible, rootItems]);
  // 递归解析 items，支持 children 为同步/异步函数
  const resolveItems = (items, path = []) => {
    return items.map((item) => {
      const keyPath = getKeyPath(path, item.key);
      const isGroup = item.type === 'group';
      const hasAsyncChildren = typeof item.children === 'function';
      const isLoading = loadingKeys.has(keyPath);
      const loaded = loadedChildren[keyPath];
      // 非 group 的异步 children，鼠标悬浮时加载
      const shouldLoadChildren =
        !isGroup && menuVisible && openKeys.has(keyPath) && hasAsyncChildren && !loaded && !isLoading;
      if (shouldLoadChildren) {
        handleLoadChildren(keyPath, item.children);
      }
      let children;
      if (hasAsyncChildren) {
        children = loaded ?? [];
      } else if (Array.isArray(item.children)) {
        children = item.children;
      }
      if (hasAsyncChildren && !loaded) {
        children = [
          {
            key: `${keyPath}-loading`,
            label: React.createElement(Spin, { size: 'small' }),
            disabled: true,
          },
        ];
      }
      if (isGroup) {
        return {
          type: 'group',
          key: item.key,
          label: item.label,
          children: children ? resolveItems(children, [...path, item.key]) : [],
        };
      }
      if (item.type === 'divider') {
        return { type: 'divider', key: item.key };
      }
      return {
        key: item.key,
        label: item.label,
        onClick: (info) => {
          if (children) {
            return;
          }
          menu.onClick?.({
            ...info,
            originalItem: item,
          }); // 👈 强制扩展类型
        },
        onMouseEnter: () => {
          setOpenKeys((prev) => {
            if (prev.has(keyPath)) return prev;
            const next = new Set(prev);
            next.add(keyPath);
            return next;
          });
        },
        children: children && children.length > 0 ? resolveItems(children, [...path, item.key]) : undefined,
      };
    });
  };
  return React.createElement(
    Dropdown,
    {
      ...props,
      dropdownRender: () =>
        rootLoading && rootItems.length === 0
          ? React.createElement(Menu, {
              items: [
                {
                  key: `root-loading`,
                  label: React.createElement(Spin, { size: 'small' }),
                  disabled: true,
                },
              ],
            })
          : React.createElement(Menu, { ...menu, onClick: () => {}, items: resolveItems(rootItems) }),
      onOpenChange: (visible) => setMenuVisible(visible),
    },
    props.children,
  );
};
export default LazyDropdown;
//# sourceMappingURL=LazyDropdown.js.map
