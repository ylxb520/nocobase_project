/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import minimatch from 'minimatch';
class Snippet {
  name;
  actions;
  constructor(name, actions) {
    this.name = name;
    this.actions = actions;
  }
}
class SnippetManager {
  snippets = new Map();
  register(snippet) {
    snippet.name = snippet.name.replace('.*', '');
    // throw error if name include * or end with dot
    if (snippet.name.includes('*') || snippet.name.endsWith('.')) {
      throw new Error(`Invalid snippet name: ${snippet.name}, name should not include * or end with dot.`);
    }
    const existed = this.snippets.get(snippet.name);
    if (existed) {
      existed.actions = Array.from(new Set([...existed.actions, ...snippet.actions]));
    } else {
      this.snippets.set(snippet.name, snippet);
    }
  }
  allow(actionPath, snippetName) {
    const negated = snippetName.startsWith('!');
    snippetName = negated ? snippetName.slice(1) : snippetName;
    const snippet = this.snippets.get(snippetName);
    if (!snippet) {
      return null;
    }
    const matched = snippet.actions.some((action) => minimatch(actionPath, action));
    if (matched) {
      return negated ? false : true;
    }
    return null;
  }
}
export default SnippetManager;
//# sourceMappingURL=snippet-manager.js.map
