/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
export const useLoadMoreObserver = ({ loadMore }) => {
  const [lastItem, setLastItem] = useState(null);
  const observer = useRef(null);
  const observeExposure = useCallback(
    (lastItem) => {
      if (!lastItem) {
        return;
      }
      observer.current && observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target !== lastItem.current) {
            return;
          }
          if (entry.isIntersecting) {
            observer.current && observer.current.unobserve(lastItem.current);
            loadMore();
          }
        });
      });
      lastItem.current && observer.current && observer.current.observe(lastItem.current);
    },
    [loadMore],
  );
  useEffect(() => {
    observeExposure(lastItem);
    return () => {
      observer.current && observer.current.disconnect();
    };
  }, [lastItem, observeExposure]);
  return {
    lastItem,
    setLastItem,
  };
};
//# sourceMappingURL=load-more-observer.js.map
