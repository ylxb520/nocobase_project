/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { cx } from '@emotion/css';
import React, { useEffect, useRef, useState } from 'react';
import { getYmd } from '../../helpers/other-helper';
import { Bar } from './bar/bar';
import { BarSmall } from './bar/bar-small';
import { Milestone } from './milestone/milestone';
import { Project } from './project/project';
import useStyles from './style';
export const TaskItem = (props) => {
    const { styles } = useStyles();
    const { task, arrowIndent, isDelete, taskHeight, isSelected, rtl, onEventStart } = {
        ...props,
    };
    const textRef = useRef(null);
    const [taskItem, setTaskItem] = useState(React.createElement("div", null));
    const [isTextInside, setIsTextInside] = useState(true);
    const isProjectBar = task.typeInternal === 'project';
    useEffect(() => {
        switch (task.typeInternal) {
            case 'milestone':
                setTaskItem(React.createElement(Milestone, { ...props }));
                break;
            case 'project':
                setTaskItem(React.createElement(Project, { ...props }));
                break;
            case 'smalltask':
                setTaskItem(React.createElement(BarSmall, { ...props }));
                break;
            default:
                setTaskItem(React.createElement(Bar, { ...props }));
                break;
        }
    }, [task, isSelected]);
    useEffect(() => {
        if (textRef.current) {
            setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
        }
    }, [textRef, task]);
    const getX = () => {
        const width = task.x2 - task.x1;
        const hasChild = task.barChildren.length > 0;
        if (isTextInside) {
            return task.x1 + width * 0.5;
        }
        if (rtl && textRef.current) {
            return task.x1 - textRef.current.getBBox().width - arrowIndent * +hasChild - arrowIndent * 0.2;
        }
        else {
            return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
        }
    };
    return (React.createElement("g", { className: cx(styles.nbganttTaskitem), onKeyDown: (e) => {
            switch (e.key) {
                case 'Delete': {
                    if (isDelete)
                        onEventStart('delete', task, e);
                    break;
                }
            }
            e.stopPropagation();
        }, onMouseEnter: (e) => {
            onEventStart('mouseenter', task, e);
        }, onMouseLeave: (e) => {
            onEventStart('mouseleave', task, e);
        }, onDoubleClick: (e) => {
            onEventStart('dblclick', task, e);
        }, onClick: (e) => {
            onEventStart('click', task, e);
        }, onFocus: () => {
            onEventStart('select', task);
        } },
        taskItem,
        React.createElement("text", { x: isProjectBar ? task.x1 : getX(), y: isProjectBar ? task.y - 8 : isTextInside ? task.y + taskHeight * 0.65 : task.y + taskHeight * 0.65, className: isProjectBar ? cx('projectLabel') : isTextInside ? cx('barLabel') : cx('barLabelOutside'), ref: textRef }, isProjectBar && getYmd(task.start) && getYmd(task.end)
            ? `${task.name}:  ${getYmd(task.start)} ~ ${getYmd(task.end)}`
            : task.name)));
};
//# sourceMappingURL=task-item.js.map