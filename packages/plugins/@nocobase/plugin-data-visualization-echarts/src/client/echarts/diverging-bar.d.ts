import { ChartType, RenderProps } from '@nocobase/plugin-data-visualization/client';
import { EChart } from './echart';
export declare class DivergingBar extends EChart {
  constructor();
  init: ChartType['init'];
  getProps({ data, general, advanced, fieldProps }: RenderProps): any;
}
