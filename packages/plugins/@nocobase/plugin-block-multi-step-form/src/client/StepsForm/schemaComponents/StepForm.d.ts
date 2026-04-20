import { FormProps } from '@formily/antd-v5';
import React, { FC } from 'react';
export interface FormV3Props extends FormProps {
  uid: string;
  children?: React.ReactNode;
}
export declare const StepForm: FC<FormV3Props>;
