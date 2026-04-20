/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { forwardRef } from 'react';
import { Tooltip, Button } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { getPopupContainer, useGCMTranslation } from '../utils';
import { useFullscreen } from 'ahooks';
export const FullscreenAction = forwardRef(() => {
    const { t } = useGCMTranslation();
    const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.getElementById('graph_container'));
    return (React.createElement(Tooltip, { title: t('Full Screen'), getPopupContainer: getPopupContainer },
        React.createElement(Button, { onClick: () => {
                toggleFullscreen();
            } }, isFullscreen ? React.createElement(FullscreenExitOutlined, null) : React.createElement(FullscreenOutlined, null))));
});
FullscreenAction.displayName = 'FullscreenAction';
//# sourceMappingURL=FullScreenAction.js.map