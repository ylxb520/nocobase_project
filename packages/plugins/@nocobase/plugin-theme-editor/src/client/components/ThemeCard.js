/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { compatOldTheme, useAPIClient, useCurrentUserContext, useGlobalTheme, useToken } from '@nocobase/client';
import { error } from '@nocobase/utils/client';
import { App, Card, ConfigProvider, Dropdown, Space, Switch, Tag, message } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { Primary } from '../antd-token-previewer';
import { useUpdateThemeSettings } from '../hooks/useUpdateThemeSettings';
import { useTranslation } from '../locale';
import { useThemeId } from './InitializeTheme';
import { useThemeEditorContext } from './ThemeEditorProvider';
var HandleTypes;
(function (HandleTypes) {
    HandleTypes["delete"] = "delete";
    HandleTypes["optional"] = "optional";
})(HandleTypes || (HandleTypes = {}));
const Overview = ({ theme }) => {
    const { token } = useToken();
    return (React.createElement(ConfigProvider, { theme: { ...theme, inherit: false } },
        React.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                width: '100%',
                height: 129,
                borderRadius: token.borderRadiusLG,
                overflow: 'hidden',
            } },
            React.createElement(Space, { style: {
                    transform: 'scale(0.7) translate(0, 0)',
                    transformOrigin: '0 0',
                }, size: 0, align: "start" },
                React.createElement(Primary, null)))));
};
const ThemeCard = (props) => {
    const { theme: currentTheme, setTheme, setCurrentSettingTheme, setCurrentEditingTheme, getCurrentEditingTheme, } = useGlobalTheme();
    const { setOpen } = useThemeEditorContext();
    const currentUser = useCurrentUserContext();
    const { item, style = {}, onChange } = props;
    const api = useAPIClient();
    const { updateUserThemeSettings } = useUpdateThemeSettings();
    const { modal } = App.useApp();
    const [loading, setLoading] = React.useState(false);
    const { currentThemeId, defaultThemeId } = useThemeId();
    const { t } = useTranslation();
    const { token } = useToken();
    const isDefault = item.id === defaultThemeId;
    const handleDelete = useCallback(() => {
        if (isDefault) {
            return;
        }
        modal.confirm({
            title: t('Delete theme'),
            content: t('Deletion is unrecoverable. Confirm deletion?'),
            onOk: async () => {
                await api.request({
                    url: `themeConfig:destroy/${item.id}`,
                });
                if (item.id === currentUser?.data?.data?.systemSettings?.themeId) {
                    updateUserThemeSettings(null);
                }
                message.success(t('Deleted successfully'));
                onChange?.({ type: HandleTypes.delete, item });
            },
        });
    }, [
        api,
        currentUser?.data?.data?.systemSettings?.themeId,
        isDefault,
        item,
        modal,
        onChange,
        t,
        updateUserThemeSettings,
    ]);
    const handleSwitchOptional = useCallback(async (checked) => {
        setLoading(true);
        try {
            if (!checked) {
                await Promise.all([
                    api.request({
                        url: `themeConfig:update/${item.id}`,
                        method: 'post',
                        data: {
                            optional: checked,
                            default: false,
                        },
                    }),
                    // 如果用户把当前设置的主题设置为不可选，那么就需要把当前设置的主题设置为默认主题
                    item.id === currentUser?.data?.data?.systemSettings?.themeId && updateUserThemeSettings(null),
                ]);
            }
            else {
                await api.request({
                    url: `themeConfig:update/${item.id}`,
                    method: 'post',
                    data: {
                        optional: checked,
                    },
                });
            }
        }
        catch (err) {
            error(err);
        }
        setLoading(false);
        message.success(t('Updated successfully'));
        onChange?.({ type: HandleTypes.optional, item });
    }, [api, currentUser?.data?.data?.systemSettings?.themeId, item, onChange, t, updateUserThemeSettings]);
    const handleSwitchDefault = useCallback(async (checked) => {
        setLoading(true);
        try {
            if (checked) {
                await Promise.all([
                    // 用户在设置该主题为默认主题时，肯定也希望该主题可被用户选择
                    api.request({
                        url: `themeConfig:update/${item.id}`,
                        method: 'post',
                        data: {
                            optional: true,
                            default: true,
                        },
                    }),
                ]);
            }
            else {
                await api.request({
                    url: `themeConfig:update/${item.id}`,
                    method: 'post',
                    data: {
                        default: false,
                    },
                });
            }
        }
        catch (err) {
            error(err);
        }
        setLoading(false);
        message.success(t('Updated successfully'));
        onChange?.({ type: HandleTypes.optional, item });
    }, [api, item, onChange, t]);
    const handleEdit = useCallback(() => {
        setCurrentSettingTheme(currentTheme);
        setCurrentEditingTheme(item);
        setTheme(compatOldTheme(item.config));
        setOpen(true);
    }, [item, setCurrentEditingTheme, setCurrentSettingTheme, setOpen, setTheme, currentTheme]);
    const menu = useMemo(() => {
        return {
            items: [
                {
                    key: 'optional',
                    label: (React.createElement(Space, { style: { width: '100%', justifyContent: 'space-between' }, align: "center", size: "middle", onClick: (e) => e.stopPropagation() },
                        React.createElement("span", null, t('User selectable')),
                        React.createElement(Switch, { disabled: isDefault, style: { transform: 'translateY(-2px)' }, checked: item.optional, size: 'small', loading: loading, onChange: handleSwitchOptional }))),
                },
                {
                    key: 'system',
                    label: (React.createElement(Space, { style: { width: '100%', justifyContent: 'space-between' }, align: "center", size: "middle", onClick: (e) => e.stopPropagation() },
                        React.createElement("span", null, t('Default theme')),
                        React.createElement(Switch, { disabled: isDefault, style: { transform: 'translateY(-2px)' }, checked: isDefault, size: 'small', loading: loading, onChange: handleSwitchDefault }))),
                },
            ],
        };
    }, [handleSwitchDefault, handleSwitchOptional, isDefault, item.optional, loading, t]);
    const actions = useMemo(() => {
        return [
            React.createElement(EditOutlined, { key: "edit", onClick: handleEdit }),
            React.createElement(DeleteOutlined, { key: "delete", style: isDefault
                    ? {
                        color: token.colorTextDisabled,
                        cursor: 'not-allowed',
                    }
                    : null, disabled: isDefault, onClick: handleDelete }),
            React.createElement(Dropdown, { key: "ellipsis", menu: menu },
                React.createElement(EllipsisOutlined, null)),
        ];
    }, [handleDelete, handleEdit, isDefault, menu, token.colorTextDisabled]);
    const extra = useMemo(() => {
        if (item.id !== defaultThemeId && !item.optional) {
            return null;
        }
        const text = item.id === currentThemeId
            ? t('Current')
            : item.id === defaultThemeId
                ? t('Default')
                : item.optional
                    ? t('Optional')
                    : t('Non-optional');
        const color = item.id === currentThemeId
            ? 'processing'
            : item.id === defaultThemeId
                ? 'default'
                : item.optional
                    ? 'success'
                    : 'error';
        return (React.createElement(Tag, { style: { marginRight: 0 }, color: color }, text));
    }, [currentThemeId, defaultThemeId, item.id, item.optional, t]);
    const cardStyle = useMemo(() => {
        if (getCurrentEditingTheme()?.id === item.id) {
            return {
                cursor: 'default',
                width: 240,
                height: 240,
                overflow: 'hidden',
                outline: '1px solid var(--colorSettings)',
                ...style,
            };
        }
        return { cursor: 'default', width: 240, height: 240, overflow: 'hidden', ...style };
    }, [getCurrentEditingTheme, item.id, style]);
    return (React.createElement(Card, { hoverable: true, extra: extra, title: t(item.config?.name), size: "small", style: cardStyle, headStyle: { minHeight: 38 }, actions: actions },
        React.createElement(Overview, { theme: item.config })));
};
ThemeCard.displayName = 'ThemeCard';
export default ThemeCard;
//# sourceMappingURL=ThemeCard.js.map