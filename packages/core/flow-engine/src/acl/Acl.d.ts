import { FlowEngine } from '../flowEngine';
interface CheckOptions {
  dataSourceKey: string;
  resourceName: string;
  actionName: string;
  fields?: string[];
  recordPkValue?: string | number;
  allowedActions: any[];
}
export declare class ACL {
  private flowEngine;
  private data;
  private meta;
  private loaded;
  private loadingPromise;
  private lastToken;
  constructor(flowEngine: FlowEngine);
  setData(data: Record<string, any>): void;
  setMeta(data: Record<string, any>): void;
  load(): Promise<void>;
  getActionAlias(actionName: string): any;
  inResources(resourceName: string, dataSourceName: any): any;
  getResourceActionParams(resourceName: any, actionName: any, dataSourceName: any): any;
  getStrategyActionParams(actionName: string, dataSourceName: any): {};
  getIgnoreScope: (options?: any) => boolean;
  verifyScope: (actionName: string, recordPkValue: any, allowedActions: any) => boolean;
  parseAction(options: CheckOptions): any;
  parseField(options: CheckOptions): boolean;
  aclCheck(options: CheckOptions): Promise<boolean>;
}
export {};
