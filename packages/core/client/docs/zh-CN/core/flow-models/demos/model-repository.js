import { Application, Plugin } from '@nocobase/client';
import { FlowModel } from '@nocobase/flow-engine';
class FlowModelRepository {
  app;
  constructor(app) {
    this.app = app;
  }
  async findOne({ uid, parentId }) {
    // implement fetching a model by id
    return null;
  }
  async save(model) {
    console.log('Saving model:', model);
    // implement saving a model
    return model;
  }
  async destroy(uid) {
    // implement deleting a model by id
    return true;
  }
}
// 插件定义
class PluginHelloModel extends Plugin {
  async load() {
    this.flowEngine.setModelRepository(new FlowModelRepository(this.app));
    this.flowEngine.registerModels({ FlowModel });
    const model = this.flowEngine.createModel({
      use: 'FlowModel',
      props: {
        name: 'NocoBase',
      },
    });
    await model.save();
  }
}
// 创建应用实例
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginHelloModel],
});
export default app.getRootComponent();
//# sourceMappingURL=model-repository.js.map
