/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useCallback, useMemo } from 'react';
import { createEditor, Editor, Transforms, Range, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { InlineVariableTag } from './InlineVariableTag';
import { VariableTrigger } from './VariableTrigger';
import { parseValueToPath } from './utils';
import { uid } from '@formily/shared';
/**
 * 基于 Slate.js 的智能变量编辑器
 *
 * 完美集成 Popover + FlowContextSelector 和 InlineVariableTag，
 * 提供专业的富文本编辑体验和精确的光标控制。
 */
export const SlateVariableEditor = ({
  value = '',
  onChange,
  metaTree,
  multiline = false,
  placeholder = '输入文本，使用 {{ 插入变量',
  style = {},
  ...restProps
}) => {
  // 创建编辑器实例
  const editor = useMemo(() => {
    const e = withReact(withHistory(createEditor()));
    // 定义变量元素为 inline void 元素
    const { isInline, isVoid } = e;
    e.isInline = (element) => {
      return element.type === 'variable' || element.type === 'variable-trigger' ? true : isInline(element);
    };
    e.isVoid = (element) => {
      return element.type === 'variable' || element.type === 'variable-trigger' ? true : isVoid(element);
    };
    return e;
  }, []);
  // 获取实际的 metaTree 数据
  const [resolvedMetaTree, setResolvedMetaTree] = React.useState(null);
  React.useEffect(() => {
    const resolveMetaTree = async () => {
      if (!metaTree) {
        setResolvedMetaTree(null);
        return;
      }
      try {
        if (typeof metaTree === 'function') {
          const resolved = await metaTree();
          setResolvedMetaTree(resolved);
        } else {
          setResolvedMetaTree(metaTree);
        }
      } catch (error) {
        console.warn('Failed to resolve metaTree:', error);
        setResolvedMetaTree(null);
      }
    };
    resolveMetaTree();
  }, [metaTree]);
  // 解析外部 value 为 Slate 文档结构
  const parseValueToSlate = useCallback(
    (text = '') => {
      if (!text) {
        return [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ];
      }
      const variableRegex = /\{\{[^}]+\}\}/g;
      let lastIndex = 0;
      let match;
      const children = [];
      while ((match = variableRegex.exec(text)) !== null) {
        // 添加前面的文本
        if (match.index > lastIndex) {
          children.push({ text: text.slice(lastIndex, match.index) });
        }
        // 添加变量元素
        const variableValue = match[0];
        const path = parseValueToPath(variableValue);
        // 尝试构建元数据信息
        const contextSelectorItem = undefined;
        if (path && resolvedMetaTree) {
          //TODO: get current selectorItem
        }
        children.push({
          type: 'variable',
          value: variableValue,
          meta: contextSelectorItem,
          children: [{ text: '' }], // Slate 要求 void 元素有空文本子节点
        });
        lastIndex = match.index + match[0].length;
      }
      // 添加剩余文本
      if (lastIndex < text.length) {
        children.push({ text: text.slice(lastIndex) });
      }
      // 如果没有内容，添加空文本
      if (children.length === 0) {
        children.push({ text: '' });
      }
      return [
        {
          type: 'paragraph',
          children,
        },
      ];
    },
    [resolvedMetaTree],
  );
  const initialValue = useMemo(() => parseValueToSlate(value || ''), [value, parseValueToSlate]);
  // 将 Slate 文档转换为纯文本
  const slateToText = useCallback((nodes) => {
    return nodes
      .map((n) => {
        if (SlateElement.isElement(n)) {
          if (n.type === 'variable') {
            return n.value;
          }
          return slateToText(n.children);
        }
        return n.text;
      })
      .join('');
  }, []);
  const handleChange = useCallback(
    (newValue) => {
      const text = slateToText(newValue);
      onChange?.(text);
    },
    [onChange, slateToText],
  );
  const handleVariableSelectFromTrigger = useCallback(
    (triggerId, value, item) => {
      const [triggerMatch] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === 'variable-trigger' && n.triggerId === triggerId,
      });
      if (triggerMatch) {
        const [, triggerPath] = triggerMatch;
        const variableElement = {
          type: 'variable',
          value: value,
          meta: item,
          children: [{ text: '' }],
        };
        Transforms.setNodes(editor, variableElement, { at: triggerPath });
        const nextPoint = Editor.after(editor, triggerPath);
        if (nextPoint) {
          Transforms.select(editor, nextPoint);
        }
        ReactEditor.focus(editor);
      }
    },
    [editor],
  );
  const handleTriggerClose = useCallback(
    (triggerId) => {
      const [triggerMatch] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === 'variable-trigger' && n.triggerId === triggerId,
      });
      if (triggerMatch) {
        const [, triggerPath] = triggerMatch;
        // 先选择触发器位置
        Transforms.select(editor, triggerPath);
        // 移除节点
        Transforms.removeNodes(editor, { at: triggerPath });
        // 在当前选择位置插入文本
        Transforms.insertText(editor, '{{');
        ReactEditor.focus(editor);
      }
    },
    [editor],
  );
  const renderElement = useCallback(
    (props) => {
      switch (props.element.type) {
        case 'variable':
          return React.createElement(VariableElementComponent, { ...props, metaTree: resolvedMetaTree });
        case 'variable-trigger':
          return React.createElement(VariableTrigger, {
            ...props,
            element: props.element,
            metaTree: metaTree,
            onVariableSelect: handleVariableSelectFromTrigger,
            onTriggerClose: handleTriggerClose,
          });
        default:
          return React.createElement('p', { ...props.attributes }, props.children);
      }
    },
    [metaTree, resolvedMetaTree, handleVariableSelectFromTrigger, handleTriggerClose],
  );
  // 渲染叶子节点
  const renderLeaf = useCallback((props) => {
    return React.createElement(
      'span',
      { ...props.attributes, style: { fontWeight: props.leaf.bold ? 'bold' : 'normal' } },
      props.children,
    );
  }, []);
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === '{') {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const beforePoint = Editor.before(editor, start);
          if (beforePoint) {
            const beforeRange = Editor.range(editor, beforePoint, start);
            const beforeText = Editor.string(editor, beforeRange);
            if (beforeText === '{') {
              event.preventDefault();
              Transforms.delete(editor, { at: beforeRange });
              const triggerId = uid();
              const triggerElement = {
                type: 'variable-trigger',
                triggerId,
                children: [{ text: '' }],
              };
              Transforms.insertNodes(editor, triggerElement);
            }
          }
        }
      }
    },
    [editor],
  );
  return React.createElement(
    Slate,
    { editor: editor, initialValue: initialValue, onChange: handleChange },
    React.createElement(Editable, {
      renderElement: renderElement,
      renderLeaf: renderLeaf,
      placeholder: placeholder,
      onKeyDown: handleKeyDown,
      style: {
        minHeight: multiline ? 100 : 32,
        padding: '4px 11px',
        border: '1px solid #d9d9d9',
        borderRadius: 6,
        fontSize: 14,
        lineHeight: 1.5714285714285714,
        ...style,
      },
      ...restProps,
    }),
  );
};
// 变量元素组件
const VariableElementComponent = ({ attributes, children, element, metaTree }) => {
  const variableElement = element;
  const contextSelectorItem = React.useMemo(() => {
    if (variableElement.meta) {
      return variableElement.meta;
    }
    // 如果没有存储的 meta，尝试从 metaTree 动态构建
    if (metaTree && variableElement.value) {
      const path = parseValueToPath(variableElement.value);
      // TODO: build current selected
    }
    return null;
  }, [variableElement.meta, variableElement.value, metaTree]);
  return React.createElement(
    'span',
    { ...attributes, contentEditable: false },
    React.createElement(InlineVariableTag, {
      value: variableElement.value,
      metaTreeNode: contextSelectorItem,
      metaTree: metaTree,
      style: {
        marginLeft: 2,
        marginRight: 2,
        verticalAlign: 'baseline',
        display: 'inline-block',
      },
    }),
    children,
  );
};
//# sourceMappingURL=SlateVariableEditor.js.map
