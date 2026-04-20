export function isPackageValid(pkg: any): boolean;
export function hasCorePackages(): boolean;
export function hasTsNode(): boolean;
export function isDev(): boolean;
export function nodeCheck(): void;
export function run(command: any, args: any, options?: {}): execa.ExecaChildProcess<string>;
export function isPortReachable(port: any, { timeout, host }?: {
    timeout?: number;
    host: any;
}): Promise<boolean>;
export function postCheck(opts: any): Promise<void>;
export function runInstall(): Promise<void>;
export function runAppCommand(command: any, args?: any[]): Promise<void>;
export function promptForTs(): void;
export function downloadPro(): Promise<void>;
export function updateJsonFile(target: any, fn: any): Promise<void>;
export function getVersion(): Promise<any>;
export function generateAppDir(): void;
export function genTsConfigPaths(): {
    compilerOptions: {
        paths: {
            '@@/*': string[];
        };
    };
};
export function initEnv(): void;
export function checkDBDialect(): void;
export function generatePlugins(): void;
export function isProd(): boolean;
import execa = require("execa");
export function generatePlaywrightPath(clean?: boolean): void;
export function buildIndexHtml(force?: boolean): void;
