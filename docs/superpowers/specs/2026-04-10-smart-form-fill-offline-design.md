# @tlws/plugin-smart-form-fill 离线自动填表设计

## 1. 背景

当前 `@tlws/plugin-smart-form-fill` 已具备“上传文件 -> 识别 -> 映射 -> 填充表单”的基础交互，但其服务端识别逻辑依赖外部 AI / OCR 服务：

- `BAIDU_OCR_APP_ID` / `BAIDU_OCR_API_KEY` / `BAIDU_OCR_SECRET_KEY`
- `OPENAI_API_KEY`

这与当前目标不符。新的目标是：

1. 不依赖任何 API Key
2. 在 Windows 本机运行的 NocoBase 环境中工作
3. 继续覆盖当前插件已声明支持的文件类型：图片、PDF、Word、Excel、PPT
4. 上传后直接自动填充表单，不再以手工映射为主
5. 字段匹配采用“按 collection 配置规则直填”的方式，保证可控性

## 2. 目标与非目标

### 2.1 目标

- 提供纯离线识别能力，支持：
  - 图片：jpg/jpeg/png/gif/webp/bmp
  - PDF
  - Word：doc/docx
  - Excel：xls/xlsx
  - PowerPoint：ppt/pptx
- 在服务端完成“文本提取 + 字段匹配 + 最终映射值生成”
- 前端识别成功后直接写入当前表单
- 提供识别摘要与异常信息，便于用户确认发生了什么
- 支持 Windows 本机常见安装路径与环境变量覆盖

### 2.2 非目标

- 第一版不引入云端 OCR、云端 LLM、本地大模型
- 第一版不做可视化规则配置后台
- 第一版不做基于页面坐标/模板版式的模板识别
- 第一版不追求“完全智能猜测所有业务字段”，以规则可控为第一优先级

## 3. 方案决策

采用**方案 A：纯离线工具链 + 表级映射规则直填**。

### 3.1 决策理由

该方案最符合以下约束组合：

- 无 API Key
- Windows 本机环境
- 第一版保留所有现有文件类型
- 交互要求为“全自动直填”
- 匹配策略要求“配置规则直填”

在这些约束下，比起“更智能”的自由推断，更重要的是“更可控”的稳定映射。因此设计重点应放在：

1. 尽可能稳定地离线提取文本
2. 通过 collection 级规则将文本映射到表单字段
3. 将服务端结果直接写入表单

## 4. 整体架构

新版本插件采用四层处理架构：

### 4.1 文件解析层

按文件类型产出原始文本：

- 图片 -> Tesseract OCR
- PDF -> 优先直接抽文本，必要时转图片后 OCR
- Word -> docx 直接抽文本；doc 经 LibreOffice 转换后再处理
- Excel -> 读取 sheet 与单元格内容
- PPT -> pptx 直接抽文本；ppt 经 LibreOffice 转换后再处理

### 4.2 文本规范化层

将不同来源的文本统一整理为可匹配格式：

- 去除多余空白
- 合并无意义断行
- 统一中英文冒号、空格、全角/半角字符
- 生成候选键值对与原始文本块

### 4.3 字段规则匹配层

针对目标 collection 读取规则配置，对文本执行：

- 别名匹配
- 正则匹配
- 文本清洗
- 类型归一化
- 冲突处理

输出最终 `mappedValues`

### 4.4 表单直填层

前端上传后调用服务端识别接口，收到 `mappedValues` 后：

- 直接写入当前表单实例
- 展示“已自动填充字段 / 未匹配内容 / 失败文件”摘要
- 不再以手工映射流程为主

## 5. 依赖与运行环境

### 5.1 Windows 本机离线依赖

第一版建议依赖以下本机工具：

- **Tesseract OCR**：图片 OCR、扫描件 OCR 核心
- **LibreOffice**：旧版 Office 文档转换（doc / ppt 等）
- **Poppler 工具集（如 pdftoppm）**：PDF 转图片

### 5.2 支持矩阵

- 图片（jpg/jpeg/png/gif/webp/bmp）：基础支持，依赖 Tesseract
- PDF：基础支持；文本型 PDF 优先直接抽文本，扫描型 PDF 依赖 `pdftoppm + Tesseract`
- docx：基础支持，直接提取文本
- doc：有条件支持，依赖 LibreOffice 转换；缺失时返回明确错误
- xls/xlsx：基础支持，直接读取表格内容
- pptx：基础支持，直接提取文本
- ppt：有条件支持，依赖 LibreOffice 转换；缺失时返回明确错误

### 5.2 Node 侧保留与移除建议

保留：

- `mammoth`
- `pdf-parse`
- `xlsx`
- `adm-zip`

弱化或移除作为核心路径的依赖：

- `baidu-aip-sdk`：移除
- `pdf2pic`：不作为主路径
- `gm`：不作为主路径

### 5.3 Windows 工具路径策略

按以下优先级定位工具：

1. 环境变量显式指定：
   - `TESSERACT_PATH`
   - `LIBREOFFICE_PATH`
   - `PDFTOPPM_PATH`
2. 自动探测常见默认安装路径
3. 若未找到，在插件加载时输出 warning，并在执行识别时返回明确错误

## 6. 文件类型处理策略

### 6.1 图片

处理流程：

1. 调用 Tesseract 对原图 OCR
2. 输出纯文本
3. 交给规则匹配层生成字段映射

### 6.2 PDF

处理流程：

1. 先使用 `pdf-parse` 提取文本
2. 若提取文本总长度超过阈值（如 200 个非空字符）且每页平均文本量达到最低要求，则直接匹配规则
3. 若提取文本很少，则判定为扫描件路径：
   - 使用 `pdftoppm` 转图片
   - 对每页调用 Tesseract
   - 合并页文本
   - 再进入规则匹配
4. 为避免性能失控，需要加入以下限制：
   - OCR 页数上限（如最多前 20 页）
   - 单页 OCR 超时
   - 单文件总处理超时
   - 达到有效文本阈值后允许提前结束后续页 OCR

### 6.3 Word

- `.docx`：直接 `mammoth.extractRawText`
- `.doc`：使用 LibreOffice 转 `.docx` 或 `.pdf` 后再走现有处理流程

### 6.4 Excel

- 使用 `xlsx` 遍历 workbook / sheet
- 优先按“左侧单元格为键、右侧单元格为值”生成 `kvCandidates`
- 次优先按“上方单元格为键、下方单元格为值”生成 `kvCandidates`
- 对首行明显为表头的区域，按“表头 -> 当前行值”生成候选
- 遇到合并单元格时，以展开后的可见文本为准，不额外尝试复杂跨区域推断
- 同时保留 sheet 行列文本作为 `textBlocks`
- 统一输出给规则匹配层的数据结构应至少包含：
  - `rawText`
  - `textBlocks`
  - `kvCandidates`
  - `sourceMeta`（如 filename / sheet / row / col）
- 交给规则匹配层

### 6.5 PowerPoint

- `.pptx`：解压 XML 抽文本
- `.ppt`：通过 LibreOffice 转 `.pptx` 或 `.pdf` 后继续处理
- 对每一页 slide，按 shape 出现顺序提取文本并形成 `textBlocks`
- 若同一 slide 中存在明显“标签: 值”文本，直接生成 `kvCandidates`
- 不处理备注区、动画时序和复杂版式推断
- PPT/PPTX 统一输出给规则匹配层的数据结构应至少包含：
  - `rawText`
  - `textBlocks`
  - `kvCandidates`
  - `sourceMeta`（如 filename / slide / shape）

## 7. 规则配置设计

第一版规则采用**插件内置配置文件**，按 collection 分组。

### 7.1 规则模型

```ts
type SmartFillRule = {
  field: string;
  aliases?: string[];
  patterns?: string[];
  type?: 'string' | 'number' | 'date' | 'boolean';
  trim?: boolean;
  removeSpaces?: boolean;
  normalizePunctuation?: boolean;
  priority?: number;
  required?: boolean;
  defaultValue?: string | number | boolean | null;
  conflictPolicy?: 'first' | 'last' | 'error';
  valueMap?: Record<string, string | number | boolean>;
  parser?: 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email';
  allowOverwrite?: boolean;
  targetFieldType?: string;
};
```

### 7.2 规则文件落地方式

第一版规则采用插件内置 TypeScript 模块，不走数据库。

- 文件路径固定为：`packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts`
- 该模块导出按 collection 分组的规则对象，例如 `export const SMART_FILL_RULES = { ... }`
- 插件启动时首次加载该模块，并在服务端进程生命周期内以内存方式缓存
- 第一版不支持运行时热更新；修改规则后需要重启 NocoBase 进程
- 若规则模块缺失、导出为空或目标 collection 无配置，服务端直接返回明确错误
- 后续若要支持自定义规则文件路径，可再新增环境变量扩展，不纳入第一版范围

### 7.3 collection 规则约束

- collection 名由前端 action 配置传入，并与当前动作绑定的 collection 保持一致
- 服务端必须校验 collection 是否存在、是否允许被当前插件处理
- 未配置规则的 collection，第一版直接返回明确错误，而不是进入通用猜测模式
- 第一版仅支持普通标量字段自动直填，如字符串、数字、布尔、日期
- 第一版不支持关系字段、附件字段、子表字段的自动直填
- 若 collection 中字段不存在、已删除或类型不兼容，服务端返回 warning，并跳过该字段

### 7.4 配置示例

```json
{
  "material_submissions": [
    {
      "field": "applicant_name",
      "aliases": ["姓名", "申请人", "填报人"],
      "patterns": ["姓名[：: ]+(.+)", "申请人[：: ]+(.+)"],
      "type": "string"
    },
    {
      "field": "phone",
      "aliases": ["电话", "手机号", "联系电话"],
      "patterns": ["(电话|手机号|联系电话)[：: ]+([0-9\\-+ ]+)"],
      "type": "string"
    }
  ]
}
```

### 7.5 匹配顺序

建议匹配顺序如下：

1. 正则命中
2. 别名 + 冒号值命中
3. 邻近文本块推断
4. 类型归一化与清洗

### 7.6 值转换与解析规则

字段值转换遵循以下顺序：

1. 原始命中文本
2. 文本清洗（`trim` / `removeSpaces` / `normalizePunctuation`）
3. 若配置 `valueMap`，先执行枚举映射
4. 再按 `parser` 解析
5. 最后按 `targetFieldType` 做类型兼容校验

第一版的解析约束：

- `string`：保留文本，清洗后直接使用
- `number`：允许去除千分位逗号与首尾空白；不处理中文大写金额
- `date`：优先支持 `YYYY-MM-DD`、`YYYY/MM/DD`、`YYYY.MM.DD`、`YYYY年MM月DD日`
- `boolean`：支持 `是/否`、`true/false`、`1/0`；若同时配置 `valueMap`，以 `valueMap` 为先
- `phone`：提取常见手机号/固话字符，保留数字及 `+ -`
- `email`：按标准邮箱格式提取

解析失败语义：

- 若值无法解析为目标类型，记录 warning，并跳过该字段赋值
- 第一版不回填原始无法解析值到目标字段
- `defaultValue` 仅在该字段完全未命中任何有效值时使用，不用于覆盖解析失败结果

### 7.7 多文件合并与冲突策略

当多个文件或多个文本块命中同一字段且值不同：

- 先按前端上传顺序处理文件，前面的文件优先级更高
- 单文件内部再按规则优先级与文本命中顺序处理
- 规则优先级更高者优先
- 若优先级相同，则按 `conflictPolicy` 决定：`first` / `last` / `error`
- 默认策略为 `first`
- 空值不参与覆盖；只有非空有效值才可参与冲突决策
- `defaultValue` 只在所有文件都未命中有效值时应用一次
- 发生冲突时将冲突信息记录到 `warnings` 或 `errors`

### 7.8 为什么第一版不做数据库化配置

第一版优先交付离线识别主链路。若同时做配置表、后台 UI、权限与缓存，范围会明显扩大。先以内置配置文件完成能力验证，后续再升级为可视化配置更稳妥。

## 8. 服务端模块设计

建议将当前 `recognizer.ts` 拆分为更清晰的模块边界：

- `src/server/plugin.ts`
  - 路由注册、上传接收、结果汇总、ACL
- `src/server/file-extractors.ts`
  - 各文件类型文本提取入口
- `src/server/ocr.ts`
  - Tesseract OCR、PDF 转图片 OCR
- `src/server/rule-matcher.ts`
  - collection 规则匹配逻辑
- `src/server/rules.ts`
  - 内置规则配置
- `src/server/windows-tools.ts`
  - Windows 工具路径探测与命令包装
- `src/server/text-normalizer.ts`
  - 文本清洗、键值候选生成

### 8.1 接口变更

识别接口除了上传文件，还应接收当前目标 collection：

- `files`
- `collection`

### 8.2 返回契约

需要区分“逻辑返回体”和“NocoBase 实际客户端读取方式”。

逻辑返回体定义为：

```ts
{
  files: [
    {
      filename: "xxx.pdf",
      textPreview: "...",
      mappedValues: {
        applicant_name: "张三",
        phone: "13800138000"
      }
    }
  ],
  mappedValues: {
    applicant_name: "张三",
    phone: "13800138000"
  },
  unmatchedTextBlocks: [
    { filename: "xxx.pdf", page: 1, text: "未匹配文本" }
  ],
  warnings: [
    { filename: "xxx.pdf", field: "phone", message: "字段冲突，已保留首个值" }
  ],
  errors: [
    { filename: "xxx.pdf", stage: "ocr", message: "Tesseract 执行失败" }
  ]
}
```

服务端实现建议直接设置：

```ts
ctx.body = {
  files,
  mappedValues,
  unmatchedTextBlocks,
  warnings,
  errors,
};
```

考虑到 NocoBase 可能自动包装响应，前端读取时应统一兼容：

```ts
const body = res.data?.data || res.data;
```

## 9. 前端交互设计

重点文件：

- `src/client/SmartFormFillAction.tsx`
- `src/client/models/SmartFormFillActionModel.tsx`

### 9.1 交互调整

当前流程：

1. 上传文件
2. 识别
3. 展示识别字段
4. 用户手工选择映射
5. 点击 Fill form

目标流程：

1. 上传文件
2. 服务端识别并自动匹配，返回 `mappedValues`
3. 前端立即写入当前表单
4. 前端展示结果摘要，不再要求用户进行二次映射确认

### 9.2 前端表单写入契约

前端自动直填必须基于 NocoBase 当前动作上下文中的表单实例完成，避免使用全局 DOM 猜测。

约束如下：

- 优先从 `actionContext?.field?.form` 或 `actionContext?.form` 获取表单实例
- 写值采用批量写入优先策略；若当前表单 API 仅支持逐字段写入，则按字段循环调用
- 写值后应触发表单内部联动、校验与脏状态更新，避免只改 UI 不改表单状态
- 若单个字段写入失败，应记录 warning，并继续写入其他字段
- 若整个表单实例不可用，则返回前端错误并终止自动直填，不降级为 DOM 事件方案
- 第一版不支持跨表单、子表、关系字段的联动写入

### 9.3 前端保留的反馈信息

即使改成自动直填，也应保留轻量结果反馈：

- 已自动填充多少字段
- 哪些字段已填充
- 哪些文本未匹配
- 哪些文件失败

这样在误差发生时，用户能理解系统做了什么。

### 9.3 模型配置项

第一版仅保留以下配置：

- `collection`

`autoFillMode` 不再作为第一版配置项，自动直填为固定行为。

`fieldMappings` 从主流程中移除，不再保留手工映射 UI 或状态逻辑。

## 10. 安全与异常处理

### 10.1 安全边界

- 保留 MIME 类型与扩展名双重校验
- 外部命令仅允许白名单程序
- 所有命令参数必须安全转义
- 限制单文件大小与上传文件数量

### 10.2 异常策略

- 单文件失败不影响其他文件
- 单页 OCR 失败不影响整个 PDF 处理
- 每次识别返回明确的结构化结果：
  - `errors: Array<{ filename: string; stage: string; message: string }>`
  - `warnings: Array<{ filename: string; field?: string; message: string }>`
  - `unmatchedTextBlocks: Array<{ filename: string; page?: number; text: string }>`

### 10.3 资源与性能约束

Windows 本机运行下，需要显式约束资源消耗：

- 最大 OCR 页数（如每个 PDF 最多处理前 20 页）
- Tesseract 并发数限制（如单请求串行或最多 2 并发）
- 单页 OCR 超时
- 单文件总处理超时
- 单请求总处理超时
- 临时目录统一放入插件专用 temp 目录，并在成功/失败后清理

### 10.4 降级策略

- 若缺少 `pdftoppm`，PDF 扫描件路径返回明确错误
- 若缺少 `LibreOffice`，旧版 Office 文件转换路径返回明确错误
- 若缺少 `Tesseract`，图片 / 扫描件路径返回明确错误

## 11. 测试策略

至少覆盖以下测试面：

1. 图片 OCR 文本提取
2. PDF 的文本型路径与扫描型路径
3. docx / doc / xlsx / pptx / ppt 各自解析路径
4. collection 规则匹配与冲突处理
5. 多文件合并结果
6. 前端自动填表是否正确写入表单实例
7. 无 Tesseract / LibreOffice / pdftoppm 时是否返回明确错误
8. 同一 collection 多文件冲突时是否按 `priority + conflictPolicy` 生效
9. 字段别名误命中时是否能被规则约束拦住
10. 扫描 PDF 多页混合场景下是否遵守页数/超时限制

## 12. 预期修改文件

预计主要修改：

- `packages/plugins/@tlws/plugin-smart-form-fill/package.json`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts`（可能拆分）
- `packages/plugins/@tlws/plugin-smart-form-fill/src/client/SmartFormFillAction.tsx`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/client/models/SmartFormFillActionModel.tsx`

预计新增：

- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/ocr.ts`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/file-extractors.ts`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rule-matcher.ts`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/windows-tools.ts`
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/text-normalizer.ts`

## 13. 实施顺序建议

1. 移除对 Baidu/OpenAI 依赖的主链路
2. 加入 Windows 离线工具探测能力
3. 重构文件解析与 OCR 管线
4. 实现规则配置与字段匹配
5. 调整接口返回结构
6. 改造前端为自动直填
7. 补测试与验证脚本

## 14. 最终结论

本次改造的核心不是“更像 AI”，而是“更像稳定工具链”。

通过“离线文本提取 + collection 规则直填”的设计，插件可以在不依赖任何 API Key 的前提下，在 Windows 本机 NocoBase 环境中稳定支持图片、PDF、Word、Excel、PPT 的自动识别与表单自动填充，并把不确定性控制在规则配置层，而不是留给运行时猜测。