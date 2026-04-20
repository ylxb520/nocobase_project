/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createForm } from '@formily/core';
import { useField } from '@formily/react';
import { BlockAssociationContext, BlockRequestContext_deprecated, BlockResourceContext, CollectionManagerProvider, FormBlockContext, MaybeCollectionProvider, RecordProvider, useBlockRequestContext, useBlockResource, useCollectionManager_deprecated, useDesignable, useRecord, useResource, } from '@nocobase/client';
import { Spin } from 'antd';
import React, { useMemo, useRef } from 'react';
const InternalFormBlockProvider = (props) => {
    const { action, readPretty } = props;
    const field = useField();
    const form = useMemo(() => createForm({
        readPretty,
    }), []);
    const { resource, service } = useBlockRequestContext();
    const formBlockRef = useRef();
    if (service.loading) {
        return React.createElement(Spin, null);
    }
    return (React.createElement(FormBlockContext.Provider, { value: {
            action,
            form,
            field,
            service,
            resource,
            updateAssociationValues: [],
            formBlockRef,
        } }, readPretty ? (React.createElement(RecordProvider, { record: service?.data?.data },
        React.createElement("div", { ref: formBlockRef }, props.children))) : (React.createElement("div", { ref: formBlockRef }, props.children))));
};
const BlockRequestProvider_deprecated = (props) => {
    const field = useField();
    const resource = useBlockResource();
    const service = {
        loading: false,
        data: {
            data: useRecord(),
        },
    };
    const __parent = useBlockRequestContext();
    return (React.createElement(BlockRequestContext_deprecated.Provider, { value: { block: props.block, props, field, service, resource, __parent } }, props.children));
};
const BlockProvider = (props) => {
    const { collection, association, dataSource } = props;
    const resource = useResource(props);
    return (React.createElement(CollectionManagerProvider, { dataSource: dataSource },
        React.createElement(MaybeCollectionProvider, { collection: collection },
            React.createElement(BlockAssociationContext.Provider, { value: association },
                React.createElement(BlockResourceContext.Provider, { value: resource },
                    React.createElement(BlockRequestProvider_deprecated, { ...props }, props.children))))));
};
export const SnapshotBlockProvider = (props) => {
    const record = useRecord();
    const { __tableName } = record;
    const { getInheritCollections } = useCollectionManager_deprecated(props.dataSource);
    const inheritCollections = getInheritCollections(__tableName);
    const { designable } = useDesignable();
    const flag = !designable && __tableName && !inheritCollections.includes(props.collection) && __tableName !== props.collection;
    return (!flag && (React.createElement(BlockProvider, { ...props },
        React.createElement(InternalFormBlockProvider, { ...props }))));
};
//# sourceMappingURL=SnapshotBlockProvider.js.map