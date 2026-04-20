import { StepsProps as AntdStepProps } from 'antd';
import React from 'react';
export interface StepProps extends AntdStepProps {
  items: any;
}
export declare function Steps(props: StepProps): React.JSX.Element;
