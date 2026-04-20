/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export const getAutoDeletePluginsWarning = (plugins) => {
    return `The following plugins have been automatically removed from the database as they no longer exist and are not enabled: ${plugins.join(',')}. You can reinstall it using the plugin package at any time.`;
};
export const getNotExistsEnabledPluginsError = (plugins, app) => {
    const pluginNames = Array.from(plugins.keys()).map((name) => plugins.get(name) || name);
    const appOption = app === 'main' ? '' : ` --app ${app}`;
    const removeCmds = `yarn pm remove ${Array.from(plugins.keys()).join(' ')} --force${appOption}`;
    const enErrMsg = `
The following plugins you are currently using will become commercial plugins after the upgrade:
${pluginNames.join(', ')}

💎 If you are interested in purchasing, please visit: https://www.nocobase.com/commercial.html for more detail.

If you decide not to use them anymore, please delete them from the "applicationPlugins" table. You can use the command:
${removeCmds}
`;
    const cnErrMsg = `
以下您正在使用的插件在升级后将变为商业插件:
${pluginNames.join(', ')}

💎 如果您有购买意向，请访问: https://www.nocobase.com/commercial.html 了解详情。

如果您决定不再使用它们，请将这些插件记录从 "applicationPlugins" 表中删除。你可以使用命令：
${removeCmds}
`;
    return {
        'en-US': enErrMsg,
        'zh-CN': cnErrMsg,
    };
};
//# sourceMappingURL=wording.js.map