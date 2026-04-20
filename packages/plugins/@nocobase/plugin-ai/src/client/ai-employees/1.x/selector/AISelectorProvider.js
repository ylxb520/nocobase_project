/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useFlowEngine } from '@nocobase/flow-engine';
export const AISelectionContext = createContext({
  selectable: false,
});
export const useAISelectionContext = () => {
  return useContext(AISelectionContext);
};
export const AISelectionProvider = (props) => {
  const [selectable, setSelectable] = useState('');
  const [selector, setSelector] = useState(null);
  const flowEngine = useFlowEngine();
  const [ctx, setCtx] = useState({
    flowEngine: flowEngine,
  });
  const startSelect = (selectType, selector) => {
    if (selector) {
      setSelector(selector);
    }
    setSelectable(selectType);
  };
  const stopSelect = () => {
    setSelectable('');
    setSelector(null);
  };
  const collect = useCallback(
    (uid, key, value) => {
      setCtx((prev) => ({
        ...prev,
        [uid]: {
          ...prev[uid],
          [key]: value,
        },
      }));
    },
    [setCtx],
  );
  return React.createElement(
    AISelectionContext.Provider,
    { value: { selectable, selector, startSelect, stopSelect, collect, ctx } },
    props.children,
  );
};
//# sourceMappingURL=AISelectorProvider.js.map
