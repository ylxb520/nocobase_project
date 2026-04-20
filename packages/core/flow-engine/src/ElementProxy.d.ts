/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
export declare class ElementProxy {
  private __el;
  constructor(element: any);
  get innerHTML(): string;
  set innerHTML(value: string);
  get outerHTML(): string;
  set outerHTML(value: string);
  appendChild(child: any): void;
}
