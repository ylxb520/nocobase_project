/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css, i18n } from '@nocobase/client';
import { evaluators } from '@nocobase/evaluators/client';
import React from 'react';
export function renderExpressionDescription(key) {
    const engine = evaluators.get(key);
    return engine?.link ? (React.createElement(React.Fragment, null,
        React.createElement("span", { className: css `
          &:after {
            content: ':';
          }
          & + a {
            margin-left: 0.25em;
          }
        ` }, i18n.t('Syntax references')),
        React.createElement("a", { href: i18n.t(engine.link), target: "_blank", rel: "noreferrer" }, engine.label))) : null;
}
//# sourceMappingURL=scopes.js.map