/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import * as echarts from 'echarts';
import type { EChartsType, EChartsOption } from 'echarts';
interface Props {
    option: EChartsOption;
    style?: React.CSSProperties;
    className?: string;
    theme?: string;
    onRefReady?: (chart: EChartsType) => void;
}
declare const ECharts: React.ForwardRefExoticComponent<Props & React.RefAttributes<echarts.ECharts>>;
export default ECharts;
