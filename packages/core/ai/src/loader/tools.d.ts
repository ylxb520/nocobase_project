/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ToolsOptions } from '../tools-manager';
import { DirectoryScanner, DirectoryScannerOptions, FileDescriptor } from './scanner';
import { AIManager } from '../ai-manager';
import { LoadAndRegister } from './types';
import { Logger } from '@nocobase/logger';
export type ToolsLoaderOptions = {
  scan: DirectoryScannerOptions;
  log?: Logger;
};
export declare class ToolsLoader extends LoadAndRegister<ToolsLoaderOptions> {
  protected readonly ai: AIManager;
  protected readonly options: ToolsLoaderOptions;
  protected readonly scanner: DirectoryScanner;
  protected files: FileDescriptor[];
  protected toolsDescriptors: ToolsDescriptor[];
  protected log: Logger;
  constructor(ai: AIManager, options: ToolsLoaderOptions);
  protected scan(): Promise<void>;
  protected import(): Promise<void>;
  protected register(): Promise<void>;
}
export type ToolsDescriptor = {
  name: string;
  tsFile?: FileDescriptor;
  descFile?: FileDescriptor;
  toolsOptions?: ToolsOptions;
  description?: string;
};
