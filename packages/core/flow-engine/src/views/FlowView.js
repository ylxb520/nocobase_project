/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
let zIndex = 0;
export class FlowViewer {
  ctx;
  types;
  zIndex;
  constructor(ctx, types) {
    this.ctx = ctx;
    this.types = types;
    this.zIndex = zIndex + (ctx.themeToken?.zIndexPopupBase || 1000);
  }
  getNextZIndex() {
    return this.zIndex + 1;
  }
  open(props) {
    const { type, ...others } = props;
    if (this.types[type]) {
      zIndex += 1;
      const onClose = others.onClose;
      const _zIndex = others.zIndex;
      others.onClose = (...args) => {
        onClose?.(...args);
        zIndex -= 1;
      };
      // embed 不能设置过高的 zIndex，会遮挡菜单的折叠按钮图表
      if (type !== 'embed') {
        others.zIndex = _zIndex ?? this.getNextZIndex();
      }
      return this.types[type].open(others, this.ctx);
    } else {
      throw new Error(`Unknown view type: ${type}`);
    }
  }
  dialog(props) {
    return this.open({ type: 'dialog', ...props });
  }
  drawer(props) {
    return this.open({ type: 'drawer', ...props });
  }
  popover(props) {
    return this.open({ type: 'popover', ...props });
  }
  embed(props) {
    return this.open({ type: 'embed', ...props });
  }
}
//# sourceMappingURL=FlowView.js.map
