/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ACL, UserProvider } from '@nocobase/acl';
import { Context, Next } from '@nocobase/actions';
import { Collection } from '@nocobase/database';
export type SanitizeAssociationValuesOptions = {
  acl?: ACL;
  resourceName: string;
  actionName: string;
  values: any;
  updateAssociationValues?: string[];
  protectedKeys?: string[];
  aclParams?: any;
  roles?: string[];
  currentRole?: string;
  currentUser?: any;
  collection?: Collection;
  db?: any;
  database?: any;
  timezone?: string;
  userProvider?: UserProvider;
};
export declare function sanitizeAssociationValues(options: SanitizeAssociationValuesOptions): Promise<any>;
export declare const checkChangesWithAssociation: (ctx: Context, next: Next) => Promise<any>;
