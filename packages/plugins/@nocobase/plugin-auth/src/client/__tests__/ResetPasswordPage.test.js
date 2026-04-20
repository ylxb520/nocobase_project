/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAuthenticator } from '../authenticator';
import { useSearchParams } from 'react-router-dom';
import { useAPIClient } from '@nocobase/client';
// 模拟认证组件和路由组件
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(() => [
    {
      get: (key) => {
        if (key === 'name') return 'basic';
        if (key === 'resetToken') return 'valid-token';
        return null;
      },
    },
  ]),
  Navigate: vi.fn(() => React.createElement('div', { 'data-testid': 'navigate' }, 'Navigate to not-found')),
}));
vi.mock('../authenticator', () => ({
  useAuthenticator: vi.fn(),
}));
vi.mock('@nocobase/client', () => ({
  SchemaComponent: vi.fn(({ schema, scope }) =>
    React.createElement('div', { 'data-testid': 'schema-component' }, 'Schema Component'),
  ),
  useAPIClient: vi.fn(() => ({
    auth: {
      checkResetToken: vi.fn().mockResolvedValue(true),
    },
  })),
  useNavigateNoUpdate: vi.fn(() => vi.fn()),
}));
vi.mock('../locale', () => ({
  useAuthTranslation: vi.fn(() => ({ t: (key) => key })),
}));
vi.mock('antd', () => ({
  Button: vi.fn(({ children, ...props }) => React.createElement('button', { ...props }, children)),
  Result: vi.fn(({ title, extra }) =>
    React.createElement(
      'div',
      { 'data-testid': 'result' },
      React.createElement('div', null, title),
      React.createElement('div', null, extra),
    ),
  ),
  message: {
    success: vi.fn(),
  },
}));
describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render ResetPasswordPage when reset password is enabled and token is valid', async () => {
    // 模拟认证器允许重置密码
    vi.mocked(useAuthenticator).mockReturnValue({
      options: {
        enableResetPassword: true,
      },
    });
    // 模拟有效的重置令牌
    vi.mocked(useSearchParams).mockReturnValue([
      {
        get: (key) => {
          if (key === 'name') return 'basic';
          if (key === 'resetToken') return 'valid-token';
          return null;
        },
      },
    ]);
    render(React.createElement(ResetPasswordPage, null));
    // 等待异步操作完成
    await vi.waitFor(() => {
      expect(screen.getByTestId('schema-component')).toBeTruthy();
    });
  });
  it('should redirect to not-found page when reset password is disabled', async () => {
    // 模拟认证器不允许重置密码
    vi.mocked(useAuthenticator).mockReturnValue({
      options: {
        enableResetPassword: false,
      },
    });
    render(React.createElement(ResetPasswordPage, null));
    // 直接测试导航组件的渲染，无需等待
    expect(screen.getByTestId('navigate')).toBeTruthy();
  });
  it('should redirect to not-found page when authenticator is not found', async () => {
    // 模拟认证器为 null
    vi.mocked(useAuthenticator).mockReturnValue(null);
    render(React.createElement(ResetPasswordPage, null));
    expect(screen.getByTestId('navigate')).toBeTruthy();
  });
  it('should show expired token message when token is invalid', async () => {
    // 模拟认证器允许重置密码
    vi.mocked(useAuthenticator).mockReturnValue({
      options: {
        enableResetPassword: true,
      },
    });
    // 模拟过期或无效的令牌
    vi.mocked(useAPIClient).mockReturnValue({
      auth: {
        checkResetToken: vi.fn().mockRejectedValue(new Error('Token expired')),
      },
    });
    render(React.createElement(ResetPasswordPage, null));
    // 等待异步操作完成
    await vi.waitFor(() => {
      expect(screen.getByTestId('result')).toBeTruthy();
    });
  });
  it('should use authenticator name from URL parameter', async () => {
    // 模拟 URL 参数中的认证器名称
    const mockName = 'custom-auth';
    vi.mocked(useSearchParams).mockReturnValue([
      {
        get: (key) => {
          if (key === 'name') return mockName;
          if (key === 'resetToken') return 'valid-token';
          return null;
        },
      },
    ]);
    // 模拟认证器允许重置密码
    vi.mocked(useAuthenticator).mockReturnValue({
      options: {
        enableResetPassword: true,
      },
    });
    render(React.createElement(ResetPasswordPage, null));
    // 验证是否使用了正确的认证器名称
    expect(useAuthenticator).toHaveBeenCalledWith(mockName);
  });
});
//# sourceMappingURL=ResetPasswordPage.test.js.map
