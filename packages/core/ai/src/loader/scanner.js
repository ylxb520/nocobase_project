/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import fg from 'fast-glob';
import path from 'path';
export class DirectoryScanner {
  options;
  files = [];
  constructor(options) {
    this.options = options;
  }
  async scan() {
    const { basePath, pattern } = this.options;
    const filePaths = await fg(pattern, {
      cwd: basePath,
      absolute: true,
      onlyFiles: true,
      dot: false,
      followSymbolicLinks: false,
    });
    return filePaths.map((f) => new FileDescriptor(f));
  }
}
export class FileDescriptor {
  filePath;
  constructor(filePath) {
    this.filePath = filePath;
  }
  get name() {
    return path.parse(this.filePath).name;
  }
  get directory() {
    return path.basename(path.dirname(this.filePath));
  }
  get path() {
    return this.filePath;
  }
  get extname() {
    return path.extname(this.filePath);
  }
  get basename() {
    return path.basename(this.filePath);
  }
}
//# sourceMappingURL=scanner.js.map
