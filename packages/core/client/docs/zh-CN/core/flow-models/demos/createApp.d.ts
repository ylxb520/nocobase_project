/// <reference types="react" />
import { Plugin } from '@nocobase/client';
export declare function createApp({ plugins }?: {
    plugins?: Array<typeof Plugin>;
}): import("react").FC<{
    children?: import("react").ReactNode;
}>;
