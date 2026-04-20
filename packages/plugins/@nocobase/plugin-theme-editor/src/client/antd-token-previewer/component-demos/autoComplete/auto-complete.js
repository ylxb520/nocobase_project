/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AutoComplete } from 'antd';
import React, { useState } from 'react';
const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
});
const Complete = () => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);
    const onSearch = (searchText) => {
        setOptions(!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);
    };
    const onSelect = (data) => {
        // eslint-disable-next-line no-console
        console.log('onSelect', data);
    };
    const onChange = (data) => {
        setValue(data);
    };
    return (React.createElement(React.Fragment, null,
        ' ',
        React.createElement(AutoComplete, { options: options, style: { width: 200 }, onSelect: onSelect, onSearch: onSearch, placeholder: "input here" }),
        ' ',
        React.createElement("br", null),
        " ",
        React.createElement("br", null),
        ' ',
        React.createElement(AutoComplete, { value: value, options: options, style: { width: 200 }, onSelect: onSelect, onSearch: onSearch, onChange: onChange, placeholder: "control mode" }),
        ' '));
};
const Demo = () => React.createElement(Complete, null);
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: [],
    key: 'autoComplete',
};
export default componentDemo;
//# sourceMappingURL=auto-complete.js.map