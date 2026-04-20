/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { memo } from 'react';
import { parseField } from '../utils';
import configs from './configs';
export class Chart {
  name;
  title;
  enableAdvancedConfig = false;
  Component;
  config;
  configTypes = new Map();
  constructor({ name, title, enableAdvancedConfig, Component, config }) {
    this.name = name;
    this.title = title;
    this.Component = memo(Component, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    this.config = config;
    this.enableAdvancedConfig = enableAdvancedConfig || false;
    this.addConfigTypes(configs);
  }
  /*
   * Generate config schema according to this.config
   * How to set up this.config:
   * 1. string - the config function name in config.ts
   * 2. object - { configType: string, ...props }
   *    - sttingType is the config function name in config.ts, and the other props are the arguments of the function
   * 3. object - use the object directly as the properties of the schema
   * 4. function - use the custom function to return the properties of the schema
   */
  get schema() {
    if (!this.config) {
      return {};
    }
    const properties = this.config.reduce((props, conf) => {
      let schema = {};
      if (typeof conf === 'string') {
        conf = this.configTypes.get(conf);
      }
      if (typeof conf === 'function') {
        schema = conf();
      } else {
        if (conf.configType) {
          const func = this.configTypes.get(conf.configType);
          schema = func?.(conf) || {};
        } else {
          schema = conf;
        }
      }
      return {
        ...props,
        ...schema,
      };
    }, {});
    return {
      type: 'object',
      properties,
    };
  }
  addConfigTypes(configs) {
    Object.entries(configs).forEach(([key, func]) => {
      this.configTypes.set(key, func);
    });
  }
  infer(fields, { measures, dimensions }) {
    let xField;
    let yField;
    let seriesField;
    let colorField;
    let yFields;
    const getField = (fields, selected) => {
      if (selected.alias) {
        return fields.find((f) => f.value === selected.alias);
      }
      const { alias } = parseField(selected.field);
      return fields.find((f) => f.value === alias);
    };
    if (measures?.length) {
      yField = getField(fields, measures[0]);
      yFields = measures.map((m) => getField(fields, m));
    }
    if (dimensions) {
      if (dimensions.length === 1) {
        xField = getField(fields, dimensions[0]);
      } else if (dimensions.length > 1) {
        // If there is a time field, it is used as the x-axis field by default.
        let xIndex;
        dimensions.forEach((d, i) => {
          const field = getField(fields, d);
          if (['date', 'time', 'datetime'].includes(field?.type)) {
            xField = field;
            xIndex = i;
          }
        });
        xIndex = xIndex || 0;
        xField = xField || getField(fields, dimensions[xIndex]);
        const restFields = dimensions.filter((_, i) => i !== xIndex).map((i) => getField(fields, i));
        if (restFields.length === 1) {
          seriesField = restFields[0];
          colorField = restFields[0];
        } else if (restFields.length > 1) {
          colorField = restFields[0];
          seriesField = restFields[1];
        }
      }
    }
    return { xField, yField, seriesField, colorField, yFields };
  }
  /**
   * getProps
   * Accept the information that the chart component needs to render,
   * process it and return the props of the chart component.
   */
  getProps(props) {
    return props;
  }
}
//# sourceMappingURL=chart.js.map
