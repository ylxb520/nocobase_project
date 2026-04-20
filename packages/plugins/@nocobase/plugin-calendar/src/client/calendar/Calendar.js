/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useField, useFieldSchema } from '@formily/react';
import { ActionContextProvider, CollectionProvider, NocoBaseRecursionField, PopupContextProvider, RecordProvider, SchemaComponentOptions, getLabelFormatValue, handleDateChangeOnForm, useACLRoleContext, useActionContext, useApp, useCollection, useCollectionParentRecordData, useDesignable, useFormBlockContext, useLazy, usePopupUtils, useProps, withDynamicSchemaProps, withSkeletonComponent, useAPIClient, } from '@nocobase/client';
import dayjs from 'dayjs';
import { cloneDeep, get, omit } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { i18nt, useTranslation } from '../../locale';
import { CalendarRecordViewer, findEventSchema } from './CalendarRecordViewer';
import Header from './components/Header';
import { CalendarToolbarContext } from './context';
import GlobalStyle from './global.style';
import { useCalenderHeight } from './hook';
import { addNew } from './schema';
import useStyle from './style';
import { formatDate } from './utils';
import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import zhCN from 'date-fns/locale/zh-CN';
import ru from 'date-fns/locale/ru';
const Weeks = ['month', 'week', 'day'];
export const DeleteEventContext = React.createContext({
    close: () => { },
    allowDeleteEvent: false,
});
function Toolbar(props) {
    const fieldSchema = useFieldSchema();
    const toolBarSchema = useMemo(() => fieldSchema.reduceProperties((buf, current) => {
        if (current['x-component'].endsWith('.ActionBar')) {
            return current;
        }
        return buf;
    }, null), []);
    return (React.createElement(CalendarToolbarContext.Provider, { value: props },
        React.createElement(NocoBaseRecursionField, { name: toolBarSchema.name, schema: toolBarSchema })));
}
const useEvents = (dataSource, fieldNames, date, view = 'month') => {
    const parseExpression = useLazy(() => import('cron-parser'), 'parseExpression');
    const { t } = useTranslation();
    const { fields } = useCollection();
    const app = useApp();
    const plugin = app.pm.get('calendar');
    const labelUiSchema = fields.find((v) => v.name === fieldNames?.title)?.uiSchema;
    const enumUiSchema = fields.find((v) => v.name === fieldNames?.colorFieldName);
    return useMemo(() => {
        if (!Array.isArray(dataSource))
            return { events: [], enumList: [] };
        const enumList = enumUiSchema?.uiSchema?.enum || [];
        const events = [];
        dataSource.forEach((item) => {
            const { cron, exclude = [] } = item;
            const start = dayjs(get(item, fieldNames.start) || dayjs());
            const end = dayjs(get(item, fieldNames.end) || start);
            const intervalTime = end.diff(start, 'millisecond', true);
            const dateM = dayjs(date);
            const startDate = dateM.clone().startOf(view);
            const endDate = startDate.clone().endOf(view);
            /**
             * view === month 时，会显示当月日程
             * 但这个日历一般情况下需要展示 6w * 7d 的日程，总共 42 天
             * 假设 10.1 号是星期六，我们需要将日程的开始时间调整为这一周的星期一，也就是 9.25 号
             * 而结束时间需要调整为 10.31 号这一周的星期日，也就是 10.5 号
             */
            // if (view === 'month') {
            //   startDate = startDate.startOf('week');
            //   endDate = endDate.endOf('week');
            // }
            const push = (eventStart = start.clone()) => {
                // 必须在这个月的开始时间和结束时间，且在日程的开始时间之后
                if (eventStart.isBefore(start) || // 开始时间早于 start
                    (!eventStart.isBetween(startDate, endDate, null, '[]') && !end.isBetween(startDate, endDate)) // 开始时间和结束时间不在月份范围内
                ) {
                    return;
                }
                let out = false;
                const res = exclude?.some((d) => {
                    if (d.endsWith('_after')) {
                        d = d.replace(/_after$/, '');
                        out = true;
                        return eventStart.isSameOrAfter(d);
                    }
                    else {
                        return eventStart.isSame(d);
                    }
                });
                if (res)
                    return out;
                const targetTitleCollectionField = fields.find((v) => v.name === fieldNames.title);
                const targetTitle = plugin.getTitleFieldInterface(targetTitleCollectionField.interface);
                const title = getLabelFormatValue(labelUiSchema, get(item, fieldNames.title), true, targetTitleCollectionField, targetTitle?.TitleRenderer);
                const event = {
                    id: get(item, fieldNames.id || 'id'),
                    colorFieldValue: item[fieldNames.colorFieldName],
                    title: title || t('Untitle'),
                    start: eventStart.toDate(),
                    end: eventStart.add(intervalTime, 'millisecond').toDate(),
                    rawTitle: get(item, fieldNames.title),
                };
                events.push(event);
            };
            if (cron === 'every_week') {
                let nextStart = start
                    .clone()
                    .year(startDate.year())
                    .month(startDate.month())
                    .date(startDate.date())
                    .day(start.day());
                while (nextStart.isBefore(endDate)) {
                    if (push(nextStart.clone())) {
                        break;
                    }
                    nextStart = nextStart.add(1, 'week');
                }
            }
            else if (cron === 'every_month') {
                push(start.clone().year(dateM.year()).month(dateM.month()));
            }
            else if (cron === 'every_year') {
                push(start.clone().year(dateM.year()));
            }
            else {
                push();
                if (!cron)
                    return;
                try {
                    const interval = parseExpression(cron, {
                        startDate: startDate.toDate(),
                        endDate: endDate.toDate(),
                        iterator: true,
                        currentDate: start.toDate(),
                        utc: true,
                    });
                    while (interval.hasNext()) {
                        const { value } = interval.next();
                        if (push(dayjs(value.toDate())))
                            break;
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
        return { events, enumList };
    }, [
        labelUiSchema,
        dataSource,
        fieldNames.colorFieldName,
        fieldNames.start,
        fieldNames.end,
        fieldNames.id,
        fieldNames.title,
        date,
        view,
        t,
        enumUiSchema?.uiSchema?.enum,
        parseExpression,
    ]);
};
const useInsertSchema = (component) => {
    const fieldSchema = useFieldSchema();
    const { insertAfterBegin } = useDesignable();
    const insert = useCallback((ss) => {
        const schema = fieldSchema.reduceProperties((buf, s) => {
            if (s['x-component'] === 'AssociationField.' + component) {
                return s;
            }
            return buf;
        }, null);
        if (!schema) {
            insertAfterBegin(cloneDeep(ss));
        }
    }, [component, fieldSchema, insertAfterBegin]);
    return insert;
};
export const Calendar = withDynamicSchemaProps(withSkeletonComponent((props) => {
    const [visible, setVisible] = useState(false);
    const { openPopup } = usePopupUtils({
        setVisible,
    });
    const reactBigCalendar = useLazy(() => import('react-big-calendar'), (module) => ({
        BigCalendar: module.Calendar,
        dayjsLocalizer: module.dayjsLocalizer,
    }));
    const eq = useLazy(() => import('react-big-calendar/lib/utils/dates'), 'eq');
    // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
    const { dataSource, fieldNames, showLunar, getFontColor, getBackgroundColor, enableQuickCreateEvent } = useProps(props);
    const height = useCalenderHeight();
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(props.defaultView || 'month');
    const { events, enumList } = useEvents(dataSource, fieldNames, date, view);
    const [record, setRecord] = useState({});
    const { wrapSSR, hashId, componentCls: containerClassName } = useStyle();
    const parentRecordData = useCollectionParentRecordData();
    const fieldSchema = useFieldSchema();
    const field = useField();
    //nint deal with slot select to show create popup
    const { parseAction } = useACLRoleContext();
    const collection = useCollection();
    const canCreate = parseAction(`${collection.name}:create`);
    const startFieldName = fieldNames?.start?.[0];
    const endFieldName = fieldNames?.end?.[0];
    const insertAddNewer = useInsertSchema('AddNewer');
    const ctx = useActionContext();
    const [visibleAddNewer, setVisibleAddNewer] = useState(false);
    const [currentSelectDate, setCurrentSelectDate] = useState(undefined);
    const apiClient = useAPIClient();
    const locales = {
        'zh-CN': zhCN,
        'en-US': enUS,
        'ru-RU': ru,
    };
    const locale = apiClient.auth.locale || 'en-US';
    const formats = useMemo(() => {
        return {
            monthHeaderFormat: (date, culture, local) => local.format(date, culture === 'zh-CN' ? 'yyyy年M月' : culture === 'ru-RU' ? 'LLLL yyyy' : 'MMM yyyy', culture),
            // dayHeaderFormat: (date, culture, local) => {
            //   return local.format(date, culture === 'zh-CN' ? 'eee, M/d' : culture === 'ru-RU' ? 'EEE, d MMM' : 'EEE, MMM d', culture);
            // },
            agendaDateFormat: (date, culture, local) => {
                // return local.format(date, culture === 'zh-CN' ? 'M月d日' : culture === 'ru-RU' ? 'd MMM' : 'M-dd', culture);
                return local.format(date, culture === 'zh-CN' ? 'yyyy年M月' : culture === 'ru-RU' ? 'LLLL yyyy' : 'MMM yyyy', culture);
            },
            dayHeaderFormat: (date, culture, local) => {
                return local.format(date, culture === 'zh-CN' ? 'eee, M/d' : culture === 'ru-RU' ? 'EEE, d MMM' : 'EEE, MMM d', culture);
            },
            // agendaDateFormat: (date, culture, local) => {
            //   return local.format(date, culture === 'zh-CN' ? 'M月d日' : culture === 'ru-RU' ? 'd MMM' : 'M-dd', culture);
            // },
            dayRangeHeaderFormat: ({ start, end }, culture, local) => {
                if (start.getMonth() === end.getMonth()) {
                    return local.format(start, culture === 'zh-CN' ? 'yyyy年M月' : culture === 'ru-RU' ? 'LLLL yyyy' : 'MMM yyyy', culture);
                }
                return `${local.format(start, culture === 'zh-CN' ? 'yyyy年M月' : culture === 'ru-RU' ? 'LLLL yyyy' : 'MMM yyyy', culture)} - ${local.format(end, culture === 'zh-CN' ? 'yyyy年M月' : culture === 'ru-RU' ? 'LLLL yyyy' : 'MMM yyyy', culture)}`;
            },
            weekdayFormat: (date, culture, local) => {
                return local.format(date, 'EEE', culture);
            },
        };
    }, [locale, view]);
    const localizer = useMemo(() => {
        return dateFnsLocalizer({
            format,
            parse,
            startOfWeek: (date) => startOfWeek(date, { locale: locales[locale], weekStartsOn: props.weekStart ?? 1 }),
            getDay,
            locales,
        });
    }, [locale, props.weekStart]);
    useEffect(() => {
        setView(props.defaultView);
    }, [props.defaultView]);
    const components = useMemo(() => {
        return {
            toolbar: (props) => React.createElement(Toolbar, { ...props, showLunar: showLunar }),
            week: {
                header: (props) => (React.createElement(Header, { ...props, type: "week", showLunar: showLunar, localizer: localizer, locale: locale })),
            },
            month: {
                dateHeader: (props) => React.createElement(Header, { ...props, showLunar: showLunar }),
            },
        };
    }, [showLunar]);
    const messages = {
        allDay: '',
        previous: (React.createElement("div", null,
            React.createElement(LeftOutlined, null))),
        next: (React.createElement("div", null,
            React.createElement(RightOutlined, null))),
        today: i18nt('Today'),
        month: i18nt('Month'),
        week: i18nt('Week'),
        work_week: i18nt('Work week'),
        day: i18nt('Day'),
        agenda: i18nt('Agenda'),
        date: i18nt('Date'),
        time: i18nt('Time'),
        event: i18nt('Event'),
        noEventsInRange: i18nt('None'),
        showMore: (count) => i18nt('{{count}} more items', { count }),
    };
    const eventPropGetter = (event) => {
        if (event.colorFieldValue) {
            const fontColor = getFontColor?.(event.colorFieldValue);
            const backgroundColor = getBackgroundColor?.(event.colorFieldValue);
            const style = {};
            if (fontColor) {
                style['color'] = fontColor;
            }
            if (backgroundColor) {
                style['backgroundColor'] = backgroundColor;
            }
            return {
                style,
            };
        }
    };
    // 快速创建行程
    const useCreateFormBlockProps = () => {
        const ctx = useFormBlockContext();
        let startDateValue = currentSelectDate.start;
        let endDataValue = currentSelectDate.end;
        const startCollectionField = collection.getField(startFieldName);
        const endCollectionField = collection.getField(endFieldName);
        useEffect(() => {
            const form = ctx.form;
            if (!form || ctx.service?.loading) {
                return;
            }
            if (currentSelectDate) {
                const startFieldProps = {
                    ...startCollectionField?.uiSchema?.['x-component-props'],
                    ...ctx.form?.query(startFieldName).take()?.componentProps,
                };
                const endFieldProps = {
                    ...endCollectionField?.uiSchema?.['x-component-props'],
                    ...ctx.form?.query(endFieldName).take()?.componentProps,
                };
                startDateValue = handleDateChangeOnForm(currentSelectDate.start, startFieldProps.dateOnly, startFieldProps.utc, startFieldProps.picker, startFieldProps.showTime, startFieldProps.gtm);
                endDataValue = handleDateChangeOnForm(currentSelectDate.end, endFieldProps.dateOnly, endFieldProps.utc, endFieldProps.picker, endFieldProps.showTime, endFieldProps.gtm);
                if (!form.initialValues[startFieldName]) {
                    form.setInitialValuesIn([startFieldName], startDateValue);
                }
                if (!form.initialValues[endFieldName]) {
                    form.setInitialValuesIn([endFieldName], endDataValue);
                }
            }
        }, [ctx.form, ctx.service?.data?.data, ctx.service?.loading]);
        return {
            form: ctx.form,
        };
    };
    const BigCalendar = reactBigCalendar?.BigCalendar;
    return wrapSSR(React.createElement("div", { className: `${hashId} ${containerClassName}`, style: { height: height || 700 } },
        React.createElement(PopupContextProvider, { visible: visible, setVisible: setVisible },
            React.createElement(GlobalStyle, null),
            React.createElement(RecordProvider, { record: record, parent: parentRecordData },
                React.createElement(CalendarRecordViewer, null)),
            React.createElement(BigCalendar, { popup: true, selectable: true, events: events, eventPropGetter: eventPropGetter, view: view, views: Weeks, date: date, step: 60, showMultiDayTimes: true, messages: messages, onNavigate: setDate, onView: setView, onSelectSlot: (slotInfo) => {
                    setCurrentSelectDate(slotInfo);
                    if (canCreate && enableQuickCreateEvent) {
                        insertAddNewer(addNew);
                        setVisibleAddNewer(true);
                    }
                }, onDoubleClickEvent: () => {
                    console.log('onDoubleClickEvent');
                }, onSelectEvent: (event) => {
                    const record = dataSource?.find((item) => item[fieldNames.id] === event.id);
                    if (!record) {
                        return;
                    }
                    record.__event = {
                        ...omit(event, 'title'),
                        start: formatDate(dayjs(event.start)),
                        end: formatDate(dayjs(event.end)),
                    };
                    setRecord(record);
                    openPopup({
                        recordData: record,
                        customActionSchema: findEventSchema(fieldSchema),
                    });
                }, formats: formats, 
                // formats={{
                //   monthHeaderFormat: 'yyyy-M',
                //   agendaDateFormat: 'M-dd',
                //   dayHeaderFormat: 'yyyy-M-dd',
                //   dayRangeHeaderFormat: ({ start, end }, culture, local) => {
                //     if (eq(start, end, 'month')) {
                //       return local.format(start, 'yyyy-M', culture);
                //     }
                //     return `${local.format(start, 'yyyy-M', culture)} - ${local.format(end, 'yyyy-M', culture)}`;
                //   },
                // }}
                components: components, culture: locale, localizer: localizer, tooltipAccessor: (val) => {
                    return val.rawTitle ? val.rawTitle : '';
                } })),
        React.createElement(ActionContextProvider, { value: {
                ...ctx,
                visible: visibleAddNewer,
                setVisible: setVisibleAddNewer,
                openMode: findEventSchema(fieldSchema)?.['x-component-props']?.['openMode'],
            } },
            React.createElement(CollectionProvider, { name: collection.name },
                React.createElement(SchemaComponentOptions, { scope: { useCreateFormBlockProps } },
                    React.createElement(NocoBaseRecursionField, { onlyRenderProperties: true, basePath: field?.address, schema: fieldSchema, filterProperties: (s) => {
                            return s['x-component'] === 'AssociationField.AddNewer';
                        } }))))));
}, { displayName: 'Calendar' }));
//# sourceMappingURL=Calendar.js.map