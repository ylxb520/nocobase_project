export class AppGenerator extends Generator {
  constructor(options: any);
  context: any;
  env: {};
  parseEnvs(): {};
  checkProjectPath(): void;
  getContext(): any;
  downloadServerPackage(): Promise<void>;
  downloadClientPackage(): Promise<void>;
}
import { Generator } from '@umijs/utils';
