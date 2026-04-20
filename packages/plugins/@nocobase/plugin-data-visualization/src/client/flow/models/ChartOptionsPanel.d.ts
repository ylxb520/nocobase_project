/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export declare const chartOptionDefaultValue =
  "return {\n  dataset: { source: ctx.data.objects || [] },\n  xAxis: { type: 'category' },\n  yAxis: {},\n  series: [\n    {\n      type: 'line',\n      smooth: true,\n      showSymbol: false,\n    },\n  ],\n}\n";
export declare const ChartOptionsPanel: React.FC;
