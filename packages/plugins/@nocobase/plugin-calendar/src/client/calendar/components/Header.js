/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo } from 'react';
import { getLunarDay } from '../utils';
const Header = ({ date, label, drilldownView, onDrillDown, showLunar = false, type, localizer, locale }) => {
    const lunarElement = useMemo(() => {
        if (!showLunar) {
            return;
        }
        return React.createElement("span", { className: "rbc-date-lunar" }, getLunarDay(date));
    }, [date, showLunar]);
    const child = useMemo(() => {
        if (type === 'week') {
            const dayLabel = localizer.format(date, 'd eee', locale);
            return (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "rbc-date-solar", style: { fontSize: 14 } }, dayLabel),
                lunarElement));
        }
        else {
            return (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "rbc-date-solar" }, label),
                lunarElement));
        }
    }, [type]);
    const Wrapper = drilldownView ? 'a' : React.Fragment;
    return (React.createElement(Wrapper, { onClick: onDrillDown, role: "cell" }, child));
};
export default Header;
//# sourceMappingURL=Header.js.map