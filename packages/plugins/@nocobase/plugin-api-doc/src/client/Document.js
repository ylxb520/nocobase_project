/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css, useAPIClient, useCurrentAppInfo, useRequest } from '@nocobase/client';
import { Select, Space, Spin, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import 'swagger-ui-dist/swagger-ui.css';
import { useTranslation } from '../locale';
const DESTINATION_URL_KEY = 'API_DOC:DESTINATION_URL_KEY';
const getUrl = () => localStorage.getItem(DESTINATION_URL_KEY);
const Documentation = () => {
  const apiClient = useAPIClient();
  const appInfo = useCurrentAppInfo();
  console.log('appInfo', appInfo);
  const { t } = useTranslation();
  const swaggerUIRef = useRef();
  const { data: urls } = useRequest({ url: 'swagger:getUrls' });
  const requestInterceptor = (req) => {
    if (!req.headers['Authorization']) {
      Object.assign(req.headers, apiClient.getHeaders());
      if (appInfo?.data?.name) {
        req.headers['X-App'] = appInfo.data.name;
      }
      req.headers['Authorization'] = `Bearer ${apiClient.auth.getToken()}`;
    }
    return req;
  };
  const [destination, onDestinationChange] = useState(getUrl());
  useEffect(() => {
    if (destination) {
      localStorage.setItem(DESTINATION_URL_KEY, destination);
    }
  }, [destination]);
  useEffect(() => {
    if (!urls?.data?.length) return;
    if (!destination || !urls.data.find((item) => item.url === getUrl())) {
      onDestinationChange(urls.data[0].url);
    }
  }, [destination, urls]);
  useEffect(() => {
    SwaggerUIBundle({
      requestInterceptor,
      url: destination,
      domNode: swaggerUIRef.current,
    });
  }, [destination]);
  if (!destination) {
    return React.createElement(Spin, null);
  }
  return React.createElement(
    Space,
    {
      direction: 'vertical',
      style: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        },
      },
      React.createElement(
        'div',
        {
          className: css`
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 1460px;
            width: 100%;
            padding: 16px 20px;
          `,
        },
        React.createElement(
          Typography.Text,
          {
            style: {
              whiteSpace: 'nowrap',
            },
            strong: true,
          },
          t('Select a definition'),
        ),
        React.createElement(Select, {
          showSearch: true,
          value: destination,
          options: urls?.data,
          style: {
            width: '100%',
          },
          fieldNames: {
            label: 'name',
            value: 'url',
          },
          onChange: onDestinationChange,
        }),
      ),
    ),
    React.createElement('div', { ref: swaggerUIRef }),
  );
};
export default Documentation;
//# sourceMappingURL=Document.js.map
