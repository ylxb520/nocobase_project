export class ServiceContainer {
  services = new Map();
  register(name, service) {
    if (typeof service === 'function') {
      service = service();
    }
    this.services.set(name, service);
  }
  get(name) {
    return this.services.get(name);
  }
}
//# sourceMappingURL=service-container.js.map
