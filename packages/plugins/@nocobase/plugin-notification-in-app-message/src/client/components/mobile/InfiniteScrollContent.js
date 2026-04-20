/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { useLocalTranslation } from '../../../locale';
import { DotLoading } from 'antd-mobile';
export default function ({ hasMore, loadMoreStatus, retry, }) {
    const { t } = useLocalTranslation();
    if (loadMoreStatus === 'loading')
        return (React.createElement(React.Fragment, null,
            React.createElement("span", null, t('Loading')),
            React.createElement(DotLoading, null)));
    else if (!hasMore)
        return React.createElement("span", null, t('No more'));
    else if (loadMoreStatus === 'failure')
        return (React.createElement(React.Fragment, null,
            React.createElement("span", null, t('Loading failed,')),
            React.createElement("span", { style: { marginLeft: '5px', color: 'var(--adm-color-primary)', cursor: 'pointer' }, onClick: retry }, t('please reload'))));
    else
        return null;
}
//# sourceMappingURL=InfiniteScrollContent.js.map