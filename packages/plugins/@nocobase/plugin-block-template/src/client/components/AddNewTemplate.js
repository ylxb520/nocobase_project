import { ActionContextProvider, SchemaComponent } from '@nocobase/client';
import React, { createContext, useState } from 'react';
import { useT } from '../locale';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createActionSchema } from '../schemas/createActionSchema';
import { createForm } from '@formily/core';
import { uid } from '@nocobase/utils/client';
export const NewTemplateFormContext = createContext(null);
export const AddNewTemplate = () => {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(null);
  const t = useT();
  const handleClick = () => {
    setForm(
      createForm({
        initialValues: {
          key: `t_${uid()}`,
          type: 'Desktop',
        },
      }),
    );
    setVisible(true);
  };
  return React.createElement(
    ActionContextProvider,
    { value: { visible, setVisible } },
    React.createElement(
      Button,
      { icon: React.createElement(PlusOutlined, null), type: 'primary', onClick: handleClick },
      t('Add new'),
    ),
    React.createElement(
      NewTemplateFormContext.Provider,
      { value: form },
      React.createElement(SchemaComponent, { schema: createActionSchema }),
    ),
  );
};
//# sourceMappingURL=AddNewTemplate.js.map
