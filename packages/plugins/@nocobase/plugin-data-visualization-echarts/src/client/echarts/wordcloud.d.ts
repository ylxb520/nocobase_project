import 'echarts-wordcloud';
import { EChart } from './echart';
import { ChartType, RenderProps } from '@nocobase/plugin-data-visualization/client';
export declare class WordCloud extends EChart {
  constructor();
  init: ChartType['init'];
  getProps({ data, general, advanced, fieldProps }: RenderProps): {
    grid: any;
    animation: boolean;
    size: any;
    lightTheme: any;
    darkTheme: any;
    tooltip: {};
    series: any;
  };
}
