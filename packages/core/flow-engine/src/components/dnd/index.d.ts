/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { DndContextProps } from '@dnd-kit/core';
import React, { FC } from 'react';
import { FlowModel } from '../../models';
import { PersistOptions } from '../../types';
export * from './findModelUidPosition';
export * from './gridDragPlanner';
export declare const EMPTY_COLUMN_UID = 'EMPTY_COLUMN';
export declare const DragHandler: FC<{
  model: FlowModel;
  children: React.ReactNode;
}>;
export declare const Droppable: FC<{
  model: FlowModel<any>;
  children: React.ReactNode;
}>;
export declare const DndProvider: FC<DndContextProps & PersistOptions>;
