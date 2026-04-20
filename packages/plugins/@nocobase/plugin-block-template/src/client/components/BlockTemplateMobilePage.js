/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect } from 'react';
import { MobilePage } from '@nocobase/plugin-mobile/client';
import { useParams } from 'react-router-dom';
import { useRequest } from '@nocobase/client';
import { Spin } from 'antd';
import { BlockTemplateInfoContext } from './BlockTemplateInfoContext';
export const BlockTemplateMobilePage = () => {
  const { key } = useParams();
  const { data, loading } = useRequest({
    url: `blockTemplates:get/${key}`,
  });
  useEffect(() => {
    // hide tab bar
    const tabBar = document.querySelector('.ant-nb-mobile-tab-bar');
    const tabBarDisplay = tabBar?.style?.display;
    if (tabBar) {
      tabBar.style.display = 'none';
    }
    // show tab bar
    return () => {
      const tabBar = document.querySelector('.ant-nb-mobile-tab-bar');
      if (tabBar) {
        tabBar.style.display = tabBarDisplay;
      }
    };
  }, []);
  if (loading) {
    return React.createElement(Spin, null);
  }
  return React.createElement(
    BlockTemplateInfoContext.Provider,
    { value: data?.data },
    React.createElement(MobilePage, null),
  );
};
//# sourceMappingURL=BlockTemplateMobilePage.js.map
