/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export interface FilePreviewerProps {
    file: any;
    index: number;
    list: any[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSwitchIndex?: (index: number) => void;
    onClose?: () => void;
    onDownload: (file: any) => void;
}
export interface FilePreviewType {
    match(file: any): boolean;
    getThumbnailURL?: (file: any) => string | null;
    Previewer?: React.ComponentType<FilePreviewerProps>;
}
export declare class FilePreviewTypes {
    types: FilePreviewType[];
    add(type: FilePreviewType): void;
    getTypeByFile(file: any): Omit<FilePreviewType, 'match'> | undefined;
}
export declare const filePreviewTypes: FilePreviewTypes;
export declare function normalizePreviewFile(file: any): any;
export declare function getPreviewFileUrl(file: any): any;
export declare function getFileUrl(file: any): any;
export declare const getFileExt: (file: any, url?: string) => string;
export declare const getFileName: (file: any, url?: string) => any;
export declare const getFallbackIcon: (file: any, url?: string) => string;
export declare const getPreviewThumbnailUrl: (file: any) => string;
export declare const wrapWithModalPreviewer: (Previewer: React.ComponentType<FilePreviewerProps>) => (props: FilePreviewerProps) => React.JSX.Element;
export declare const FilePreviewRenderer: (props: FilePreviewerProps) => React.JSX.Element;
