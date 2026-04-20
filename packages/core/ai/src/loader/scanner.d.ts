/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export type DirectoryScannerOptions = {
  basePath: string;
  pattern: string[];
};
export declare class DirectoryScanner {
  private readonly options;
  protected readonly files: FileDescriptor[];
  constructor(options: DirectoryScannerOptions);
  scan(): Promise<FileDescriptor[]>;
}
export declare class FileDescriptor {
  private readonly filePath;
  constructor(filePath: string);
  get name(): string;
  get directory(): string;
  get path(): string;
  get extname(): string;
  get basename(): string;
}
