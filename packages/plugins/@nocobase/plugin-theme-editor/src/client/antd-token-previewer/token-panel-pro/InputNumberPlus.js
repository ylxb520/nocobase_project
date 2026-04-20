/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { InputNumber, Slider } from 'antd';
import React from 'react';
const InputNumberPlus = ({ value, onChange, min, max }) => {
    return (React.createElement("div", { style: { display: 'flex', width: 200 } },
        React.createElement(Slider, { style: { flex: '0 0 120px', marginRight: 12 }, value: value, min: min, max: max, onChange: onChange }),
        React.createElement(InputNumber, { value: value, min: min, max: max, onChange: onChange, style: { flex: 1 } })));
};
export default InputNumberPlus;
//# sourceMappingURL=InputNumberPlus.js.map