/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/** 栅格系统常量 */
export declare const DEFAULT_GRID_COLUMNS = 24;
/** 最小 slot 厚度 */
export declare const MIN_SLOT_THICKNESS = 16;
/** 最大 slot 厚度 */
export declare const MAX_SLOT_THICKNESS = 48;
/** 列边缘最小宽度 */
export declare const COLUMN_EDGE_MIN_WIDTH = 12;
/** 列边缘最大宽度 */
export declare const COLUMN_EDGE_MAX_WIDTH = 28;
/** 列边缘宽度占列宽的比例（原来是 1/5） */
export declare const COLUMN_EDGE_WIDTH_RATIO = 0.2;
export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface Point {
  x: number;
  y: number;
}
export interface GridLayoutData {
  rows: Record<string, string[][]>;
  sizes: Record<string, number[]>;
  rowOrder?: string[];
}
export interface ColumnSlot {
  type: 'column';
  rowId: string;
  columnIndex: number;
  insertIndex: number;
  position: 'before' | 'after';
  rect: Rect;
}
export interface ColumnEdgeSlot {
  type: 'column-edge';
  rowId: string;
  columnIndex: number;
  direction: 'left' | 'right';
  rect: Rect;
}
export interface RowGapSlot {
  type: 'row-gap';
  targetRowId: string;
  position: 'above' | 'below';
  rect: Rect;
}
export interface EmptyRowSlot {
  type: 'empty-row';
  rect: Rect;
}
export interface EmptyColumnSlot {
  type: 'empty-column';
  rowId: string;
  columnIndex: number;
  rect: Rect;
}
export type LayoutSlot = ColumnSlot | ColumnEdgeSlot | RowGapSlot | EmptyRowSlot | EmptyColumnSlot;
/**
 * 列内插入的配置
 */
export interface ColumnInsertConfig {
  /** 高亮区域的高度（像素） */
  height?: number;
  /** 垂直偏移（像素），正数向下，负数向上 */
  offsetTop?: number;
}
/**
 * 列边缘的配置
 */
export interface ColumnEdgeConfig {
  /** 高亮区域的宽度（像素） */
  width?: number;
  /** 水平偏移（像素），正数向右，负数向左 */
  offsetLeft?: number;
}
/**
 * 行间隙的配置
 */
export interface RowGapConfig {
  /** 高亮区域的高度（像素） */
  height?: number;
  /** 垂直偏移（像素），正数向下，负数向上 */
  offsetTop?: number;
}
/**
 * 拖拽高亮区域的全局配置
 */
export interface DragOverlayConfig {
  /** 列内插入（before 表示在区块上方插入，after 表示在区块下方插入） */
  columnInsert?: {
    before?: ColumnInsertConfig;
    after?: ColumnInsertConfig;
  };
  /** 列边缘（left 表示在左侧新建列，right 表示在右侧新建列） */
  columnEdge?: {
    left?: ColumnEdgeConfig;
    right?: ColumnEdgeConfig;
  };
  /** 行间隙（above 表示在行上方插入，below 表示在行下方插入） */
  rowGap?: {
    above?: RowGapConfig;
    below?: RowGapConfig;
  };
}
export interface LayoutSnapshot {
  slots: LayoutSlot[];
  containerRect: Rect;
}
export interface BuildLayoutSnapshotOptions {
  container: HTMLElement | null;
}
export declare const buildLayoutSnapshot: ({ container }: BuildLayoutSnapshotOptions) => LayoutSnapshot;
export declare const getSlotKey: (slot: LayoutSlot) => string;
export declare const resolveDropIntent: (point: Point, slots: LayoutSlot[]) => LayoutSlot | null;
export interface SimulateLayoutOptions {
  slot: LayoutSlot;
  sourceUid: string;
  layout: GridLayoutData;
  generateRowId?: () => string;
}
export declare const simulateLayoutForSlot: ({
  slot,
  sourceUid,
  layout,
  generateRowId,
}: SimulateLayoutOptions) => GridLayoutData;
