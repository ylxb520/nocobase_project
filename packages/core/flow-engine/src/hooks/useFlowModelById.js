/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useMemo } from 'react';
import { useFlowEngine } from '../provider';
export function useFlowModelById(uid, modelClassName, stepParams) {
  const engine = useFlowEngine();
  // const app = useApp(); // 移除 app
  const model = useMemo(() => {
    let instance = engine.getModel(uid);
    if (!instance && modelClassName) {
      instance = engine.createModel({
        uid,
        use: modelClassName,
        stepParams,
        // app: app, // createModel 的 app 参数已被移除
      });
    }
    return instance;
  }, [engine, /* app, */ modelClassName, uid, stepParams]); // 移除 app 从依赖数组
  return model;
}
//# sourceMappingURL=useFlowModelById.js.map
