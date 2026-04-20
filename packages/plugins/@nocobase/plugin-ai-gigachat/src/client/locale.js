// @ts-ignore
import pkg from './../../package.json';
import { useApp } from '@nocobase/client';
export const namespace = pkg.name;
export function useT() {
  const app = useApp();
  return (str) => app.i18n.t(str, { ns: [pkg.name, 'client'] });
}
export function tStr(key) {
  return `{{t(${JSON.stringify(key)}, { ns: ['${pkg.name}', 'client'], nsMode: 'fallback' })}}`;
}
//# sourceMappingURL=locale.js.map
