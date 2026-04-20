declare const _default: {
  showLegend: {
    configType: string;
    name: string;
    title: string;
    defaultValue: boolean;
  };
  legendOrient: {
    configType: string;
    name: string;
    title: string;
    defaultValue: string;
    options: {
      label: string;
      value: string;
    }[];
  };
  legendPosition: {
    legendPosition: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      properties: {
        left: {
          'x-component': string;
          'x-component-props': {
            placeholder: string;
            allowClear: boolean;
          };
        };
        bottom: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
            placeholder: string;
          };
        };
        right: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
            placeholder: string;
          };
        };
        top: {
          'x-component': string;
          'x-component-props': {
            placeholder: string;
            allowClear: boolean;
          };
        };
      };
    };
  };
  showLabel: {
    configType: string;
    name: string;
    title: string;
    defaultValue: boolean;
  };
  labelType: (options?: { defaultValue: string }) => {
    labelType: {
      'x-decorator': string;
      'x-component': string;
      name: string;
      title: string;
      default: string | number;
      enum: {
        label: string;
        value: number;
      }[];
    };
  };
  splitLine: (options?: { defaultValue: string }) => {
    splitLine: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      properties: {
        type: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
          };
          default: string;
          enum: {
            label: string;
            value: string;
          }[];
        };
        style: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
          };
          default: string;
          enum: {
            label: string;
            value: string;
          }[];
        };
      };
    };
  };
  markLine: {
    markLine: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      items: {
        type: string;
        properties: {
          space: {
            type: string;
            'x-component': string;
            properties: {
              sort: {
                type: string;
                'x-decorator': string;
                'x-component': string;
              };
              name: {
                type: string;
                'x-decorator': string;
                'x-component': string;
                'x-component-props': {
                  placeholder: string;
                };
                required: boolean;
              };
              value: {
                type: string;
                'x-decorator': string;
                'x-component': string;
                'x-component-props': {
                  placeholder: string;
                };
                required: boolean;
              };
              color: {
                type: string;
                'x-decorator': string;
                'x-component': string;
              };
              remove: {
                type: string;
                'x-decorator': string;
                'x-component': string;
              };
            };
          };
        };
      };
      properties: {
        add: {
          type: string;
          title: string;
          'x-component': string;
        };
      };
    };
  };
  axisTitle: (options?: { name: string; title: string; defaultValue: string }) => {
    [x: string]: {
      'x-decorator': string;
      'x-component': string;
      name: string;
      title: string;
      default: string;
      enum: {
        label: string;
        value: string;
      }[];
    };
  };
  padding: {
    padding: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      properties: {
        left: {
          'x-component': string;
          'x-component-props': {
            placeholder: string;
            allowClear: boolean;
          };
        };
        bottom: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
            placeholder: string;
          };
        };
        right: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
            placeholder: string;
          };
        };
        top: {
          'x-component': string;
          'x-component-props': {
            placeholder: string;
            allowClear: boolean;
          };
        };
      };
    };
  };
  axisLabelRotate: (options?: { name: string; title: string; defaultValue: string }) => {
    [x: string]: {
      title: string;
      type: string;
      default: string | number;
      'x-decorator': string;
      'x-component': string;
      'x-component-props': {
        min: number;
        max: number;
      };
    };
  };
  barWidth: {
    barWidth: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      properties: {
        min: {
          'x-component': string;
          'x-component-props': {
            placeholder: string;
            allowClear: boolean;
          };
        };
        max: {
          'x-component': string;
          'x-component-props': {
            allowClear: boolean;
            placeholder: string;
          };
        };
      };
    };
  };
  barGap: {
    barGap: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      'x-component-props': {
        suffix: string;
      };
    };
  };
  colors: {
    colors: {
      title: string;
      type: string;
      'x-decorator': string;
      'x-component': string;
      items: {
        type: string;
        'x-component': string;
        properties: {
          sort: {
            type: string;
            'x-decorator': string;
            'x-component': string;
          };
          color: {
            type: string;
            'x-decorator': string;
            'x-component': string;
          };
          remove: {
            type: string;
            'x-decorator': string;
            'x-component': string;
          };
        };
      };
      properties: {
        add: {
          type: string;
          title: string;
          'x-component': string;
        };
      };
    };
  };
};
export default _default;
