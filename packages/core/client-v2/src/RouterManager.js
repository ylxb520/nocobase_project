/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { get, set } from 'lodash';
import React, { createContext, useContext } from 'react';
import { matchRoutes } from 'react-router';
import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { BlankComponent, RouterContextCleaner } from './components';
import { RouterBridge } from './components/RouterBridge';
export class RouterManager {
  routes = {};
  options;
  app;
  router;
  get basename() {
    return this.router.basename;
  }
  get state() {
    return this.router.state;
  }
  get navigate() {
    return this.router.navigate;
  }
  constructor(options = {}, app) {
    this.options = options;
    this.app = app;
    this.routes = options.routes || {};
  }
  /**
   * @internal
   */
  getRoutesTree() {
    const routes = {};
    /**
     * { 'a': { name: '1' }, 'a.b': { name: '2' }, 'a.c': { name: '3' } };
     * =>
     * { a: { name: '1', children: { b: { name: '2' }, c: {name: '3'} } } }
     */
    for (const [name, route] of Object.entries(this.routes)) {
      set(routes, name.split('.').join('.children.'), { ...get(routes, name.split('.').join('.children.')), ...route });
    }
    /**
     * get RouteObject tree
     *
     * @example
     * { a: { name: '1', children: { b: { name: '2' }, c: { children: { d: { name: '3' } } } } } }
     * =>
     * { name: '1', children: [{ name: '2' }, { name: '3' }] }
     */
    const buildRoutesTree = (routes) => {
      return Object.values(routes).reduce((acc, item) => {
        if (Object.keys(item).length === 1 && item.children) {
          acc.push(...buildRoutesTree(item.children));
        } else {
          const { Component, element, children, ...reset } = item;
          let ele = element;
          if (Component) {
            if (typeof Component === 'string') {
              ele = this.app.renderComponent(Component);
            } else {
              ele = React.createElement(Component);
            }
          }
          const res = {
            ...reset,
            element: ele,
            children: children ? buildRoutesTree(children) : undefined,
          };
          acc.push(res);
        }
        return acc;
      }, []);
    };
    return buildRoutesTree(routes);
  }
  getRoutes() {
    return this.routes;
  }
  setType(type) {
    this.options.type = type;
  }
  getBasename() {
    return this.options.basename;
  }
  setBasename(basename) {
    this.options.basename = basename;
  }
  matchRoutes(pathname) {
    const routes = Object.values(this.routes);
    // @ts-ignore
    return matchRoutes(routes, pathname, this.basename);
  }
  isSkippedAuthCheckRoute(pathname) {
    const matchedRoutes = this.matchRoutes(pathname);
    return matchedRoutes.some((match) => {
      return match?.route?.skipAuthCheck === true;
    });
  }
  /**
   * @internal
   */
  getRouterComponent(children) {
    const { type = 'browser', ...opts } = this.options;
    const routerCreators = {
      hash: createHashRouter,
      browser: createBrowserRouter,
      memory: createMemoryRouter,
    };
    const routes = this.getRoutesTree();
    const BaseLayoutContext = createContext(null);
    const Provider = () => {
      const BaseLayout = useContext(BaseLayoutContext);
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(RouterBridge, { app: this.app }),
        React.createElement(BaseLayout, null, React.createElement(Outlet, null), children),
      );
    };
    // bubble up error to application error boundary
    const ErrorElement = () => {
      const error = useRouteError();
      throw error;
    };
    this.router = routerCreators[type](
      [
        {
          element: React.createElement(Provider, null),
          errorElement: React.createElement(ErrorElement, null),
          children: routes,
        },
      ],
      opts,
    );
    const RenderRouter = ({ BaseLayout = BlankComponent }) => {
      return React.createElement(
        BaseLayoutContext.Provider,
        { value: BaseLayout },
        React.createElement(
          RouterContextCleaner,
          null,
          React.createElement(RouterProvider, {
            future: {
              v7_startTransition: true,
            },
            router: this.router,
          }),
        ),
      );
    };
    return RenderRouter;
  }
  add(name, route) {
    this.routes[name] = {
      id: name,
      ...route,
      handle: {
        path: route.path,
      },
    };
  }
  get(name) {
    return this.routes[name];
  }
  has(name) {
    return !!this.get(name);
  }
  remove(name) {
    delete this.routes[name];
  }
}
export function createRouterManager(options, app) {
  return new RouterManager(options, app);
}
//# sourceMappingURL=RouterManager.js.map
