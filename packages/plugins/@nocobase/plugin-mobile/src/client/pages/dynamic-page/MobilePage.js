/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Action, AssociationField, DatePicker, RemoteSchemaComponent, SchemaComponentOptions, Select, TimePicker, useDesignable, } from '@nocobase/client';
import { Button as MobileButton, Dialog as MobileDialog } from 'antd-mobile';
import React, { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { Outlet, useParams } from 'react-router-dom';
import { MobileDateFilterWithPicker, MobileDateTimePicker, MobileRangePicker, MobileTimePicker, } from './components/MobileDatePicker';
import { MobilePicker } from './components/MobilePicker';
const AssociationFieldMobile = (props) => {
    return React.createElement(AssociationField, { ...props, popupMatchSelectWidth: true });
};
AssociationFieldMobile.SubTable = AssociationField.SubTable;
AssociationFieldMobile.Nester = AssociationField.Nester;
AssociationFieldMobile.AddNewer = Action.Container;
AssociationFieldMobile.Selector = Action.Container;
AssociationFieldMobile.Viewer = Action.Container;
AssociationFieldMobile.InternalSelect = AssociationField.InternalSelect;
AssociationFieldMobile.ReadPretty = AssociationField.ReadPretty;
AssociationFieldMobile.FileSelector = AssociationField.FileSelector;
const DatePickerMobile = (props) => {
    if (isMobile) {
        return React.createElement(MobileDateTimePicker, { ...props });
    }
    else {
        return React.createElement(DatePicker, { ...props });
    }
};
DatePickerMobile.FilterWithPicker = (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { designable } = useDesignable();
    if (designable !== false) {
        return React.createElement(DatePicker.FilterWithPicker, { ...props });
    }
    else {
        return React.createElement(MobileDateFilterWithPicker, { ...props });
    }
};
DatePickerMobile.RangePicker = MobileRangePicker;
export const mobileComponents = {
    Button: MobileButton,
    Select: (props) => {
        const { designable } = useDesignable();
        if (designable !== false) {
            return React.createElement(Select, { ...props, popupMatchSelectWidth: true });
        }
        else {
            return React.createElement(MobilePicker, { ...props });
        }
    },
    DatePicker: DatePickerMobile,
    UnixTimestamp: MobileDateTimePicker,
    Modal: MobileDialog,
    AssociationField: AssociationFieldMobile,
    TimePicker: (props) => {
        const { designable } = useDesignable();
        if (designable !== false) {
            return React.createElement(TimePicker, { ...props });
        }
        else {
            return React.createElement(MobileTimePicker, { ...props });
        }
    },
};
export const MobilePage = () => {
    const { pageSchemaUid } = useParams();
    const [pageNotFind, setPageNotFind] = React.useState(false);
    const onPageNotFind = useCallback(() => {
        setPageNotFind(true);
    }, []);
    if (pageNotFind) {
        return (React.createElement(RemoteSchemaComponent, { uid: pageSchemaUid, NotFoundPage: 'MobileNotFoundPage', memoized: false, onPageNotFind: onPageNotFind }));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(RemoteSchemaComponent, { uid: pageSchemaUid, NotFoundPage: 'MobileNotFoundPage', memoized: false, onPageNotFind: onPageNotFind, components: mobileComponents }),
        React.createElement(SchemaComponentOptions, { components: mobileComponents },
            React.createElement(Outlet, null)),
        React.createElement("div", { className: "nb-mobile-subpages-slot" })));
};
//# sourceMappingURL=MobilePage.js.map