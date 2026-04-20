/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import MockAdapter from 'axios-mock-adapter';
import { Application, type ApplicationOptions } from './Application';
declare class MockApplication extends Application {
  apiMock: MockAdapter;
  constructor(options?: ApplicationOptions);
}
export declare function createMockClient(options?: ApplicationOptions): MockApplication;
export {};
