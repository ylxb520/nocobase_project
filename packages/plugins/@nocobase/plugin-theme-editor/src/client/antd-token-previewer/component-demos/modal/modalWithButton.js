/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
const Demo = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { type: "primary", onClick: showModal }, "Open Modal"),
        React.createElement(Modal, { title: "Basic Modal", open: isModalVisible, onOk: handleOk, onCancel: handleCancel },
            React.createElement("p", null, "Some contents..."),
            " ",
            React.createElement("p", null, "Some contents..."),
            " ",
            React.createElement("p", null, "Some contents..."))));
};
const componentDemo = {
    demo: React.createElement(Demo, null),
    tokens: ['colorBgMask'],
    key: 'modalWithButton',
};
export default componentDemo;
//# sourceMappingURL=modalWithButton.js.map