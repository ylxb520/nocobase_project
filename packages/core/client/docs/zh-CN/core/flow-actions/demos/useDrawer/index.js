import * as React from 'react';
import DrawerComponent from './DrawerComponent';
import usePatchElement from './usePatchElement';
let uuid = 0;
function useDrawer() {
  const holderRef = React.useRef(null);
  const open = (config) => {
    uuid += 1;
    const drawerRef = React.createRef();
    // eslint-disable-next-line prefer-const
    let closeFunc;
    const drawer = React.createElement(DrawerComponent, {
      key: `drawer-${uuid}`,
      ref: drawerRef,
      ...config,
      afterClose: () => {
        closeFunc?.();
        config.onClose?.();
      },
    });
    closeFunc = holderRef.current?.patchElement(drawer);
    return {
      destroy: () => drawerRef.current?.destroy(),
      update: (newConfig) => drawerRef.current?.update(newConfig),
    };
  };
  const api = React.useMemo(() => ({ open }), []);
  const ElementsHolder = React.memo(
    React.forwardRef((props, ref) => {
      const [elements, patchElement] = usePatchElement();
      React.useImperativeHandle(ref, () => ({ patchElement }), []);
      return React.createElement(React.Fragment, null, elements);
    }),
  );
  return [api, React.createElement(ElementsHolder, { key: 'drawer-holder', ref: holderRef })];
}
export default useDrawer;
//# sourceMappingURL=index.js.map
