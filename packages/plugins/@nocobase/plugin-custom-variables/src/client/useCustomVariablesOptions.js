import { useAPIClient, useFlag, useToken, useVariableScopeInfo } from '@nocobase/client';
import React, { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { VariableEditor } from './variableInitializer';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { NAMESPACE } from '../locale';
const Edit = (props) => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation(NAMESPACE);
    const { token } = useToken();
    const prevVisible = useRef(visible);
    const handleClick = (e) => {
        setVisible(true);
    };
    useEffect(() => {
        // refresh the variable list when the editor is closed
        if (!visible && prevVisible.current) {
            props.refresh();
        }
        prevVisible.current = visible;
    }, [visible, props.refresh]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onClick: handleClick },
            React.createElement(EditOutlined, null),
            React.createElement("span", { style: { marginLeft: token.marginXS } }, t('Edit'))),
        React.createElement(VariableEditor, { visible: visible, setVisible: setVisible, initialValues: props.variable })));
};
const MoreActions = (props) => {
    const api = useAPIClient();
    const { t } = useTranslation(NAMESPACE);
    const items = [
        {
            key: 'edit',
            label: React.createElement(Edit, { variable: props.variable, refresh: props.refresh }),
        },
        {
            key: 'delete',
            label: t('Delete'),
            icon: React.createElement(DeleteOutlined, null),
            onClick: async ({ domEvent }) => {
                Modal.confirm({
                    title: t('Delete Variable'),
                    content: t('Are you sure you want to delete "{{label}}" variable?', { label: props.variable.label }),
                    okText: t('Yes'),
                    cancelText: t('No'),
                    onOk: async () => {
                        await api.request({
                            url: `customVariables:destroy`,
                            method: 'POST',
                            params: { filterByTk: props.variable.name },
                        });
                        props.refresh();
                    },
                });
            },
        },
    ];
    return (React.createElement("div", { style: {
            paddingLeft: '8px',
            cursor: 'pointer',
            opacity: props.hidden ? 0 : 1,
        }, onClick: (e) => {
            e.stopPropagation();
        } },
        React.createElement(Dropdown, { menu: { items } },
            React.createElement(EllipsisOutlined, null))));
};
const VariableLabel = (props) => {
    const [showMore, setShowMore] = useState(false);
    const { isInXButton } = useFlag();
    if (!isInXButton) {
        return React.createElement(React.Fragment, null, props.value);
    }
    return (React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, onMouseEnter: () => setShowMore(true), onMouseLeave: () => setShowMore(false) },
        React.createElement("span", null, props.value),
        React.createElement(MoreActions, { variable: props.variable, hidden: !showMore, refresh: props.refresh })));
};
export const useCustomVariablesOptions = () => {
    const [options, setOptions] = useState([]);
    const api = useAPIClient();
    const { getVariableScopeInfo } = useVariableScopeInfo();
    const [loading, setLoading] = useState(false);
    const refresh = useCallback(() => {
        const { scopeId } = getVariableScopeInfo();
        if (!scopeId) {
            return;
        }
        setLoading(true);
        api
            .request({
            url: 'customVariables:list',
            method: 'GET',
            params: {
                filter: {
                    declaredAt: scopeId,
                },
            },
        })
            .then((response) => {
            setOptions(response.data.data.map((item) => ({
                label: React.createElement(VariableLabel, { value: item.label, variable: item, refresh: refresh }),
                value: item.name,
            })));
            setLoading(false);
        })
            .catch((error) => {
            console.error('Error fetching custom variables:', error);
            setOptions([]);
            setLoading(false);
        });
    }, [getVariableScopeInfo]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return {
        options,
        loading,
        refresh,
    };
};
//# sourceMappingURL=useCustomVariablesOptions.js.map