/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useState, useContext } from 'react';
import { Input, Menu, Popover, Button } from 'antd';
import { css } from '@emotion/css';
import { MenuOutlined } from '@ant-design/icons';
import { useCompile } from '@nocobase/client';
import { getPopupContainer, useGCMTranslation } from '../utils';
import { CollapsedContext } from '../GraphDrawPage';
export const LocateCollectionAction = (props) => {
    const { handleFiterCollections } = props;
    const { handleSearchCollection, collectionList } = useContext(CollapsedContext);
    const [selectedKeys, setSelectKey] = useState([]);
    const { t } = useGCMTranslation();
    const compile = useCompile();
    const content = (React.createElement("div", null,
        React.createElement(Input, { style: { margin: '4px 0' }, bordered: false, placeholder: t('Collection Search'), onChange: handleSearchCollection }),
        React.createElement(Menu, { selectedKeys: selectedKeys, selectable: true, className: css `
          .ant-menu-item {
            height: 32px;
            line-height: 32px;
          }
        `, style: { maxHeight: '70vh', overflowY: 'auto', border: 'none' }, items: [
                { type: 'divider' },
                ...collectionList.map((v) => {
                    return {
                        key: v.name,
                        label: compile(v.title),
                        onClick: (e) => {
                            if (e.key !== selectedKeys[0]) {
                                setSelectKey([e.key]);
                                handleFiterCollections(e.key);
                            }
                            else {
                                handleFiterCollections(false);
                                setSelectKey([]);
                            }
                        },
                    };
                }),
            ] })));
    return (React.createElement(Popover, { content: content, autoAdjustOverflow: true, placement: "bottomRight", trigger: ['click'], getPopupContainer: getPopupContainer, overlayClassName: css `
        .ant-popover-inner-content {
          padding: 0;
        }
      ` },
        React.createElement(Button, null,
            React.createElement(MenuOutlined, null))));
};
//# sourceMappingURL=LocateCollectionAction.js.map