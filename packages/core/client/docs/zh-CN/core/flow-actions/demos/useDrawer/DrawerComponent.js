// components/drawer/useDrawer/DrawerComponent.tsx
import { Drawer } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
const DrawerComponent = forwardRef(({ afterClose, ...props }, ref) => {
  const [visible, setVisible] = useState(true);
  const [config, setConfig] = useState(props);
  useImperativeHandle(ref, () => ({
    destroy: () => setVisible(false),
    update: (newConfig) => setConfig((prev) => ({ ...prev, ...newConfig })),
  }));
  return React.createElement(
    Drawer,
    {
      ...config,
      open: visible,
      onClose: (e) => {
        setVisible(false);
        config.onClose?.(e);
      },
      afterOpenChange: (open) => {
        if (!open) {
          afterClose?.();
        }
      },
    },
    config.content,
  );
});
export default DrawerComponent;
//# sourceMappingURL=DrawerComponent.js.map
