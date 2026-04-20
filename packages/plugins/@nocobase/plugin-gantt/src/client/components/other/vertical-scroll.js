/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx } from '@emotion/css';
import React, { useEffect, useRef } from 'react';
import useStyles from './style';
export const VerticalScroll = ({ scroll, ganttHeight, ganttFullHeight, headerHeight, rtl, onScroll }) => {
    const { styles } = useStyles();
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scroll;
        }
    }, [scroll]);
    return (React.createElement("div", { style: {
            maxHeight: ganttHeight,
            marginTop: headerHeight,
            marginLeft: rtl ? '' : '-1rem',
        }, className: cx(styles.nbGridOther, 'verticalScroll'), onScroll: onScroll, ref: scrollRef },
        React.createElement("div", { style: { height: ganttFullHeight, width: 1 } })));
};
//# sourceMappingURL=vertical-scroll.js.map