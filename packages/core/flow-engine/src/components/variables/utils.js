/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { isVariableExpression } from '../../utils';
const getContextSelectorLabelText = (node) => {
  if (typeof node.label === 'string') {
    return node.label;
  }
  if (typeof node.meta?.title === 'string') {
    return node.meta.title;
  }
  return node.value;
};
export const parseValueToPath = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  const variableRegex = /^\{\{\s*ctx(?:\.(.+?))?\s*\}\}$/;
  const match = trimmed.match(variableRegex);
  if (!match) return undefined;
  const pathString = match[1];
  if (!pathString) return [];
  return pathString.split('.');
};
export const formatPathToValue = (item) => {
  const path = item?.paths || [];
  if (path.length === 0) return '{{ ctx }}';
  return `{{ ctx.${path.join('.')} }}`;
};
export const loadMetaTreeChildren = async (metaNode) => {
  if (!metaNode?.children) return [];
  if (typeof metaNode.children === 'function') {
    try {
      return await metaNode.children();
    } catch (error) {
      console.warn(`Failed to load children for ${metaNode.name}:`, error);
      return [];
    }
  }
  return metaNode.children;
};
// 在已加载的级联选项中搜索，支持模糊匹配
export const searchInLoadedNodes = (options, searchText, parentPaths = []) => {
  if (!searchText || !searchText.trim()) return [];
  const lowerSearchText = searchText.toLowerCase().trim();
  const results = [];
  // 递归搜索已加载的节点
  const searchRecursive = (nodes, currentPath = []) => {
    for (const node of nodes) {
      const nodePath = [...currentPath, node.value];
      // 计算可搜索的纯文本标签
      const labelText = getContextSelectorLabelText(node);
      // 检查节点标签是否匹配搜索文本
      if (labelText.toLowerCase().includes(lowerSearchText)) {
        results.push(node);
      }
      // 只搜索已加载的子节点（存在children属性表示已加载）
      if (node.children && Array.isArray(node.children)) {
        searchRecursive(node.children, nodePath);
      }
    }
  };
  searchRecursive(options, []);
  return results;
};
/**
 * 仅在“已加载节点”范围内按关键字过滤 options（保留树结构）。
 * - 匹配父节点：保留原节点引用（含原 children），避免不必要的实体重建。
 * - 匹配子节点：返回裁剪后的父节点副本，children 仅包含命中分支。
 * - 未加载 children（即 children 不为数组）不会递归搜索。
 */
export const filterLoadedContextSelectorItems = (options, keyword) => {
  if (!Array.isArray(options) || options.length === 0) return [];
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return options;
  }
  const filterNode = (node) => {
    const labelText = getContextSelectorLabelText(node).toLowerCase();
    const selfMatched = labelText.includes(normalizedKeyword);
    if (selfMatched) {
      return node;
    }
    if (!Array.isArray(node.children) || node.children.length === 0) {
      return null;
    }
    const filteredChildren = node.children.map((child) => filterNode(child)).filter((item) => item !== null);
    if (filteredChildren.length === 0) {
      return null;
    }
    // 所有子节点都保留原引用时，直接复用父节点对象。
    if (
      filteredChildren.length === node.children.length &&
      filteredChildren.every((child, idx) => child === node.children[idx])
    ) {
      return node;
    }
    return {
      ...node,
      children: filteredChildren,
    };
  };
  return options.map((node) => filterNode(node)).filter((item) => item !== null);
};
export const buildContextSelectorItems = (metaTree) => {
  if (!metaTree || !Array.isArray(metaTree)) {
    console.warn('buildContextSelectorItems received invalid metaTree:', metaTree);
    return [];
  }
  const convertNode = (node) => {
    const hidden = !!(typeof node.hidden === 'function' ? node.hidden() : node.hidden);
    if (hidden) return null;
    const hasChildren = !!(
      node.children &&
      (typeof node.children === 'function' || (Array.isArray(node.children) && node.children.length > 0))
    );
    // 计算禁用状态：支持 boolean 或函数
    const disabled = !!(typeof node.disabled === 'function' ? node.disabled() : node.disabled);
    const option = {
      label: node.title || node.name,
      value: node.name,
      isLeaf: !hasChildren,
      meta: node,
      paths: node.paths,
      disabled,
    };
    if (Array.isArray(node.children) && node.children.length > 0) {
      option.children = node.children.map((child) => convertNode(child)).filter((item) => item !== null);
    }
    return option;
  };
  return metaTree.map((node) => convertNode(node)).filter((item) => item !== null);
};
/**
 * 预加载：根据路径逐级加载 ContextSelectorItem 的 children，保证打开时已展开对应层级。
 */
export const preloadContextSelectorPath = async (options, pathSegments, triggerUpdate) => {
  if (!options || !Array.isArray(options) || !pathSegments || pathSegments.length === 0) return;
  let list = options;
  for (let i = 0; i < pathSegments.length && list; i++) {
    const seg = String(pathSegments[i]);
    const opt = list.find((o) => String(o.value) === seg);
    if (!opt) break;
    const meta = opt.meta;
    const hasLoaded = !!opt.children && Array.isArray(opt.children);
    if (i < pathSegments.length - 1 && !hasLoaded && meta && typeof meta.children === 'function') {
      opt.loading = true;
      try {
        const childNodes = await loadMetaTreeChildren(meta);
        meta.children = childNodes;
        const childOptions = buildContextSelectorItems(childNodes);
        opt.children = childOptions;
        opt.isLeaf = !childOptions || childOptions.length === 0;
        Promise.resolve()
          .then(() => triggerUpdate?.())
          .catch(() => {});
      } finally {
        opt.loading = false;
      }
    }
    list = Array.isArray(opt.children) ? opt.children : undefined;
  }
};
export const isVariableValue = (value) => {
  return isVariableExpression(value);
};
export const createDefaultConverters = () => {
  return {
    resolvePathFromValue: (value) => {
      return parseValueToPath(value);
    },
    resolveValueFromPath: (item) => {
      return formatPathToValue(item);
    },
  };
};
export const createFinalConverters = (propConverters) => {
  const defaultConverters = createDefaultConverters();
  const mergedConverters = propConverters ? { ...defaultConverters, ...propConverters } : defaultConverters;
  // 如果用户自定义了 resolveValueFromPath，需要包装一下以保持后备逻辑
  if (propConverters?.resolveValueFromPath) {
    const customResolveValueFromPath = propConverters.resolveValueFromPath;
    return {
      ...mergedConverters,
      resolveValueFromPath: (item) => {
        const ret = customResolveValueFromPath(item);
        return ret === undefined ? formatPathToValue(item) : ret;
      },
    };
  }
  return mergedConverters;
};
//# sourceMappingURL=utils.js.map
