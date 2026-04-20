# Smart Form Fill Offline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `@tlws/plugin-smart-form-fill` 从依赖百度/OpenAI 的识别方案改造成 Windows 本机纯离线工具链方案，支持图片/PDF/Word/Excel/PPT 自动识别并直接填充当前表单。

**Architecture:** 服务端拆分为工具探测、文本提取、OCR、文本规范化、规则匹配五个职责明确的模块，统一输出 `mappedValues`、`warnings` 和 `errors`。前端移除手工映射主流程，改为上传后读取服务端映射结果并直接写入当前表单，同时显示轻量摘要反馈。

**Tech Stack:** NocoBase 2.x、TypeScript、React、Ant Design、koaMulter、Formily/NocoBase form API、mammoth、pdf-parse、xlsx、adm-zip、Windows 本机 Tesseract / LibreOffice / pdftoppm。

---

## File structure

### Existing files to modify

- `packages/plugins/@tlws/plugin-smart-form-fill/package.json`
  - 移除百度/OpenAI 相关依赖，保留离线解析所需依赖。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts`
  - 注册上传识别接口、固定请求契约、汇总文件结果、返回统一结构、校验 collection 与上传限制。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/client/SmartFormFillAction.tsx`
  - 发送 `files + collection` 请求，兼容 NocoBase 双层 data，自动写表单并展示摘要。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/client/models/SmartFormFillActionModel.tsx`
  - 去掉 `fieldMappings` 主流程配置，只保留 `collection`。

### New files to create

- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/windows-tools.ts`
  - 定位 `TESSERACT_PATH` / `LIBREOFFICE_PATH` / `PDFTOPPM_PATH`，封装白名单命令执行。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts`
  - 导出 `SMART_FILL_RULES` 和规则类型定义，按 collection 维护规则。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/text-normalizer.ts`
  - 文本清洗、键值候选生成、统一 `rawText/textBlocks/kvCandidates/sourceMeta` 结构。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/ocr.ts`
  - 图片 OCR、PDF 转图片 OCR、超时/页数控制、临时文件清理。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/file-extractors.ts`
  - 各文件类型文本提取主入口，协调 mammoth/pdf-parse/xlsx/adm-zip/LibreOffice。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rule-matcher.ts`
  - collection 校验、字段规则匹配、值转换、冲突处理、生成 `mappedValues`。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`
  - 规则匹配、值转换、冲突策略测试。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts`
  - 文本规范化与 kvCandidates 生成测试。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts`
  - 仅覆盖接口参数、返回结构、错误路径与多文件汇总。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/windows-tools.test.ts`
  - 仅覆盖工具探测与白名单命令执行。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/file-extractors.test.ts`
  - 仅覆盖各文件类型提取分支、降级链路、缺失工具、超时控制。
- `packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`
  - 自动直填、响应兼容、摘要反馈测试。

### Existing docs/spec inputs to consult while implementing

- `docs/superpowers/specs/2026-04-10-smart-form-fill-offline-design.md`
- `packages/core/client/src/collection-manager/templates/components/PresetFields.tsx`
- `packages/core/client/src/schema-component/antd/form/Form.tsx`
- `packages/core/client/src/schema-component/antd/form-v2/Form.tsx`
- `packages/core/client/src/flow/models/blocks/form/FormBlockModel.tsx`
- `packages/plugins/@nocobase/plugin-action-custom-request/src/server/__tests__/actions.test.ts`
- `packages/plugins/@nocobase/plugin-auth/src/client/__tests__/ResetPasswordPage.test.tsx`
- `packages/core/client/src/flow/models/blocks/form/__tests__/FormBlockModel.test.tsx`

### Testing conventions for this plan

- 服务端单元测试默认不依赖本机真实安装的 Tesseract / LibreOffice / pdftoppm，统一通过 mock `windows-tools.ts` 的命令执行层与第三方解析库来完成。
- 客户端测试优先 mock `@nocobase/client` 中的 `useAPIClient`、`useActionContext`、`useRecord`，参考 `packages/plugins/@nocobase/plugin-auth/src/client/__tests__/ResetPasswordPage.test.tsx` 的写法，不要求构造真实应用壳。
- 服务端 action 测试优先参考 `packages/plugins/@nocobase/plugin-action-custom-request/src/server/__tests__/actions.test.ts`，使用 `createMockServer` + `app.agent()` 风格，不使用伪函数名。
- 最终仅手工验证阶段依赖开发机真实工具与真实 Windows 路径；执行前需要显式设置 `TESSERACT_PATH`、`LIBREOFFICE_PATH`、`PDFTOPPM_PATH`。

---

### Task 1: Remove cloud dependencies and define static contracts

**Files:**
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/package.json`
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/client/models/SmartFormFillActionModel.tsx`
- Create: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`

- [ ] **Step 1: Write the failing server-side rule contract test**

```ts
import { describe, expect, it } from 'vitest';
import { SMART_FILL_RULES } from '../rules';

describe('SMART_FILL_RULES', () => {
  it('defines rules for material_submissions with scalar target fields only', () => {
    expect(SMART_FILL_RULES.material_submissions?.length).toBeGreaterThan(0);
    expect(SMART_FILL_RULES.material_submissions.every((rule) => typeof rule.field === 'string')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`
Expected: FAIL because `rules.ts` and the test file do not exist yet.

- [ ] **Step 3: Update package dependencies minimally**

Edit `packages/plugins/@tlws/plugin-smart-form-fill/package.json`:

```json
{
  "dependencies": {
    "adm-zip": "^0.5.10",
    "mammoth": "^1.6.0",
    "pdf-parse": "^1.1.1",
    "xlsx": "^0.18.5"
  }
}
```

Remove:

```json
"baidu-aip-sdk": "^4.16.0",
"pdf2pic": "^3.1.0",
"gm": "^1.25.0"
```

- [ ] **Step 4: Create `rules.ts` with the minimal production shape**

```ts
export type SmartFillRule = {
  field: string;
  aliases?: string[];
  patterns?: string[];
  parser?: 'string' | 'number' | 'date' | 'boolean' | 'phone' | 'email';
  priority?: number;
  conflictPolicy?: 'first' | 'last' | 'error';
  valueMap?: Record<string, string | number | boolean>;
  defaultValue?: string | number | boolean | null;
  allowOverwrite?: boolean;
  targetFieldType?: string;
};

export const SMART_FILL_RULES = {
  material_submissions: [
    {
      field: 'applicant_name',
      aliases: ['姓名', '申请人', '填报人'],
      patterns: ['姓名[：: ]+(.+)', '申请人[：: ]+(.+)'],
      parser: 'string',
      priority: 100,
      conflictPolicy: 'first',
      targetFieldType: 'string',
    },
  ],
};
```

- [ ] **Step 5: Simplify the action model config to only `collection`**

Target behavior in `SmartFormFillActionModel.tsx`:

```ts
export type SmartFormFillActionProps = ButtonProps & {
  collection?: string;
};

// defaultProps only includes title/icon/collection
// registerFlow defaultParams + handler only read/write collection
```

- [ ] **Step 6: Add and complete the rule contract test**

Extend the test to assert:

```ts
expect(
  SMART_FILL_RULES.material_submissions.every((rule) => !['belongsTo', 'hasMany'].includes(rule.targetFieldType || '')),
).toBe(true);
```

- [ ] **Step 7: Run the focused server test to verify it passes**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/package.json \
  packages/plugins/@tlws/plugin-smart-form-fill/src/client/models/SmartFormFillActionModel.tsx \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts

git commit -m "refactor: define offline smart fill contracts"
```

### Task 2: Build Windows tool discovery and safe command execution

**Files:**
- Create: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/windows-tools.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/windows-tools.test.ts`

- [ ] **Step 1: Write the failing tool discovery test**

```ts
import { describe, expect, it } from 'vitest';
import { detectWindowsTools } from '../windows-tools';

describe('detectWindowsTools', () => {
  it('returns explicit env paths before probing defaults', () => {
    const tools = detectWindowsTools({
      TESSERACT_PATH: 'C:/custom/tesseract.exe',
      LIBREOFFICE_PATH: 'C:/custom/soffice.exe',
      PDFTOPPM_PATH: 'C:/custom/pdftoppm.exe',
    });
    expect(tools.tesseract).toBe('C:/custom/tesseract.exe');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/windows-tools.test.ts`
Expected: FAIL because `windows-tools.ts` does not exist.

- [ ] **Step 3: Implement minimal tool discovery and safe exec**

Create `windows-tools.ts` with exact responsibilities:

```ts
export type WindowsToolPaths = {
  tesseract?: string;
  libreOffice?: string;
  pdftoppm?: string;
};

export function detectWindowsTools(env = process.env): WindowsToolPaths {
  return {
    tesseract: env.TESSERACT_PATH || 'C:/Program Files/Tesseract-OCR/tesseract.exe',
    libreOffice: env.LIBREOFFICE_PATH || 'C:/Program Files/LibreOffice/program/soffice.exe',
    pdftoppm: env.PDFTOPPM_PATH || 'C:/Program Files/poppler/Library/bin/pdftoppm.exe',
  };
}
```

Add a whitelist-based executor:

```ts
const ALLOWED_EXECUTABLES = new Set(['tesseract.exe', 'soffice.exe', 'pdftoppm.exe']);
```

- [ ] **Step 4: Add a second failing/then-passing test for executable whitelist**

```ts
expect(() => assertAllowedExecutable('C:/Windows/System32/cmd.exe')).toThrow();
```

- [ ] **Step 5: Run focused tests to verify discovery and whitelist pass**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/windows-tools.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/server/windows-tools.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/windows-tools.test.ts

git commit -m "feat: add offline windows tool detection"
```

### Task 3: Implement text normalization and candidate extraction

**Files:**
- Create: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/text-normalizer.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts`

- [ ] **Step 1: Write the failing normalization test**

```ts
import { describe, expect, it } from 'vitest';
import { normalizeExtractedText } from '../text-normalizer';

it('builds kvCandidates from colon-based lines', () => {
  const result = normalizeExtractedText('姓名：张三\n电话: 13800138000', { filename: 'a.pdf' });
  expect(result.kvCandidates).toEqual([
    { key: '姓名', value: '张三', sourceMeta: { filename: 'a.pdf' } },
    { key: '电话', value: '13800138000', sourceMeta: { filename: 'a.pdf' } },
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts`
Expected: FAIL because `text-normalizer.ts` does not exist.

- [ ] **Step 3: Implement the minimal normalizer**

Required outputs:

```ts
type NormalizedExtraction = {
  rawText: string;
  textBlocks: Array<{ text: string; sourceMeta: Record<string, any> }>;
  kvCandidates: Array<{ key: string; value: string; sourceMeta: Record<string, any> }>;
};
```

Core logic:
- normalize `：` and `:`
- trim blank lines
- build one `textBlock` per non-empty line
- split `key: value` lines into `kvCandidates`

- [ ] **Step 4: Add tests for Excel-style left/right and top/bottom candidates**

Example assertions:

```ts
expect(buildSheetCandidates([
  ['姓名', '张三'],
  ['电话', '13800138000'],
])).toHaveLength(2);
```

- [ ] **Step 5: Add tests for PPT text-block extraction ordering**

Example assertion:

```ts
expect(result.textBlocks.map((b) => b.text)).toEqual(['标题', '姓名: 张三']);
```

- [ ] **Step 6: Run focused tests to verify they pass**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/server/text-normalizer.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts

git commit -m "feat: normalize offline extracted text"
```

### Task 4: Validate collection schema and implement rule matching

**Files:**
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts`
- Create: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/rule-matcher.ts`
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`

- [ ] **Step 1: Extend the failing test with collection schema validation assertions**

```ts
import { matchCollectionRules } from '../rule-matcher';

it('skips fields missing from the collection schema and records warnings', () => {
  const result = matchCollectionRules({
    collection: 'material_submissions',
    collectionFields: [
      { name: 'applicant_name', type: 'string' },
      { name: 'phone', type: 'string' },
    ],
    extraction: {
      rawText: '姓名: 张三\n电话: 111',
      textBlocks: [],
      kvCandidates: [
        { key: '姓名', value: '张三', sourceMeta: { filename: 'a.pdf' } },
        { key: '电话', value: '111', sourceMeta: { filename: 'a.pdf' } },
      ],
    },
  });
  expect(result.mappedValues.applicant_name).toBe('张三');
  expect(result.warnings).toEqual([]);
});
```

- [ ] **Step 2: Run the matcher test to verify it fails**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`
Expected: FAIL because `matchCollectionRules` does not exist.

- [ ] **Step 3: Implement minimal matching + schema validation logic**

Required surface:

```ts
export function matchCollectionRules(input: {
  collection: string;
  collectionFields: Array<{ name: string; type: string }>;
  extraction: NormalizedExtraction;
}) {
  return {
    mappedValues: {},
    warnings: [],
    errors: [],
    unmatchedTextBlocks: [],
  };
}
```

Rules to implement now, no extras:
- require known collection in `SMART_FILL_RULES`
- require non-empty `collectionFields`
- skip rule targets absent from schema with warning
- skip non-scalar schema fields with warning
- match by regex first, alias second
- parse using `valueMap` then `parser`
- skip invalid scalar conversions with warning
- apply `conflictPolicy` with upload order preserved

- [ ] **Step 4: Add tests for parser behavior**

Include at least:

```ts
expect(parseRuleValue('1,234', { parser: 'number' })).toBe(1234);
expect(parseRuleValue('是', { parser: 'boolean', valueMap: { 是: true, 否: false } })).toBe(true);
expect(parseRuleValue('2026年04月10日', { parser: 'date' })).toBe('2026-04-10');
```

- [ ] **Step 5: Add tests for unknown collection and incompatible field types**

Example assertions:

```ts
expect(() =>
  matchCollectionRules({
    collection: 'unknown_collection',
    collectionFields: [],
    extraction,
  }),
).toThrow(/No rules configured/);
```

and

```ts
expect(result.warnings).toContainEqual(
  expect.objectContaining({ field: 'attachment', message: expect.stringMatching(/unsupported field type/i) }),
);
```

- [ ] **Step 6: Run focused matcher tests to verify they pass**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/server/rules.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/rule-matcher.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts

git commit -m "feat: validate schema for offline smart fill"
```

### Task 5: Implement offline OCR and file extractors

**Files:**
- Create: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/ocr.ts`
- Create: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/file-extractors.ts`
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/file-extractors.test.ts`

- [ ] **Step 1: Write the failing extractor orchestration test with mocks only**

Create the test file around mocked dependencies:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../windows-tools', () => ({
  detectWindowsTools: vi.fn(() => ({
    tesseract: 'C:/mock/tesseract.exe',
    libreOffice: 'C:/mock/soffice.exe',
    pdftoppm: 'C:/mock/pdftoppm.exe',
  })),
  runWhitelistedCommand: vi.fn(),
}));

vi.mock('pdf-parse', () => ({ default: vi.fn() }));
vi.mock('mammoth', () => ({ extractRawText: vi.fn() }));
vi.mock('xlsx', () => ({ readFile: vi.fn(), utils: { sheet_to_json: vi.fn() } }));
```

Add the first assertion:

```ts
it('falls back from pdf text extraction to OCR when text is too short', async () => {
  vi.mocked(pdfParse).mockResolvedValue({ text: 'x' } as any);
  vi.mocked(ocrPdfFile).mockResolvedValue('姓名: 张三');
  const result = await extractFileContent({
    filePath: 'a.pdf',
    mimeType: 'application/pdf',
    originalFilename: 'a.pdf',
  });
  expect(result.rawText).toContain('姓名');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/file-extractors.test.ts`
Expected: FAIL because `file-extractors.ts` does not exist.

- [ ] **Step 3: Implement `ocr.ts` with required boundaries**

```ts
export type OcrOptions = {
  tools: WindowsToolPaths;
  maxPdfPages?: number;
  pageTimeoutMs?: number;
  fileTimeoutMs?: number;
  requestTimeoutMs?: number;
};

export async function ocrImageFile(filePath: string, options: OcrOptions): Promise<string> {}
export async function ocrPdfFile(filePath: string, options: OcrOptions): Promise<string> {}
```

Must include and keep testable via mocks:
- Tesseract command assembly
- `pdftoppm` page image generation
- max 20 OCR pages default
- single-page timeout
- single-file timeout
- request-level timeout passthrough
- stop remaining page OCR once enough text is collected
- temp file cleanup in `finally`

- [ ] **Step 4: Implement `file-extractors.ts` for image / PDF / docx branches first**

Required exported function:

```ts
export async function extractFileContent(input: {
  filePath: string;
  mimeType: string;
  originalFilename: string;
  tools?: WindowsToolPaths;
  requestTimeoutMs?: number;
}): Promise<NormalizedExtraction> {}
```

Implement these branches only in this step:
- image -> `ocrImageFile`
- pdf -> `pdf-parse`, fallback `ocrPdfFile`
- docx -> `mammoth.extractRawText`

Use only mocked libraries/commands in tests; no test should require real local tools.

- [ ] **Step 5: Add and pass tests for `.doc` / `.ppt` conversion branches**

Add explicit success-path tests for legacy Office files:

```ts
it('converts .doc through LibreOffice then reuses PDF extraction', async () => {
  // mock soffice conversion success + mocked PDF extraction result
});

it('converts .ppt through LibreOffice then reuses PDF extraction', async () => {
  // mock soffice conversion success + mocked PDF extraction result
});
```

Then implement the remaining branches:
- doc -> LibreOffice convert to pdf, then PDF flow
- xls/xlsx -> `xlsx`
- pptx -> `adm-zip`
- ppt -> LibreOffice convert to pdf, then PDF flow

- [ ] **Step 5: Add explicit structure assertions for Excel/PPT-style extraction output**

Add assertions that `xls/xlsx` and `pptx/ppt` branches return the full matcher input contract:

```ts
expect(result).toEqual(
  expect.objectContaining({
    rawText: expect.any(String),
    textBlocks: expect.any(Array),
    kvCandidates: expect.any(Array),
  }),
);
expect(result.textBlocks[0]).toEqual(expect.objectContaining({ sourceMeta: expect.any(Object) }));
```

For Excel, also assert at least one left/right or top/bottom `kvCandidate` is produced.
For PPT, also assert slide/shape metadata is preserved in `sourceMeta`.

- [ ] **Step 6: Rewrite `recognizer.ts` to orchestrate only**

New target shape:

```ts
export async function recognizeContent(filePath: string, mimeType: string, options: {
  originalFilename: string;
  collection: string;
  uploadOrder: number;
  collectionFields: Array<{ name: string; type: string }>;
}) {
  const extraction = await extractFileContent(...);
  return matchCollectionRules({
    collection: options.collection,
    collectionFields: options.collectionFields,
    extraction,
  });
}
```

- [ ] **Step 7: Add tests for missing tools and timeout behavior**

Examples:

```ts
await expect(extractFileContent({ filePath: 'a.doc', mimeType: 'application/msword', originalFilename: 'a.doc', tools: {} as any })).rejects.toThrow(/LibreOffice/);
await expect(extractFileContent({ filePath: 'a.png', mimeType: 'image/png', originalFilename: 'a.png', tools: {} as any })).rejects.toThrow(/Tesseract/);
await expect(ocrPdfFile('a.pdf', { tools, fileTimeoutMs: 1 })).rejects.toThrow(/timeout/i);
```

- [ ] **Step 8: Run the focused extractor test file to verify it passes**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/file-extractors.test.ts`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/server/ocr.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/file-extractors.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/file-extractors.test.ts

git commit -m "feat: add offline file extraction pipeline"
```

### Task 6: Rebuild the server action around the new offline pipeline

**Files:**
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts`
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts`

- [ ] **Step 1: Add a failing action contract test using `createMockServer`**

Follow the style of `packages/plugins/@nocobase/plugin-action-custom-request/src/server/__tests__/actions.test.ts`.

Test skeleton:

```ts
import { createMockServer } from '@nocobase/test';
import PluginSmartFormFillServer from '../plugin';

it('returns mappedValues, warnings, and errors for uploaded files', async () => {
  const app = await createMockServer({ registerActions: true, acl: true, plugins: ['users', 'auth', 'acl'] });
  app.pluginManager.add(PluginSmartFormFillServer);
  await app.load();

  const agent = app.agent();
  const user = await app.db.getRepository('users').findOne();
  await agent.login(user.id);

  const res = await agent
    .set('X-Role', 'admin')
    .post('/smartFormFill:recognize')
    .field('collection', 'material_submissions')
    .attach('files', Buffer.from('fake'), 'a.pdf');

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.data?.warnings || res.body.warnings)).toBe(true);
});
```

- [ ] **Step 2: Run the action contract test to verify it fails**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts`
Expected: FAIL against the current action response shape or missing helpers.

- [ ] **Step 3: Implement the minimal server action changes**

Update `plugin.ts` so the action:
- keeps `POST smartFormFill:recognize`
- receives multipart field `files`
- receives `collection`
- enforces exact limits: max 10 files, max 50MB per file
- loads collection metadata from the current app data source
- passes `collectionFields` and upload order into `recognizeContent`
- merges file results into final `mappedValues`
- ensures each `files[]` item contains at least:

```ts
{
  filename: string;
  textPreview: string;
  mappedValues: Record<string, any>;
}
```

- returns:

```ts
ctx.body = {
  files,
  mappedValues,
  unmatchedTextBlocks,
  warnings,
  errors,
};
```

Do not reintroduce manual `data: { ... }` wrapping.

- [ ] **Step 4: Add a test for missing collection and unknown collection**

Use the same mock server / agent flow. Assertions:

```ts
expect(res.status).toBe(400);
expect(String(res.body.errors?.[0]?.message || res.body.message)).toMatch(/collection/i);
```

and

```ts
expect(String(res.body.errors?.[0]?.message || res.body.message)).toMatch(/No rules configured/);
```

- [ ] **Step 5: Add a test for partial success across multiple files**

Use mocks for `recognizeContent` so one file succeeds and one fails. Assertions:

```ts
expect(body.files).toHaveLength(2);
expect(body.files[0]).toEqual(
  expect.objectContaining({
    filename: expect.any(String),
    textPreview: expect.any(String),
    mappedValues: expect.any(Object),
  }),
);
expect(body.errors).toContainEqual(expect.objectContaining({ filename: 'bad.ppt' }));
expect(body.mappedValues.applicant_name).toBe('张三');
```

- [ ] **Step 6: Run focused action tests to verify they pass**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts

git commit -m "feat: return offline smart fill action results"
```

### Task 7: Convert the client flow to auto-fill and summary feedback

**Files:**
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/client/SmartFormFillAction.tsx`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`

- [ ] **Step 1: Write the failing client auto-fill test with mocked NocoBase hooks**

Follow the mocking style used in `packages/plugins/@nocobase/plugin-auth/src/client/__tests__/ResetPasswordPage.test.tsx`.

Test skeleton:

```tsx
vi.mock('@nocobase/client', () => ({
  useAPIClient: vi.fn(() => ({ request: vi.fn() })),
  useActionContext: vi.fn(() => ({ form: mockForm })),
  useRecord: vi.fn(() => ({})),
}));

it('writes mappedValues to the current form and shows a summary', async () => {
  const mockForm = { values: {}, setValues: vi.fn(), setFieldValue: vi.fn() };
  vi.mocked(useAPIClient).mockReturnValue({
    request: vi.fn().mockResolvedValue({
      data: {
        data: {
          mappedValues: { applicant_name: '张三' },
          warnings: [],
          errors: [],
          files: [],
          unmatchedTextBlocks: [],
        },
      },
    }),
  } as any);

  render(<SmartFormFillActionButton title="Smart form fill" collection="material_submissions" />);
  // 通过 antd Upload 相关交互触发请求
  await waitFor(() => expect(mockForm.setValues).toHaveBeenCalled());
});
```

- [ ] **Step 2: Run the client test to verify it fails**

Run: `yarn test:client packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`
Expected: FAIL because the test file does not exist and the client still uses manual mapping.

- [ ] **Step 3: Remove manual-mapping state and implement auto-fill**

Required behavior in `SmartFormFillAction.tsx`:
- keep upload modal
- send `files` and `collection` in `FormData`
- read response with `const body = response.data?.data || response.data`
- first try `actionContext?.form?.setValues({ ...form.values, ...body.mappedValues })`
- if `setValues` is unavailable, fallback to `actionContext?.field?.form?.setFieldValue` loop or current form instance loop
- no DOM event fallback
- summary UI shows counts for filled fields, warnings, errors

Reference behavior to verify against:
- `packages/core/client/src/schema-component/antd/form/Form.tsx`
- `packages/core/client/src/schema-component/antd/form-v2/Form.tsx`
- `packages/core/client/src/flow/models/blocks/form/FormBlockModel.tsx`

- [ ] **Step 4: Add a test for response compatibility and fallback write path**

Example assertions:

```tsx
expect(mockForm.setFieldValue).toHaveBeenCalledWith('applicant_name', '张三');
expect(screen.getByText(/已自动填充/i)).toBeInTheDocument();
```

Also add a case where API returns `{ data: { mappedValues: ... } }` without the extra wrapper.

- [ ] **Step 5: Add a test for missing form instance error**

Mock `useActionContext` to return `{}` and assert:

```tsx
await waitFor(() => expect(screen.getByText(/Form not found/i)).toBeInTheDocument());
```

- [ ] **Step 6: Run focused client tests to verify they pass**

Run: `yarn test:client packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/client/SmartFormFillAction.tsx \
  packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx

git commit -m "feat: auto-fill forms from offline recognition"
```

### Task 8: Verify the whole plugin slice and clean up old paths

**Files:**
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts`
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/client/SmartFormFillAction.tsx`
- Modify: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts`
- Test: `packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`

- [ ] **Step 1: Remove dead cloud/manual-mapping code paths in a failing lint/test pass**

Examples to delete:

```ts
const BAIDU_OCR_API_KEY = process.env.BAIDU_OCR_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const [mappedValues, setMappedValues] = useState<Record<string, string>>({});
// manual Select-based field mapping UI
// DOM CustomEvent fallback for form filling
```

- [ ] **Step 2: Run all plugin-focused tests to catch breakage**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts && yarn test:client packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`
Expected: At least one FAIL until cleanup is complete.

- [ ] **Step 3: Apply minimal cleanup needed to make all focused tests pass**

Checklist:
- recognizer only orchestrates extract + match
- server action no longer logs cloud-config messages
- client no longer renders manual mapping cards/selects
- model no longer stores `fieldMappings`
- all unit tests rely on mocks for local tools; no real Tesseract/LibreOffice/pdftoppm required

- [ ] **Step 4: Run the full focused test command again**

Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts && yarn test:client packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`
Expected: PASS

- [ ] **Step 5: Run targeted lint on changed plugin files**

Run: `yarn eslint packages/plugins/@tlws/plugin-smart-form-fill/src/server/**/*.ts packages/plugins/@tlws/plugin-smart-form-fill/src/client/**/*.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/plugins/@tlws/plugin-smart-form-fill/src/server/recognizer.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/plugin.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/client/SmartFormFillAction.tsx \
  packages/plugins/@tlws/plugin-smart-form-fill/src/client/models/SmartFormFillActionModel.tsx \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts \
  packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx

git commit -m "refactor: finalize offline smart form fill flow"
```

## Final verification

- [ ] Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/windows-tools.test.ts`
- [ ] Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/file-extractors.test.ts`
- [ ] Run: `yarn test:server packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/rule-matcher.test.ts packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/text-normalizer.test.ts packages/plugins/@tlws/plugin-smart-form-fill/src/server/__tests__/plugin-action.test.ts`
- [ ] Run: `yarn test:client packages/plugins/@tlws/plugin-smart-form-fill/src/client/__tests__/SmartFormFillAction.test.tsx`
- [ ] Run: `yarn eslint packages/plugins/@tlws/plugin-smart-form-fill/src/server/**/*.ts packages/plugins/@tlws/plugin-smart-form-fill/src/client/**/*.tsx`
- [ ] Manually verify on Windows local NocoBase with one image, one text PDF, one scanned PDF, one docx, one doc, one xlsx, one pptx, one ppt
- [ ] Confirm action response is read via `res.data?.data || res.data`
- [ ] Confirm auto-fill writes only scalar fields and surfaces warnings/errors in summary UI
