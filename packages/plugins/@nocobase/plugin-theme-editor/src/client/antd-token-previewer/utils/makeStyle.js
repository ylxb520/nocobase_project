/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useStyleRegister } from '@ant-design/cssinjs';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useContext } from 'react';
const { ConfigContext } = ConfigProvider;
const makeStyle = (path, styleFn) => () => {
    const { theme, token, hashId } = antdTheme.useToken();
    const { getPrefixCls } = useContext(ConfigContext);
    const rootCls = getPrefixCls();
    return [
        useStyleRegister({ theme: theme, hashId, token, path: [path] }, () => styleFn({ ...token, rootCls: `.${rootCls}` })),
        hashId,
    ];
};
export default makeStyle;
//# sourceMappingURL=makeStyle.js.map