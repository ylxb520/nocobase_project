/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ConfigProvider, Segmented, Space, theme as antdTheme } from 'antd';
import React from 'react';
import ComponentDemoGroup from '../component-panel/ComponentDemoGroup';
import { useLocale } from '../locale';
import { Error, Primary, Success, Warning } from '../overviews';
const ComponentDemoPro = ({ selectedTokens, theme, components, activeComponents, componentDrawer, showAll, style, }) => {
    const [mode, setMode] = React.useState('overview');
    const { token: { colorBgLayout }, } = antdTheme.useToken();
    const locale = useLocale();
    const overviewDemo = React.useMemo(() => {
        if (showAll) {
            return (React.createElement(Space, { direction: "vertical" },
                React.createElement(Primary, null),
                React.createElement(Success, null),
                React.createElement(Error, null),
                React.createElement(Warning, null)));
        }
        if (selectedTokens?.includes('colorError')) {
            return React.createElement(Error, null);
        }
        if (selectedTokens?.includes('colorSuccess')) {
            return React.createElement(Success, null);
        }
        if (selectedTokens?.includes('colorWarning')) {
            return React.createElement(Warning, null);
        }
        return React.createElement(Primary, null);
    }, [selectedTokens, showAll]);
    return (React.createElement("div", { style: { ...style, background: colorBgLayout, paddingBottom: 24 } },
        React.createElement("div", { style: { margin: 'auto', maxWidth: 960 } },
            React.createElement(Segmented, { options: [
                    { value: 'overview', label: locale.overview },
                    { value: 'component', label: locale.components },
                ], value: mode, onChange: setMode, style: { margin: '12px 0 0 12px' } }),
            React.createElement(ConfigProvider, { theme: {
                    components: {
                        Select: {
                            zIndexPopup: 10,
                        },
                        DatePicker: {
                            zIndexPopup: 10,
                        },
                        Dropdown: {
                            zIndexPopup: 10,
                        },
                        Mentions: {
                            zIndexPopup: 10,
                        },
                        Tooltip: {
                            zIndexPopup: 10,
                        },
                        Popover: {
                            zIndexPopup: 10,
                        },
                        Popconfirm: {
                            zIndexPopup: 10,
                        },
                    },
                } }, mode === 'overview' ? (React.createElement("div", { style: { margin: 12, maxWidth: 'fit-content' } }, overviewDemo)) : (React.createElement(ComponentDemoGroup, { selectedTokens: selectedTokens, themes: [theme], components: components, activeComponents: activeComponents, componentDrawer: componentDrawer, hideTokens: true }))))));
};
export default (props) => (React.createElement(ConfigProvider, { theme: props.theme.config },
    React.createElement(ComponentDemoPro, { ...props })));
//# sourceMappingURL=ComponentDemoPro.js.map