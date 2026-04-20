/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ConfigProvider, Input, InputNumber, Select, theme } from 'antd';
import classNames from 'classnames';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HexColorPicker, RgbaColorPicker } from 'react-colorful';
import tinycolor from 'tinycolor2';
import makeStyle from './utils/makeStyle';
const { useToken } = theme;
const useStyle = makeStyle('ColorPanel', (token) => ({
    '.color-panel': {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: token.boxShadow,
        width: 224,
        boxSizing: 'border-box',
        '.color-panel-mode': {
            display: 'flex',
            alignItems: 'center',
            marginBottom: 6,
        },
        '.color-panel-preview': {
            width: 24,
            height: 24,
            borderRadius: 4,
            boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
            flex: 'none',
            overflow: 'hidden',
            background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAFpJREFUWAntljEKADAIA23p6v//qQ+wfUEcCu1yriEgp0FHRJSJcnehmmWm1Dv/lO4HIg1AAAKjTqm03ea88zMCCEDgO4HV5bS757f+7wRoAAIQ4B9gByAAgQ3pfiDmXmAeEwAAAABJRU5ErkJggg==) 0% 0% / 32px',
        },
        '.color-panel-preset-colors': {
            paddingTop: 12,
            display: 'flex',
            flexWrap: 'wrap',
            width: 200,
        },
        '.color-panel-preset-color-btn': {
            borderRadius: 4,
            width: 20,
            height: 20,
            border: 'none',
            outline: 'none',
            margin: 4,
            cursor: 'pointer',
            boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
        },
        '.color-panel-mode-title': {
            color: token.colorTextPlaceholder,
            marginTop: 2,
            fontSize: 12,
            textAlign: 'center',
        },
        '.color-panel-rgba-input': {
            display: 'flex',
            alignItems: 'center',
            '&-part': {
                flex: 1,
                width: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&-title': {
                    color: token.colorTextPlaceholder,
                    marginTop: 2,
                    fontSize: 12,
                },
                '&:not(:last-child)': {
                    marginRight: 4,
                },
                [`${token.rootCls}-input-number`]: {
                    width: '100%',
                    input: {
                        fontSize: 12,
                        padding: '0 4px',
                    },
                },
            },
        },
    },
}));
const getHexValue = (value, alpha = false) => {
    return alpha ? tinycolor(value).toHex8() : tinycolor(value).toHex();
};
const HexColorInput = ({ value, onChange, alpha }) => {
    const [hexValue, setHexValue] = useState(value);
    const focusRef = useRef(false);
    const handleChange = (e) => {
        setHexValue(e.target.value);
        onChange?.(getHexValue(e.target.value, alpha));
    };
    const handleBlur = (e) => {
        focusRef.current = false;
        setHexValue(getHexValue(e.target.value, alpha));
    };
    const handleFocus = () => {
        focusRef.current = true;
    };
    useEffect(() => {
        if (!focusRef.current) {
            setHexValue(getHexValue(value, alpha));
        }
    }, [value, alpha]);
    return (React.createElement("div", null,
        React.createElement(Input, { prefix: "#", size: "small", value: hexValue, onFocus: handleFocus, onChange: handleChange, onBlur: handleBlur }),
        React.createElement("div", { className: "color-panel-mode-title" },
            "HEX",
            alpha ? '8' : '')));
};
const RgbColorInput = ({ value: customValue, onChange, alpha }) => {
    const [value, setValue] = useMergedState(customValue ?? { r: 0, g: 0, b: 0, a: 1 }, {
        value: customValue,
        onChange,
    });
    return (React.createElement("div", { className: "color-panel-rgba-input" },
        React.createElement(ConfigProvider, { theme: { components: { InputNumber: { handleWidth: 12 } } } },
            React.createElement("div", { className: "color-panel-rgba-input-part" },
                React.createElement(InputNumber, { min: 0, max: 255, size: "small", value: value.r, onChange: (v) => setValue({ ...value, r: v ?? 0 }) }),
                React.createElement("div", { className: "color-panel-mode-title" }, "R")),
            React.createElement("div", { className: "color-panel-rgba-input-part" },
                React.createElement(InputNumber, { min: 0, max: 255, size: "small", value: value.g, onChange: (v) => setValue({ ...value, g: v ?? 0 }) }),
                React.createElement("div", { className: "color-panel-mode-title" }, "G")),
            React.createElement("div", { className: "color-panel-rgba-input-part" },
                React.createElement(InputNumber, { min: 0, max: 255, size: "small", value: value.b, onChange: (v) => setValue({ ...value, b: v ?? 0 }) }),
                React.createElement("div", { className: "color-panel-mode-title" }, "B")),
            alpha && (React.createElement("div", { className: "color-panel-rgba-input-part" },
                React.createElement(InputNumber, { min: 0, max: 1, step: 0.01, size: "small", value: value.a, onChange: (v) => setValue({ ...value, a: v ?? 0 }) }),
                React.createElement("div", { className: "color-panel-mode-title" }, "A"))))));
};
const colorModes = ['HEX', 'HEX8', 'RGB', 'RGBA'];
const getColorStr = (color, mode) => {
    switch (mode) {
        case 'HEX':
            return tinycolor(color).toHexString();
        case 'HEX8':
            return tinycolor(color).toHex8String();
        case 'RGBA':
        case 'RGB':
        default:
            return tinycolor(color).toRgbString();
    }
};
const ColorPanel = ({ color, onChange, alpha, style }) => {
    const { token } = useToken();
    const [wrapSSR, hashId] = useStyle();
    const [colorMode, setColorMode] = React.useState('HEX');
    const presetColors = useMemo(() => {
        return [
            token.blue,
            token.purple,
            token.cyan,
            token.green,
            token.magenta,
            token.pink,
            token.red,
            token.orange,
            token.yellow,
            token.volcano,
            token.geekblue,
            token.gold,
            token.lime,
            '#000',
        ];
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);
    const handleColorModeChange = (value) => {
        setColorMode(value);
        onChange(getColorStr(color, value));
    };
    return wrapSSR(React.createElement("div", { className: classNames(hashId, 'color-panel'), style: style },
        (colorMode === 'HEX' || colorMode === 'RGB') && (React.createElement(HexColorPicker, { style: { height: 160 }, color: tinycolor(color).toHex(), onChange: (value) => {
                onChange(getColorStr(value, colorMode));
            } })),
        (colorMode === 'RGBA' || colorMode === 'HEX8') && (React.createElement(RgbaColorPicker, { style: { height: 160 }, color: tinycolor(color).toRgb(), onChange: (value) => {
                onChange(getColorStr(value, colorMode));
            } })),
        React.createElement("div", { style: { marginTop: 12 } },
            React.createElement("div", { className: "color-panel-mode" },
                React.createElement("div", { className: "color-panel-preview" },
                    React.createElement("div", { style: { backgroundColor: color, width: '100%', height: '100%' } })),
                React.createElement(Select, { value: colorMode, onChange: handleColorModeChange, options: colorModes
                        .filter((item) => alpha || item === 'HEX' || item === 'RGB')
                        .map((item) => ({ value: item, key: item })), size: "small", bordered: false, dropdownMatchSelectWidth: false })),
            colorMode === 'HEX' && (React.createElement(HexColorInput, { value: tinycolor(color).toHex(), onChange: (v) => onChange?.(tinycolor(v).toHexString()) })),
            colorMode === 'HEX8' && (React.createElement(HexColorInput, { alpha: true, value: tinycolor(color).toHex8(), onChange: (v) => onChange?.(tinycolor(v).toHex8String()) })),
            (colorMode === 'RGBA' || colorMode === 'RGB') && (React.createElement(RgbColorInput, { alpha: colorMode === 'RGBA', value: tinycolor(color).toRgb(), onChange: (v) => onChange?.(tinycolor(v).toRgbString()) }))),
        React.createElement("div", { className: "color-panel-preset-colors" }, presetColors.map((presetColor) => (React.createElement("button", { key: presetColor, className: "color-panel-preset-color-btn", style: { backgroundColor: presetColor }, onClick: () => onChange(presetColor) }))))));
};
export default ColorPanel;
//# sourceMappingURL=ColorPanel.js.map