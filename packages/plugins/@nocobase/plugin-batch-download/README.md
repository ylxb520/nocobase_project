# @nocobase/plugin-batch-download

批量下载附件插件，用于在表格中添加批量下载按钮。

## 功能

- 在表格操作栏中添加"批量下载附件"按钮
- 自动获取表格选中的行
- 调用后端 API 打包附件为 ZIP 文件并下载

## 安装

```bash
yarn pm add @nocobase/plugin-batch-download
```

## 使用方法

### 1. 在表格中添加按钮

1. 进入页面编辑模式
2. 点击表格操作栏的"配置操作"按钮
3. 在弹出的菜单中选择"批量下载附件"
4. 按钮会自动添加到操作栏

### 2. 使用按钮

1. 在表格中选择需要下载附件的记录（勾选复选框）
2. 点击"批量下载附件"按钮
3. 系统会自动打包选中记录的附件并下载为 ZIP 文件

## 配置

### 后端 API

后端需要实现 `batchDownloadAttachments` action，API 路径：

```
POST /api/<resource_name>:batchDownloadAttachments
```

请求体：
```json
{
  "ids": [1, 2, 3]
}
```

响应：
- Content-Type: application/zip
- Content-Disposition: attachment; filename="附件批量下载_xxx.zip"

### 自定义资源名称

默认情况下，插件使用当前数据块的资源名称。如果需要指定特定的资源名称，可以通过配置 `resourceName` 属性。

## 开发

### 目录结构

```
src/
├── client/
│   ├── BatchDownloadActionInitializer.tsx  # 按钮初始化器
│   ├── BatchDownloadActionSettings.tsx     # Schema Settings
│   ├── BatchDownloadButton.tsx             # 按钮组件
│   ├── hooks.tsx                           # React Hooks
│   ├── plugin.tsx                          # 客户端插件
│   └── index.tsx                           # 导出
├── server/
│   ├── actions/
│   │   └── batchDownloadAttachments.ts     # 后端 action
│   ├── plugin.ts                           # 服务端插件
│   └── index.ts                            # 导出
└── locale/
    ├── zh-CN.json                          # 中文翻译
    └── en-US.json                          # 英文翻译
```

### 扩展

如果需要在其他数据块（如列表、卡片）中添加按钮，可以在插件中注册：

```tsx
// plugin.tsx
this.app.schemaInitializerManager.addItem('list:configureActions', 'customize.batchDownload', initializerData);
this.app.schemaInitializerManager.addItem('gridCard:configureActions', 'customize.batchDownload', initializerData);
```

## License

AGPL-3.0
