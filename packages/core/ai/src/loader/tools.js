/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { importModule } from '@nocobase/utils';
import { DirectoryScanner } from './scanner';
import { readFile } from 'fs/promises';
import _ from 'lodash';
import { existsSync } from 'fs';
import { LoadAndRegister } from './types';
import { isNonEmptyObject } from './utils';
export class ToolsLoader extends LoadAndRegister {
  ai;
  options;
  scanner;
  files = [];
  toolsDescriptors = [];
  log;
  constructor(ai, options) {
    super(ai, options);
    this.ai = ai;
    this.options = options;
    this.log = options.log;
    this.scanner = new DirectoryScanner(this.options.scan);
  }
  async scan() {
    this.files = await this.scanner.scan();
  }
  async import() {
    if (!this.files.length) {
      return;
    }
    const grouped = new Map();
    for (const fd of this.files) {
      const key =
        fd.basename === 'index.ts' || fd.basename === 'index.js' || fd.basename === 'description.md'
          ? fd.directory
          : fd.name;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(fd);
    }
    this.toolsDescriptors = (
      await Promise.all(
        Array.from(grouped.entries()).map(async ([name, fds]) => {
          const tsFile = fds.find((fd) => fd.extname === '.ts' || fd.extname === '.js');
          const descFile = fds.find((fd) => fd.basename === 'description.md');
          const entry = { name, tsFile, descFile };
          if (!tsFile || !existsSync(tsFile.path)) {
            this.log?.error(`tools [${name}] ignored: can not find .ts file`);
            return null;
          }
          try {
            const module = await importModule(tsFile.path);
            if (isNonEmptyObject(module)) {
              entry.toolsOptions = typeof module === 'function' ? module() : module;
            } else {
              entry.toolsOptions = undefined;
            }
          } catch (e) {
            this.log?.error(`tools [${name}] load fail: error occur when import ${tsFile.path}`, e);
            return null;
          }
          if (descFile && existsSync(descFile.path)) {
            try {
              entry.description = await readFile(descFile.path, 'utf-8');
            } catch (e) {
              this.log?.error(
                `tools [${name}] load fail: error occur when reading description.md at ${descFile.path}`,
                e,
              );
              return null;
            }
          }
          return entry;
        }),
      )
    ).filter((t) => t != null);
  }
  async register() {
    if (!this.toolsDescriptors.length) {
      return;
    }
    const { toolsManager } = this.ai;
    for (const descriptor of this.toolsDescriptors) {
      if (!descriptor.toolsOptions) {
        this.log?.warn(
          `tools [${descriptor.name}] register ignored: ToolsOptions not export as default at ${descriptor.tsFile.path}`,
        );
        continue;
      }
      const { name, toolsOptions, description } = descriptor;
      if (await toolsManager.getTools(name)) {
        this.log?.warn(`tools [${descriptor.name}] register ignored: duplicate register for tools`);
        continue;
      }
      if (toolsOptions.definition) {
        toolsOptions.definition.name = name;
        if (!_.isEmpty(description)) {
          toolsOptions.definition.description = description;
        }
      }
      try {
        toolsManager.registerTools(toolsOptions);
      } catch (e) {
        this.log?.error(`tools [${descriptor.name}] register ignored: error occur when invoke registerTools`, e);
        continue;
      }
    }
  }
}
//# sourceMappingURL=tools.js.map
