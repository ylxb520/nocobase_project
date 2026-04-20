/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo } from 'react';
import { useMapTranslation } from '../../locale';
import { AMapCom } from './AMap';
import { GoogleMapsCom } from './GoogleMaps';
const MapComponents = {
    amap: AMapCom,
    google: GoogleMapsCom,
};
export const MapComponent = React.forwardRef((props, ref) => {
    const { t } = useMapTranslation();
    const { mapType } = props;
    const Component = useMemo(() => {
        return MapComponents[mapType];
    }, [mapType]);
    if (!Component) {
        return React.createElement("div", null, t(`The ${mapType} cannot found`));
    }
    return React.createElement(Component, { ref: ref, ...props });
});
MapComponent.displayName = 'MapComponent';
//# sourceMappingURL=MapComponent.js.map