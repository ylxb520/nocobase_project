/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { PopupContextProvider, withSkeletonComponent } from '@nocobase/client';
import React, { useMemo } from 'react';
import { useMapTranslation } from '../locale';
import { AMapBlock } from './AMap';
import { GoogleMapsBlock } from './GoogleMaps';
const MapBlocks = {
    amap: AMapBlock,
    google: GoogleMapsBlock,
};
export const MapBlockComponent = withSkeletonComponent((props) => {
    const { t } = useMapTranslation();
    const { mapType } = props;
    const Component = useMemo(() => {
        return MapBlocks[mapType];
    }, [mapType]);
    if (!Component) {
        return React.createElement("div", null, t(`The ${mapType} cannot found`));
    }
    return (React.createElement(PopupContextProvider, null,
        React.createElement(Component, { ...props })));
}, {
    displayName: 'MapBlockComponent',
});
//# sourceMappingURL=MapBlock.js.map