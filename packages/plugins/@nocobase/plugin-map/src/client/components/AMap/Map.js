/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import AMapLoader from '@amap/amap-jsapi-loader';
import '@amap/amap-jsapi-types';
import { SyncOutlined } from '@ant-design/icons';
import { useFieldSchema } from '@formily/react';
import { css, useApp, useCollection_deprecated, useNavigateNoUpdate } from '@nocobase/client';
import { useMemoizedFn } from 'ahooks';
import { Alert, App, Button, Spin } from 'antd';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useMapConfiguration } from '../../hooks';
import { useMapTranslation } from '../../locale';
import { Search } from './Search';
const methodMapping = {
    point: {
        mouseTool: 'marker',
        propertyKey: 'position',
        overlay: 'Marker',
    },
    polygon: {
        mouseTool: 'polygon',
        editor: 'PolygonEditor',
        propertyKey: 'path',
        overlay: 'Polygon',
    },
    lineString: {
        mouseTool: 'polyline',
        editor: 'PolylineEditor',
        propertyKey: 'path',
        overlay: 'Polyline',
    },
    circle: {
        mouseTool: 'circle',
        editor: 'CircleEditor',
        transformOptions(value) {
            return {
                center: value.slice(0, 2),
                radius: value[2],
            };
        },
        overlay: 'Circle',
    },
};
//1.0
export const AMapComponent = React.forwardRef((props, ref) => {
    const { accessKey, securityJsCode } = useMapConfiguration(props.mapType) || {};
    const { value, onChange, block = false, readonly, disabled = block, zoom = 13, overlayCommonOptions, height } = props;
    const { t } = useMapTranslation();
    const fieldSchema = useFieldSchema();
    const aMap = useRef();
    const map = useRef();
    const mouseTool = useRef();
    const [needUpdateFlag, forceUpdate] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const { getField } = useCollection_deprecated();
    const type = useMemo(() => {
        if (props.type)
            return props.type;
        const collectionField = getField(fieldSchema?.name);
        return collectionField?.interface;
    }, [props?.type, fieldSchema?.name]);
    const overlay = useRef();
    const editor = useRef(null);
    const navigate = useNavigateNoUpdate();
    const id = useRef(`nocobase-map-${type || ''}-${Date.now().toString(32)}`);
    const { modal } = App.useApp();
    const [commonOptions] = useState({
        strokeWeight: 5,
        strokeColor: '#4e9bff',
        fillColor: '#4e9bff',
        strokeOpacity: 1,
        ...overlayCommonOptions,
    });
    useEffect(() => {
        if (map.current) {
            map.current.setZoom(zoom);
        }
    }, [zoom]);
    const toRemoveOverlay = useMemoizedFn(() => {
        if (overlay.current) {
            overlay.current.remove();
        }
    });
    const setTarget = useMemoizedFn(() => {
        if ((!disabled || block) && type !== 'point' && editor.current) {
            editor.current.setTarget(overlay.current);
            editor.current.open();
        }
    });
    const onMapChange = useMemoizedFn((target, onlyChange = false) => {
        let nextValue = null;
        if (type === 'point') {
            const { lat, lng } = target.getPosition();
            nextValue = [lng, lat];
        }
        else if (type === 'polygon' || type === 'lineString') {
            nextValue = target.getPath().map((item) => [item.lng, item.lat]);
            if (nextValue.length < 2) {
                return;
            }
        }
        else if (type === 'circle') {
            const center = target.getCenter();
            const radius = target.getRadius();
            nextValue = [center.lng, center.lat, radius];
        }
        if (!onlyChange) {
            toRemoveOverlay();
            overlay.current = target;
            setTarget();
        }
        onChange?.(nextValue);
    });
    const createEditor = useMemoizedFn((curType = type) => {
        const mapping = methodMapping[curType];
        if (mapping && 'editor' in mapping && !editor.current) {
            editor.current = new aMap.current[mapping.editor](map.current, null, {
                createOptions: commonOptions,
                editOptions: commonOptions,
                controlPoint: {
                    ...commonOptions,
                    strokeWeight: 3,
                },
                midControlPoint: {
                    ...commonOptions,
                    strokeWeight: 2,
                    fillColor: '#fff',
                },
            });
            editor.current.on('adjust', function ({ target }) {
                onMapChange(target, true);
            });
            editor.current.on('move', function ({ target }) {
                onMapChange(target, true);
            });
            return editor.current;
        }
    });
    const executeMouseTool = useMemoizedFn((curType = type) => {
        if (!mouseTool.current || editor.current?.getTarget())
            return;
        const mapping = methodMapping[curType];
        if (!mapping) {
            return;
        }
        mouseTool.current[mapping.mouseTool]({
            ...commonOptions,
        });
    });
    const createMouseTool = useMemoizedFn((curType = type) => {
        if (mouseTool.current)
            return;
        mouseTool.current = new aMap.current.MouseTool(map.current);
        mouseTool.current.on('draw', function ({ obj }) {
            onMapChange(obj);
        });
        executeMouseTool(curType);
    });
    const toCenter = (position, imm) => {
        if (map.current) {
            map.current.setZoomAndCenter(18, position, imm);
        }
    };
    const onReset = () => {
        const ok = () => {
            toRemoveOverlay();
            if (editor.current) {
                editor.current.setTarget();
                editor.current.close();
            }
            onChange?.(null);
        };
        modal.confirm({
            title: t('Clear the canvas'),
            content: t('Are you sure to clear the canvas?'),
            okText: t('Confirm'),
            cancelText: t('Cancel'),
            getContainer: () => document.getElementById(id.current),
            onOk() {
                ok();
            },
        });
    };
    const onFocusOverlay = () => {
        if (overlay.current) {
            map.current.setFitView([overlay.current]);
        }
    };
    const getOverlay = useCallback((t = type, v = value, o) => {
        const mapping = methodMapping[t];
        if (!mapping) {
            return;
        }
        const options = { ...commonOptions, ...o };
        if ('transformOptions' in mapping) {
            Object.assign(options, mapping.transformOptions(v));
        }
        else if ('propertyKey' in mapping) {
            options[mapping.propertyKey] = v;
        }
        return new aMap.current[mapping.overlay](options);
    }, [commonOptions]);
    const setOverlay = (t = type, v = value, o) => {
        if (!aMap.current)
            return;
        const nextOverlay = getOverlay(t, v, o);
        nextOverlay.setMap(map.current);
        return nextOverlay;
    };
    // 编辑时
    useEffect(() => {
        if (!aMap.current)
            return;
        if (!value || (!readonly && overlay.current)) {
            return;
        }
        const nextOverlay = setOverlay();
        // 聚焦在编辑的位置
        map.current.setFitView([nextOverlay]);
        overlay.current = nextOverlay;
        if (!disabled) {
            createEditor();
            setTarget();
        }
    }, [value, needUpdateFlag, type, commonOptions, disabled, readonly]);
    // 当在编辑时，关闭 mouseTool
    useEffect(() => {
        if (!mouseTool.current)
            return;
        if (disabled) {
            mouseTool.current?.close();
            editor.current?.close();
        }
        else {
            executeMouseTool();
            editor.current?.open();
        }
    }, [disabled]);
    // AMap.MouseTool & AMap.XXXEditor
    useEffect(() => {
        if (!aMap.current || !type || disabled)
            return;
        createMouseTool();
        createEditor();
    }, [disabled, needUpdateFlag, type]);
    // 当值变更时，toggle mouseTool
    useEffect(() => {
        if (!value && (mouseTool.current || editor.current)) {
            toRemoveOverlay();
            if (editor.current) {
                editor.current.setTarget();
                editor.current.close();
            }
            onChange?.(null);
        }
        if (!mouseTool.current || !editor.current)
            return;
        const target = editor.current.getTarget();
        if (target) {
            mouseTool.current.close?.();
        }
        else {
            executeMouseTool();
        }
    }, [type, value]);
    useEffect(() => {
        if (!accessKey || map.current)
            return;
        if (securityJsCode) {
            window._AMapSecurityConfig = {
                [securityJsCode.endsWith('_AMapService') ? 'serviceHOST' : 'securityJsCode']: securityJsCode,
            };
        }
        const _define = window.define;
        window.define = undefined;
        if (window.AMap) {
            try {
                requestIdleCallback(() => {
                    map.current = new AMap.Map(id.current, {
                        resizeEnable: true,
                        zoom,
                    });
                    aMap.current = AMap;
                    setErrMessage('');
                    forceUpdate([]);
                });
                return;
            }
            catch (err) {
                setErrMessage(err);
            }
        }
        AMapLoader.load({
            key: accessKey,
            version: '2.0',
            plugins: ['AMap.MouseTool', 'AMap.PolygonEditor', 'AMap.PolylineEditor', 'AMap.CircleEditor'],
        })
            .then((amap) => {
            window.define = _define;
            return requestIdleCallback(() => {
                map.current = new amap.Map(id.current, {
                    resizeEnable: true,
                    zoom,
                });
                aMap.current = amap;
                setErrMessage('');
                forceUpdate([]);
            });
        })
            .catch((err) => {
            if (typeof err === 'string') {
                if (err.includes('多个不一致的 key')) {
                    setErrMessage(t('The AccessKey is incorrect, please check it'));
                }
                else {
                    setErrMessage(err);
                }
            }
            else if (err?.type === 'error') {
                setErrMessage('Something went wrong, please refresh the page and try again');
            }
        });
        return () => {
            map.current?.destroy();
            aMap.current = null;
            map.current = null;
            mouseTool.current = null;
            editor.current = null;
            // @ts-ignore
            AMapLoader.reset();
        };
    }, [accessKey, type, securityJsCode]);
    useImperativeHandle(ref, () => ({
        setOverlay,
        getOverlay,
        createMouseTool,
        createEditor,
        executeMouseTool,
        aMap: aMap.current,
        map: map.current,
        overlay: overlay.current,
        mouseTool: () => mouseTool.current,
        editor: () => editor.current,
        errMessage,
    }));
    const app = useApp();
    if (!accessKey || errMessage) {
        return (React.createElement(Alert, { action: React.createElement(Button, { type: "primary", onClick: () => navigate(app.pluginSettingsManager?.getRoutePath('map') || '/admin/settings/map') }, t('Go to the configuration page')), message: errMessage || t('Please configure the AccessKey and SecurityJsCode first'), type: "error" }));
    }
    return (React.createElement("div", { className: css `
        position: relative;
        height: ${height || 500}px !important;
      `, id: id.current, style: props?.style },
        !aMap.current && (React.createElement("div", { className: css `
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          ` },
            React.createElement(Spin, null))),
        !disabled ? (React.createElement(React.Fragment, null,
            React.createElement(Search, { toCenter: toCenter, aMap: aMap.current }),
            React.createElement("div", { className: css `
              position: absolute;
              bottom: 80px;
              right: 20px;
              z-index: 10;
            ` },
                React.createElement(Button, { onClick: onFocusOverlay, disabled: !overlay.current, type: "primary", shape: "round", size: "large", icon: React.createElement(SyncOutlined, null) })),
            type !== 'point' ? (React.createElement("div", { className: css `
                position: absolute;
                bottom: 20px;
                left: 10px;
                z-index: 2;
                pointer-events: none;
              ` },
                React.createElement(Alert, { message: t('Click to select the starting point and double-click to end the drawing'), type: "info" }))) : null,
            React.createElement("div", { className: css `
              position: absolute;
              bottom: 20px;
              right: 20px;
              z-index: 2;
            ` },
                React.createElement(Button, { disabled: !value, style: {
                        height: '40px',
                    }, onClick: onReset, type: "primary", danger: true }, t('Clear'))))) : null));
});
AMapComponent.displayName = 'AMapComponent';
//# sourceMappingURL=Map.js.map