import { SchemaInitializer } from '@nocobase/client';
import React, { FC } from 'react';
export declare const variableInitializer: SchemaInitializer<import('antd').ButtonProps, {}>;
export declare const VariableEditor: FC<{
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues: any;
}>;
