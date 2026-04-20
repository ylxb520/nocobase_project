export function getFilterInclude(isServer: any, isCoverage: any): {
    isFile?: undefined;
    include?: undefined;
} | {
    isFile: boolean;
    include: string[];
} | {
    include: string[];
    isFile?: undefined;
};
export function getReportsDirectory(isServer: any): string;
export function defineConfig(): import("vite").UserConfig;
