/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Modal } from 'antd';
import React from 'react';
interface DialogComponentProps extends React.ComponentProps<typeof Modal> {
    afterClose?: () => void;
    content?: React.ReactNode;
    footer?: React.ReactNode;
    header?: {
        title?: React.ReactNode;
        extra?: React.ReactNode;
    };
    hidden?: boolean;
}
declare const DialogComponent: React.ForwardRefExoticComponent<DialogComponentProps & React.RefAttributes<unknown>>;
export default DialogComponent;
