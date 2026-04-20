/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useCompile, useRequest } from '@nocobase/client';
import { Empty, Spin } from 'antd';
import JSON5 from 'json5';
import React, { useEffect, useState } from 'react';
import { ChartBlockEngineDesigner } from './ChartBlockEngineDesigner';
import chartRenderComponentsMap from './chartRenderComponents';
import { lang } from './locale';
import { templates } from './templates';
const ChartRenderComponent = ({ chartBlockEngineMetaData }) => {
  const compile = useCompile();
  const chartType = chartBlockEngineMetaData.chart.type;
  const renderComponent = templates.get(chartType)?.renderComponent;
  const RenderComponent = chartRenderComponentsMap.get(renderComponent); //G2Plot | Echarts | D3 |Table
  const chartConfig = chartBlockEngineMetaData.chart;
  const { loading, dataSet, error } = useGetDataSet(chartBlockEngineMetaData.query.id);
  const [currentConfig, setCurrentConfig] = useState({});
  useEffect(() => {
    setCurrentConfig(chartConfig);
  }, [JSON.stringify(chartConfig)]);
  if (error) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Empty, {
        description: React.createElement(
          'span',
          null,
          `May be this chart block's query data has been deleted,please check!`,
        ),
      }),
    );
  }
  if (currentConfig.type !== chartConfig.type) {
    return React.createElement(React.Fragment, null);
  }
  switch (renderComponent) {
    case 'G2Plot': {
      const finalChartOptions = templates.get(chartType)?.defaultChartOptions;
      let template;
      try {
        template = JSON5.parse(chartConfig?.template);
      } catch (e) {
        template = {};
      }
      const config = compile(
        {
          ...finalChartOptions,
          ...template,
          data: dataSet,
        },
        { ...chartConfig, category: chartConfig?.category ?? '' },
      );
      if (config && chartConfig) {
        const { dimension, metric, category } = chartConfig;
        if (!metric || !dimension) {
          return React.createElement(React.Fragment, null, lang('Please check the chart config'));
        }
      }
      return React.createElement(
        React.Fragment,
        null,
        loading
          ? React.createElement(Spin, null)
          : React.createElement(RenderComponent, { plot: chartConfig.type, config: config }),
      );
    }
  }
  return React.createElement(React.Fragment, null);
};
export const useGetDataSet = (chartQueryId) => {
  const { data, loading, error } = useRequest({
    url: `/chartsQueries:getData/${chartQueryId}`,
  });
  const dataSet = data?.data;
  return {
    loading,
    dataSet: dataSet,
    error,
  };
};
const ChartBlockEngine = ({ chartBlockEngineMetaData }) => {
  let renderComponent;
  const chartType = chartBlockEngineMetaData?.chart?.type;
  if (chartType) {
    renderComponent = templates.get(chartType)?.renderComponent;
  }
  if (!chartType || !renderComponent) {
    return React.createElement(React.Fragment, null, lang('Please check the chart config'));
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(ChartRenderComponent, { chartBlockEngineMetaData: chartBlockEngineMetaData }),
  );
};
ChartBlockEngine.Designer = ChartBlockEngineDesigner;
export { ChartBlockEngine };
//# sourceMappingURL=ChartBlockEngine.js.map
