/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionContextProvider, AdminProvider, css, cx, RemoteSchemaComponent, useViewport } from '@nocobase/client';
import React, { useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { MobileCore } from '../core';
import { useInterfaceContext } from './InterfaceProvider';
import { OpenInNewTab } from './OpenInNewTab';
const commonCSSVariables = css `
  --nb-spacing: 14px;
`;
const commonCSSOverride = css ``;
const commonDesignerCSS = css `
  --nb-designer-top: 2px;
  --nb-designer-right: 2px;
  .nb-sortable-designer:hover {
    position: relative;
    > .general-schema-designer {
      display: block;
    }
  }
  .general-schema-designer {
    position: absolute;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    border: 0;
    pointer-events: none;
    > .general-schema-designer-icons {
      position: absolute;
      top: var(--nb-designer-top);
      right: var(--nb-designer-right);
      line-height: 16px;
      pointer-events: all;
      .ant-space-item {
        background-color: var(--colorSettings);
        color: #fff;
        line-height: 16px;
        width: 16px;
        padding-left: 1px;
        align-self: stretch;
      }
    }
  }
`;
const drawerProps = {
    getContainer: '.nb-mobile-application',
    width: '90%',
    style: {
        position: 'absolute',
    },
};
const modalProps = {
    ...drawerProps,
    style: {
        maxWidth: 'calc(100% - 16px)',
    },
    maskStyle: {
        position: 'absolute',
    },
    wrapClassName: css `
    position: absolute !important;
  `,
};
const useMobileSchemaUid = () => {
    return 'nocobase-mobile-container';
};
const MApplication = (props) => {
    const mobileSchemaUid = useMobileSchemaUid();
    const params = useParams();
    const interfaceContext = useInterfaceContext();
    const Provider = useMemo(() => {
        return interfaceContext ? React.Fragment : AdminProvider;
    }, [interfaceContext]);
    useViewport();
    return (React.createElement(Provider, null,
        React.createElement(MobileCore, null,
            React.createElement(OpenInNewTab, null),
            React.createElement(ActionContextProvider, { modalProps: modalProps, drawerProps: drawerProps },
                React.createElement("div", { className: cx('nb-mobile-application', commonDesignerCSS, commonCSSVariables, commonCSSOverride, css `
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                position: relative;
                overflow: hidden;
              `) },
                    params.name && !params.name.startsWith('tab_') ? (React.createElement(Outlet, null)) : (React.createElement(RemoteSchemaComponent, { key: mobileSchemaUid, uid: mobileSchemaUid }, props.children)),
                    React.createElement("div", { id: "nb-position-container" }))))));
};
export default MApplication;
//# sourceMappingURL=Application.js.map