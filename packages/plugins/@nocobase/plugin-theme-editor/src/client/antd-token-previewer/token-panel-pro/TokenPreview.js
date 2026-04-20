/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import getColorBgImg from '../utils/getColorBgImg';
import getDesignToken from '../utils/getDesignToken';
const TokenPreview = ({ theme, tokenName, type }) => {
    if (type === 'Color') {
        return (React.createElement("div", { style: {
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
                width: '100%',
                height: '100%',
                position: 'relative',
            } },
            React.createElement("div", { style: {
                    height: '100%',
                    width: '100%',
                    backgroundColor: getDesignToken(theme)[tokenName],
                    transition: 'background-color 0.2s',
                } })));
    }
    if (type === 'FontSize') {
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
                fontSize: getDesignToken(theme)[tokenName],
                fontWeight: 700,
            } },
            React.createElement("span", null, "Aa")));
    }
    if (type === 'LineHeight') {
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                overflow: 'hidden',
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
            } },
            React.createElement("span", { style: {
                    fontSize: getDesignToken(theme)[tokenName.replace('lineHeight', 'fontSize')],
                    lineHeight: getDesignToken(theme)[tokenName],
                    background: '#fff2f0',
                    paddingInline: 8,
                } }, "Aa")));
    }
    if (type === 'Margin') {
        const margin = getDesignToken(theme)[tokenName];
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
            } },
            React.createElement("div", { style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    background: '#fff1b8',
                    transform: 'translate(10%, 10%) scale(0.8)',
                } },
                React.createElement("div", { style: {
                        marginLeft: margin,
                        marginTop: margin,
                        width: `calc(100% - ${margin}px)`,
                        height: `calc(100% - ${margin}px)`,
                        background: '#bae0ff',
                    } }))));
    }
    if (type === 'Padding') {
        const padding = getDesignToken(theme)[tokenName];
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
            } },
            React.createElement("div", { style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    background: '#d9f7be',
                    transform: 'translate(10%, 10%) scale(0.8)',
                    paddingLeft: padding,
                    paddingTop: padding,
                } },
                React.createElement("div", { style: {
                        width: `100%`,
                        height: `100%`,
                        background: '#bae0ff',
                    } }))));
    }
    if (type === 'BorderRadius') {
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
            } },
            React.createElement("div", { style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    transform: 'translate(30%, 30%)',
                    border: '2px solid rgba(0,0,0,0.45)',
                    background: '#fff',
                    borderRadius: getDesignToken(theme)[tokenName],
                } })));
    }
    if (type === 'BoxShadow') {
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${getColorBgImg(false)} 0% 0% / 28px`,
            } },
            React.createElement("div", { style: {
                    width: '60%',
                    height: '50%',
                    borderRadius: 6,
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    boxShadow: getDesignToken(theme)[tokenName],
                } })));
    }
    return null;
};
export default TokenPreview;
//# sourceMappingURL=TokenPreview.js.map