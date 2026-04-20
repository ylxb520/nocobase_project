/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useMemo } from 'react';
import { connect, mapReadPretty, useField, Schema } from '@formily/react';
import { Select, Tag } from 'antd';
import { EllipsisWithTooltip, useAPIClient, useRequest } from '@nocobase/client';
import { useVerificationTranslation } from '../locale';
import { Link } from 'react-router-dom';
import { FormItem } from '@formily/antd-v5';
const ReadPretty = () => {
    const field = useField();
    return field.value?.length ? (React.createElement(EllipsisWithTooltip, { ellipsis: true }, field.value.map((item) => (React.createElement(Tag, { key: item.name }, item.title))))) : null;
};
export const VerifierSelect = connect((props) => {
    const { t } = useVerificationTranslation();
    const { scene, value, title, onChange } = props;
    let { multiple } = props;
    multiple = multiple ? 'multiple' : undefined;
    const api = useAPIClient();
    const { data } = useRequest(() => api
        .resource('verifiers')
        .listByScene({
        scene,
    })
        .then((res) => res?.data?.data));
    const { verifiers = [], availableTypes = [] } = data || {};
    const options = useMemo(() => verifiers?.map((item) => ({ label: item.title, value: item.name })), [verifiers]);
    return (React.createElement(FormItem, { label: title || t('Verifiers'), extra: React.createElement(React.Fragment, null,
            t('The following types of verifiers are available:'),
            availableTypes.map((item) => Schema.compile(item.title, { t })).join(', '),
            '. ',
            t('Go to'),
            " ",
            React.createElement(Link, { to: "/admin/settings/verification" }, t('create verifiers'))) },
        React.createElement(Select, { allowClear: true, options: options, value: value, mode: multiple, onChange: onChange })));
}, mapReadPretty(ReadPretty));
//# sourceMappingURL=VerifierSelect.js.map