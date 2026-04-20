declare const _exports: {
    isPackageValid: (pkg: any) => boolean;
    hasCorePackages: () => boolean;
    hasTsNode: () => boolean;
    isDev: () => boolean;
    isProd: () => boolean;
    nodeCheck: () => void;
    run: (command: any, args: any, options?: {}) => import("execa").ExecaChildProcess<string>;
    isPortReachable: (port: any, { timeout, host }?: {
        timeout?: number;
        host: any;
    }) => Promise<boolean>;
    postCheck: (opts: any) => Promise<void>;
    runInstall: () => Promise<void>;
    runAppCommand: (command: any, args?: any[]) => Promise<void>;
    promptForTs: () => void;
    downloadPro: () => Promise<void>;
    updateJsonFile: (target: any, fn: any) => Promise<void>;
    getVersion: () => Promise<any>;
    generateAppDir: () => void;
    genTsConfigPaths: () => {
        compilerOptions: {
            paths: {
                '@@/*': string[];
            };
        };
    };
    generatePlaywrightPath: typeof util.generatePlaywrightPath;
    buildIndexHtml: typeof util.buildIndexHtml;
    initEnv: () => void;
    checkDBDialect: () => void;
    generatePlugins: () => void;
};
export = _exports;
import util = require("./util");
