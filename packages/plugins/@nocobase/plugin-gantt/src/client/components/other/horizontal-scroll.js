/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useRef } from 'react';
import { cx } from '@emotion/css';
import useStyles from './style';
export const HorizontalScroll = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
    const { styles } = useStyles();
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scroll;
        }
    }, [scroll]);
    return (React.createElement("div", { dir: "ltr", style: {
            margin: rtl ? `0px ${taskListWidth}px 0px 0px` : `0px 0px 0px ${taskListWidth}px`,
        }, className: cx(styles.nbGridOther, styles.scrollWrapper, 'gantt-horizontal-scoll'), onScroll: onScroll, ref: scrollRef },
        React.createElement("div", { style: { width: svgWidth, height: 1 }, className: "horizontalScroll" })));
};
//# sourceMappingURL=horizontal-scroll.js.map