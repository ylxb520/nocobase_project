/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState } from 'react';
import { useAPIClient, useActionContext, useRequest } from '@nocobase/client';
import { useField } from '@formily/react';
import { AutoComplete, Spin } from 'antd';
export const ModelSelect = () => {
  const field = useField();
  const serviceField = field.query('.llmService').take();
  const api = useAPIClient();
  const ctx = useActionContext();
  const [options, setOptions] = useState([]);
  const { data: models, loading } = useRequest(
    () =>
      api
        .resource('ai')
        .listModels({
          llmService: serviceField?.value,
        })
        .then((res) =>
          res?.data?.data?.map(({ id }) => ({
            label: id,
            value: id,
          })),
        ),
    {
      ready: !!serviceField?.value && ctx.visible,
      refreshDeps: [serviceField?.value],
      onSuccess: (data) => setOptions(data),
    },
  );
  const handleSearch = (value) => {
    if (!models) {
      setOptions([]);
      return;
    }
    if (!value) {
      setOptions(models);
      return;
    }
    const searchOptions = models.filter((option) => {
      return option.label.toLowerCase().includes(value.toLowerCase());
    });
    setOptions(searchOptions);
  };
  return React.createElement(AutoComplete, {
    onSearch: handleSearch,
    options: options,
    notFoundContent: loading ? React.createElement(Spin, { size: 'small' }) : null,
    value: field.value,
    onChange: (val) => (field.value = val),
  });
};
//# sourceMappingURL=ModelSelect.js.map
