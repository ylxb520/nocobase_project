/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SyncOutlined } from '@ant-design/icons';
import { useFieldSchema } from '@formily/react';
import { Loader } from '@googlemaps/js-api-loader';
import { css, useAPIClient, useApp, useCollection_deprecated, useNavigateNoUpdate } from '@nocobase/client';
import { useMemoizedFn } from 'ahooks';
import { Alert, App, Button, Spin } from 'antd';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { defaultImage } from '../../constants';
import { useMapConfiguration } from '../../hooks';
import { useMapTranslation } from '../../locale';
import { Search } from './Search';
import { getCurrentPosition, getIcon } from './utils';
export const getDrawingMode = (type) => {
    if (type === 'point') {
        return 'marker';
    }
    else if (type === 'lineString') {
        return 'polyline';
    }
    return type;
};
const methodMapping = {
    point: {
        propertyKey: 'position',
        overlay: 'Marker',
    },
    polygon: {
        propertyKey: 'paths',
        overlay: 'Polygon',
    },
    lineString: {
        propertyKey: 'path',
        overlay: 'Polyline',
    },
    circle: {
        transformOptions(value) {
            return {
                center: new google.maps.LatLng(value[1], value[0]),
                radius: value[2],
            };
        },
        overlay: 'Circle',
    },
};
export const GoogleMapsComponent = React.forwardRef((props, ref) => {
    const { value, onChange, block = false, readonly, disabled = block, zoom = 13, overlayCommonOptions, height, } = props;
    const { accessKey } = useMapConfiguration(props.mapType) || {};
    const { t } = useMapTranslation();
    const { getField } = useCollection_deprecated();
    const fieldSchema = useFieldSchema();
    const drawingManagerRef = useRef();
    const map = useRef();
    const overlayRef = useRef();
    const [needUpdateFlag, forceUpdate] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const api = useAPIClient();
    const { modal } = App.useApp();
    useEffect(() => {
        if (map.current) {
            map.current.setZoom(zoom);
        }
    }, [zoom]);
    const type = useMemo(() => {
        if (props.type)
            return props.type;
        const collectionField = getField(fieldSchema?.name);
        return collectionField?.interface;
    }, [props?.type, fieldSchema?.name]);
    const drawingMode = useRef(getDrawingMode(type));
    const [commonOptions] = useState({
        strokeWeight: 5,
        strokeColor: '#4e9bff',
        fillColor: '#4e9bff',
        strokeOpacity: 1,
        editable: !disabled,
        draggable: !disabled,
        ...overlayCommonOptions,
    });
    const navigate = useNavigateNoUpdate();
    const mapContainerRef = useRef();
    const cleanupOverlayListenersRef = useRef(new Set());
    const onAndOffListenOverlay = useMemoizedFn((target) => {
        cleanupOverlayListenersRef.current.forEach((cb) => {
            cleanupOverlayListenersRef.current.delete(cb);
        });
        if ('getPath' in target) {
            const mvcArray = target.getPath();
            ['insert_at', 'remove_at', 'set_at'].forEach((event) => {
                cleanupOverlayListenersRef.current.add(mvcArray.addListener(event, () => {
                    onMapChange(target, true);
                }).remove);
            });
        }
        else if (target instanceof google.maps.Circle) {
            ['center_changed', 'radius_changed'].forEach((event) => {
                cleanupOverlayListenersRef.current.add(target.addListener(event, () => {
                    onMapChange(target, true);
                }).remove);
            });
        }
    });
    const toRemoveOverlay = useMemoizedFn(() => {
        if (overlayRef.current) {
            overlayRef.current.unbindAll();
            overlayRef.current.setMap(null);
        }
        if (type !== 'point') {
            drawingManagerRef.current?.setDrawingMode(null);
        }
    });
    const toCenter = useMemoizedFn((position) => {
        if (map.current && position) {
            map.current?.setCenter(position);
            map.current?.setZoom(zoom);
        }
    });
    const setupOverlay = useMemoizedFn((nextOverlay) => {
        toRemoveOverlay();
        onAndOffListenOverlay(nextOverlay);
        overlayRef.current = nextOverlay;
    });
    const setFitView = useMemoizedFn((overlays) => {
        const bounds = new google.maps.LatLngBounds();
        overlays.forEach((overlay) => {
            if (overlay instanceof google.maps.Marker) {
                bounds.extend(overlay.getPosition());
            }
            else if (overlay instanceof google.maps.Polyline || overlay instanceof google.maps.Polygon) {
                const path = overlay.getPath();
                for (let i = 0; i < path.getLength(); i++) {
                    bounds.extend(path.getAt(i));
                }
            }
            else if (overlay instanceof google.maps.Circle) {
                bounds.union(overlay.getBounds());
            }
        });
        map.current?.setCenter?.(bounds.getCenter());
    });
    const onFocusOverlay = () => {
        if (overlayRef.current) {
            setFitView([overlayRef.current]);
        }
    };
    const onMapChange = useMemoizedFn((target, onlyChange = false) => {
        let nextValue = null;
        if (type === 'point') {
            const { lat, lng } = target.getPosition();
            nextValue = [lng(), lat()];
        }
        else if (type === 'polygon' || type === 'lineString') {
            nextValue = target
                .getPath()
                .getArray()
                .map((item) => [item.lng(), item.lat()]);
            if (nextValue.length < 2) {
                return;
            }
        }
        else if (type === 'circle') {
            const center = target.getCenter();
            const radius = target.getRadius();
            nextValue = [center.lng(), center.lat(), radius];
        }
        if (!onlyChange) {
            setupOverlay(target);
        }
        onChange?.(nextValue);
    });
    const createDraw = useMemoizedFn((onlyCreate = false, additionalOptions) => {
        const currentOptions = {
            ...commonOptions,
            ...additionalOptions,
            map: map.current,
        };
        drawingManagerRef.current = new google.maps.drawing.DrawingManager({
            drawingMode: drawingMode.current,
            drawingControl: false,
            markerOptions: { ...currentOptions, icon: getIcon(defaultImage) },
            polygonOptions: currentOptions,
            polylineOptions: currentOptions,
            circleOptions: currentOptions,
            map: map.current,
        });
        if (!onlyCreate) {
            drawingManagerRef.current.addListener('overlaycomplete', (event) => {
                const overlay = event.overlay;
                onMapChange(overlay);
            });
        }
        return drawingManagerRef.current;
    });
    const getOverlay = useMemoizedFn((t = type, v = value, o) => {
        const mapping = methodMapping[t];
        if (!mapping) {
            return;
        }
        const options = { ...commonOptions, icon: getIcon(defaultImage), ...o };
        if ('transformOptions' in mapping) {
            Object.assign(options, mapping.transformOptions(v));
        }
        else if ('propertyKey' in mapping) {
            options[mapping.propertyKey] = Array.isArray(v[0])
                ? v.map((item) => {
                    return new google.maps.LatLng(item[1], item[0]);
                })
                : new google.maps.LatLng(v[1], v[0]);
        }
        const overlay = new google.maps[mapping.overlay](options);
        return overlay;
    });
    const setOverlay = useMemoizedFn((t = type, v = value, o) => {
        if (!map.current)
            return;
        const nextOverlay = getOverlay(t, v, {
            ...o,
            map: map.current,
        });
        return nextOverlay;
    });
    // edit mode
    useEffect(() => {
        if (!value && map.current) {
            toRemoveOverlay();
            drawingManagerRef?.current?.setDrawingMode?.(drawingMode.current);
            onChange?.(null);
        }
        if (!map.current)
            return;
        if (!value || (!readonly && overlayRef.current)) {
            return;
        }
        const nextOverlay = setOverlay();
        setupOverlay(nextOverlay);
        // Focus on the overlay
        setFitView([nextOverlay]);
    }, [value, needUpdateFlag, type, disabled, readonly, setOverlay, setFitView, setupOverlay]);
    useEffect(() => {
        if (!accessKey || map.current || !mapContainerRef.current)
            return;
        let loader;
        try {
            loader = new Loader({
                apiKey: accessKey,
                version: 'weekly',
                language: api.auth.getLocale(),
            });
        }
        catch (err) {
            setErrMessage(t('Load google maps failed, Please check the Api key and refresh the page'));
            return;
        }
        // google maps api error
        const error = console.error;
        console.error = (err, ...args) => {
            if (err?.includes?.('InvalidKeyMapError')) {
                setErrMessage(t('Load google maps failed, Please check the Api key and refresh the page'));
            }
            error(err, ...args);
        };
        Promise.all([loader.importLibrary('drawing'), loader.importLibrary('core'), loader.importLibrary('geometry')])
            .then(async (res) => {
            const center = await getCurrentPosition();
            map.current = new google.maps.Map(mapContainerRef.current, {
                zoom,
                center,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: false,
                streetViewControl: false,
                panControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            });
            setErrMessage('');
            forceUpdate([]);
        })
            .catch((err) => {
            if (err instanceof Error) {
                setErrMessage(err.message);
                return;
            }
        });
        return () => {
            map.current?.unbindAll();
            map.current = null;
            drawingManagerRef.current?.unbindAll();
        };
    }, [accessKey, api.auth, type, zoom]);
    useEffect(() => {
        if (!map.current || !type || disabled || drawingManagerRef.current)
            return;
        createDraw();
    }, [createDraw, disabled, needUpdateFlag, type]);
    useImperativeHandle(ref, () => ({
        setOverlay,
        getOverlay,
        setFitView,
        createDraw,
        map: map.current,
        overlay: overlayRef.current,
        drawingManager: drawingManagerRef.current,
        errMessage,
    }));
    const onReset = useMemoizedFn(() => {
        const ok = () => {
            toRemoveOverlay();
            drawingManagerRef.current.setDrawingMode(drawingMode.current);
            onChange?.(null);
        };
        modal.confirm({
            title: t('Clear the canvas'),
            content: t('Are you sure to clear the canvas?'),
            okText: t('Confirm'),
            cancelText: t('Cancel'),
            getContainer: () => mapContainerRef.current,
            onOk() {
                ok();
            },
        });
    });
    const app = useApp();
    if (!accessKey || errMessage) {
        return (React.createElement(Alert, { action: React.createElement(Button, { type: "primary", onClick: () => navigate(app.pluginSettingsManager.getRoutePath('map') + '?tab=google') }, t('Go to the configuration page')), message: errMessage || t('Please configure the Api key first'), type: "error" }));
    }
    return (React.createElement("div", { className: css `
          position: relative;
          height: ${height || 500}px !important;
        ` },
        !map.current && (React.createElement("div", { className: css `
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            ` },
            React.createElement(Spin, null))),
        !disabled ? (React.createElement(React.Fragment, null,
            map.current && React.createElement(Search, { toCenter: toCenter, mapRef: map }),
            React.createElement("div", { className: css `
                position: absolute;
                bottom: 80px;
                right: 20px;
                z-index: 10;
              ` },
                React.createElement(Button, { onClick: onFocusOverlay, disabled: !overlayRef.current, type: "primary", shape: "round", size: "large", icon: React.createElement(SyncOutlined, null) })),
            type === 'lineString' || type === 'polygon' ? (React.createElement("div", { className: css `
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
                    }, onClick: onReset, type: "primary", danger: true }, t('Clear'))))) : null,
        React.createElement("div", { ref: mapContainerRef, className: css `
            width: 100%;
            height: 100%;
          `, style: props?.style })));
});
GoogleMapsComponent.displayName = 'GoogleMapsComponent';
//# sourceMappingURL=Map.js.map