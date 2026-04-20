import { useApp } from './useApp';
export function usePlugin(name) {
  const app = useApp();
  return app.pm.get(name);
}
//# sourceMappingURL=usePlugin.js.map
