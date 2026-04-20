/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { usePlugin } from '@nocobase/client';
import DataVisualizationPlugin from '..';
import { lang } from '../locale';
export class ChartGroup {
  /**
   * @internal
   */
  charts = new Map();
  addGroup(name, group) {
    if (this.charts.has(name)) {
      throw new Error(`[data-visualization] Chart group "${name}" already exists`);
    }
    this.charts.set(name, group);
  }
  add(name, charts) {
    if (!this.charts.has(name)) {
      return;
    }
    if (!Array.isArray(charts)) {
      charts = [charts];
    }
    const group = this.charts.get(name);
    this.charts.set(name, {
      ...group,
      charts: [...group.charts, ...charts],
    });
  }
  /**
   * @internal
   */
  getChartTypes() {
    const result = [];
    Array.from(this.charts.entries())
      .sort(([, a], [, b]) => a.sort || 0 - b.sort || 0)
      .forEach(([group, { title, charts }]) => {
        const children = charts.map((chart) => ({
          key: `${group}.${chart.name}`,
          label: lang(chart.title),
          value: `${group}.${chart.name}`,
        }));
        result.push({
          label: lang(title),
          children,
        });
      });
    return result;
  }
  /**
   * @internal
   */
  getCharts() {
    const result = {};
    this.charts.forEach(({ charts }, group) => {
      charts.forEach((chart) => {
        result[`${group}.${chart.name}`] = chart;
      });
    });
    return result;
  }
  /**
   * @internal
   */
  getChart(type) {
    const charts = this.getCharts();
    return charts[type];
  }
}
/**
 * @internal
 */
export const useChartTypes = () => {
  const plugin = usePlugin(DataVisualizationPlugin);
  return plugin.charts.getChartTypes();
};
/**
 * @internal
 */
export const useDefaultChartType = () => {
  const chartTypes = useChartTypes();
  return chartTypes[0]?.children?.[0]?.value;
};
/**
 * @internal
 */
export const useCharts = () => {
  const plugin = usePlugin(DataVisualizationPlugin);
  return plugin.charts.getCharts();
};
/**
 * @internal
 */
export const useChart = (type) => {
  const plugin = usePlugin(DataVisualizationPlugin);
  return plugin.charts.getChart(type);
};
//# sourceMappingURL=group.js.map
