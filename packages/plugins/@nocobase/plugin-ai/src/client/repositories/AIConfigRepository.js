/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { define, observable } from '@formily/reactive';
export class AIConfigRepository {
  apiClient;
  options;
  llmServices = observable.shallow([]);
  llmServicesLoading = false;
  aiEmployees = observable.shallow([]);
  aiEmployeesLoading = false;
  aiTools = observable.shallow([]);
  aiToolsLoading = false;
  llmServicesLoaded = false;
  aiEmployeesLoaded = false;
  aiToolsLoaded = false;
  llmServicesInFlight = null;
  aiEmployeesInFlight = null;
  aiToolsInFlight = null;
  constructor(apiClient, options) {
    this.apiClient = apiClient;
    this.options = options;
    define(this, {
      llmServices: observable.shallow,
      llmServicesLoading: observable.ref,
      aiEmployees: observable.shallow,
      aiEmployeesLoading: observable.ref,
      aiTools: observable.shallow,
      aiToolsLoading: observable.ref,
    });
  }
  async getLLMServices() {
    if (this.llmServicesInFlight) {
      return this.llmServicesInFlight;
    }
    if (this.llmServicesLoaded) {
      return this.llmServices;
    }
    return this.startRefresh(
      this.llmServicesInFlight,
      (promise) => {
        this.llmServicesInFlight = promise;
      },
      () => this.doRefreshLLMServices(),
      () => this.llmServices,
    );
  }
  async refreshLLMServices() {
    return this.startRefresh(
      this.llmServicesInFlight,
      (promise) => {
        this.llmServicesInFlight = promise;
      },
      () => this.doRefreshLLMServices(),
      () => this.llmServices,
    );
  }
  async getAIEmployees() {
    if (this.aiEmployeesInFlight) {
      return this.aiEmployeesInFlight;
    }
    if (this.aiEmployeesLoaded) {
      return this.aiEmployees;
    }
    return this.startRefresh(
      this.aiEmployeesInFlight,
      (promise) => {
        this.aiEmployeesInFlight = promise;
      },
      () => this.doRefreshAIEmployees(),
      () => this.aiEmployees,
    );
  }
  async refreshAIEmployees() {
    return this.startRefresh(
      this.aiEmployeesInFlight,
      (promise) => {
        this.aiEmployeesInFlight = promise;
      },
      () => this.doRefreshAIEmployees(),
      () => this.aiEmployees,
    );
  }
  getAIEmployeesMap() {
    return this.aiEmployees.reduce((acc, aiEmployee) => {
      acc[aiEmployee.username] = aiEmployee;
      return acc;
    }, {});
  }
  async getAITools() {
    if (this.aiToolsInFlight) {
      return this.aiToolsInFlight;
    }
    if (this.aiToolsLoaded) {
      return this.aiTools;
    }
    return this.startRefresh(
      this.aiToolsInFlight,
      (promise) => {
        this.aiToolsInFlight = promise;
      },
      () => this.doRefreshAITools(),
      () => this.aiTools,
    );
  }
  async refreshAITools() {
    return this.startRefresh(
      this.aiToolsInFlight,
      (promise) => {
        this.aiToolsInFlight = promise;
      },
      () => this.doRefreshAITools(),
      () => this.aiTools,
    );
  }
  startRefresh(inFlight, setInFlight, refresh, getData) {
    if (inFlight) {
      return inFlight;
    }
    const promise = refresh()
      .then(() => getData())
      .finally(() => {
        setInFlight(null);
      });
    setInFlight(promise);
    return promise;
  }
  async doRefreshLLMServices() {
    this.llmServicesLoading = true;
    try {
      const res = await this.apiClient.resource('ai').listAllEnabledModels();
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      this.llmServices = data;
      this.llmServicesLoaded = true;
    } catch {
      this.llmServices = [];
      this.llmServicesLoaded = false;
    } finally {
      this.llmServicesLoading = false;
    }
  }
  async doRefreshAIEmployees() {
    this.aiEmployeesLoading = true;
    try {
      const aiEmployees = await this.apiClient
        .resource('aiEmployees')
        .listByUser()
        .then((res) => res?.data?.data);
      this.aiEmployees = aiEmployees || [];
      this.aiEmployeesLoaded = true;
    } catch {
      this.aiEmployees = [];
      this.aiEmployeesLoaded = false;
    } finally {
      this.aiEmployeesLoading = false;
    }
  }
  async doRefreshAITools() {
    this.aiToolsLoading = true;
    try {
      let tools = [];
      if (this.options?.toolsManager) {
        tools = await this.options.toolsManager.listTools();
      } else {
        const { data: res } = await this.apiClient.resource('aiTools').list({});
        tools = Array.isArray(res?.data) ? res.data : [];
      }
      this.aiTools = tools;
      this.aiToolsLoaded = true;
    } catch {
      this.aiTools = [];
      this.aiToolsLoaded = false;
    } finally {
      this.aiToolsLoading = false;
    }
  }
}
//# sourceMappingURL=AIConfigRepository.js.map
