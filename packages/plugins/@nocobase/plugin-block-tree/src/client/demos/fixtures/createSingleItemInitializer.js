import { Grid } from '@nocobase/client';
import { SchemaInitializer } from '@nocobase/client';
export function createSingleItemInitializer(initializerItem) {
  return new SchemaInitializer({
    name: 'test',
    icon: 'SettingOutlined',
    wrap: Grid.wrap,
    title: 'Test',
    style: {
      marginLeft: 8,
    },
    items: [initializerItem],
  });
}
//# sourceMappingURL=createSingleItemInitializer.js.map
