/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { connect, mapProps } from '@formily/react';
import { Select } from '@nocobase/client';
import { Button, CheckList, Popup, SearchBar } from 'antd-mobile';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
const MobilePicker = connect((props) => {
    const { value, onChange, disabled, options = [], mode } = props;
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(value || []);
    const [searchText, setSearchText] = useState(null);
    const filteredItems = useMemo(() => {
        if (searchText) {
            return options.filter((item) => item.label.toLowerCase().includes(searchText.toLowerCase()));
        }
        return options;
    }, [options, searchText]);
    const handleConfirm = () => {
        onChange(selected);
        setVisible(false);
    };
    useEffect(() => {
        !visible && setSearchText(null);
    }, [visible]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onClick: () => !disabled && setVisible(true) },
            React.createElement(Select, { disabled: disabled, value: value, dropdownStyle: { display: 'none' }, multiple: ['multiple', 'tags'].includes(mode), onClear: () => {
                    setVisible(false);
                    onChange(null);
                    setSelected(null);
                }, onFocus: (e) => e.preventDefault(), style: { pointerEvents: 'none' } })),
        React.createElement(Popup, { visible: visible, onMaskClick: () => {
                setVisible(false);
                if (!value || value?.length === 0) {
                    setSelected([]);
                }
            }, destroyOnClose: true },
            React.createElement("div", { style: { margin: '10px' } },
                React.createElement(SearchBar, { placeholder: t('search'), value: searchText, onChange: (v) => setSearchText(v), showCancelButton: true })),
            React.createElement("div", { style: {
                    maxHeight: '60vh',
                    overflowY: 'auto',
                } },
                React.createElement(CheckList, { multiple: ['multiple', 'tags'].includes(mode), value: Array.isArray(selected) ? selected : [selected] || [], onChange: (val) => {
                        if (['multiple', 'tags'].includes(mode)) {
                            setSelected(val);
                        }
                        else {
                            setSelected(val[0]);
                            onChange(val[0]);
                            setVisible(false);
                        }
                    } }, filteredItems.map((item) => (React.createElement(CheckList.Item, { key: item.value, value: item.value }, item.label))))),
            ['multiple', 'tags'].includes(mode) && (React.createElement(Button, { block: true, color: "primary", onClick: handleConfirm, style: { marginTop: '16px' } }, t('Confirm'))))));
}, mapProps({ dataSource: 'options' }));
MobilePicker.displayName = 'MobilePicker';
export { MobilePicker };
//# sourceMappingURL=MobilePicker.js.map