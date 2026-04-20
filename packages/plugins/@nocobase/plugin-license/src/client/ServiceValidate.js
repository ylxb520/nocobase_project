/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState, useEffect } from 'react';
import { useAPIClient } from '@nocobase/client';
import { Alert } from 'antd';
import { useT } from './locale';
export const ServiceValidate = ({ refreshToken }) => {
    const api = useAPIClient();
    const [state, setState] = useState(null);
    const t = useT();
    useEffect(() => {
        setState(null);
        api
            .request({
            url: '/license:license-validate',
            method: 'get',
        })
            .then((res) => {
            setState(res?.data?.data);
        })
            .catch((err) => {
            console.log(err);
        });
    }, [refreshToken]);
    if (!state?.licenseStatus || state?.licenseStatus !== 'active') {
        return null;
    }
    if (state?.isServiceConnection === false && state?.isPkgLogin === false) {
        return (React.createElement(Alert, { message: t('Network error.'), description: React.createElement(React.Fragment, null,
                t('Due to network issues, the license key cannot be updated automatically. Please update it manually if necessary.'),
                React.createElement("br", null),
                t('Plugins also cannot be updated automatically (they are still usable). To update plugins, please check your network connection or refer to the NocoBase Service documentation to upload plugins manually.')), type: "warning", style: {
                marginBottom: 12,
            } }));
    }
    if (state?.isServiceConnection === false) {
        return (React.createElement(Alert, { message: t('Network error.'), description: React.createElement(React.Fragment, null, t('Due to network issues, the license key cannot be updated automatically. Please update it manually if necessary.')), type: "warning", style: {
                marginBottom: 12,
            } }));
    }
    if (state?.isPkgLogin === false) {
        return (React.createElement(Alert, { message: t('Network error.'), description: React.createElement(React.Fragment, null, t('Due to network issues, plugins cannot be updated automatically (they are still usable). To update plugins, please check your network connection or refer to the NocoBase Service documentation to upload plugins manually.')), type: "warning", style: {
                marginBottom: 12,
            } }));
    }
    return null;
};
//# sourceMappingURL=ServiceValidate.js.map