# Changelog

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 与 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式。

## [2.0.1] - 2026-09-11

> 本次为仓库文档级变更，**技能内容（`SKILL.md` 与 `references/`）没有改动**，技能自身的 `metadata.version` 仍为 `2.0.0`。

### 变更

- **README 拆分为中英两份独立文件**：`README.md`（英文）与 `README.zh-CN.md`（简体中文），两份均以顶部语言切换链接互相指向，结构与内容对齐。此前四种语言塞在同一个文件里，安装说明被压缩成几行片段。
- **安装说明大幅扩写**：三种安装方式各自给出完整参数表、可复制的分平台命令（macOS / Linux / Git Bash 与 Windows PowerShell 双份）、工程级 / 用户级的切换写法、装完的四步验证流程、升级与卸载命令，以及一张「症状 → 原因 → 修复」的排查表。
- **修正夸大的平台数量**：此前文中称官方 `skills` CLI 支持「100+ 平台」，实测上游 `src/agents.ts` 为 **79 个**（上游 README 亦自述 "…and 75 more"）。已按实测值修正 `README.md`、`docs/platforms.md`、`install.mjs` 与徽章。
- 移除原 README 中日文 / 韩文段落（内容为摘要的翻译，维护成本高于价值）。

### 新增

- **CI 新增双语 README 校验**：检查两份 README 均存在、互相包含语言切换链接、且都含完整安装章节，防止后续改动只更新一半。
- **`README.zh-CN.md` 纳入根目录 Markdown 白名单**，否则 CI 会将其判为散装文档。

## [2.0.0] - 2026-09-11

一次面向「AI Agent 生态」的全面重构。核心变更是**让技能真正可被安装**。

### 修复

- **修复技能无法被任何平台识别的问题**。此前 `SKILL.md` 直接放在仓库根目录，且**没有 YAML frontmatter**。Claude Code、Codex CLI、dsh、WorkBuddy、Cursor 等所有遵循 Agent Skills 标准的平台都要求 `skills/<name>/SKILL.md` 且带 `name` / `description` 元数据 —— 旧结构下这份技能实际上从未被正确加载过。
- 修复 README 中引用不存在的 `cocos-creator/` 目录的安装说明。
- 修复 README 中过期的 `~/.qclaw/skills` 路径（OpenClaw 现用 `~/.openclaw/skills`）。

### 新增

- **多平台支持**：新增 `install.mjs` 跨平台安装器（零依赖，Node 18+），内置 25 个平台的目录映射，并**特别覆盖 `npx skills` 尚未收录的 DeepSeek Harness (dsh) 与 WorkBuddy**。
- **`docs/platforms.md`**：平台目录对照表，说明 `.agents/skills` 这一被数十个平台共用的通用目录。
- **`references/performance.md`**：性能优化量化指南（DrawCall 与合批、内存与 GC、对象池、包体与首屏加载、优化优先级排序）。
- **`references/publishing.md`**：多平台构建发布清单（微信 / 抖音小游戏分包、H5、iOS、Android、HarmonyOS Next）。
- **`references/cocos4-migration.md`**：3.8 → COCOS 4 迁移参考。**COCOS 4 于 2026 年 1 月以 MIT 许可完全开源**，本文件覆盖迁移流程、`cocos-cli` / Headless 构建的变化，以及官方 AI-Native 路线对使用 AI 编码工具的实际影响。
- **`scripts/cocos_doctor.py`**：工程体检工具，检查缺失 / 孤儿 `.meta`、超大资源、`assets/resources` 体积、2.x 老 API 残留、疑似事件监听泄漏。支持 `--json` 便于接入 CI。
- **`assets/templates/Component.ts.tmpl`**：符合本项目规范的组件模板。
- **`AGENTS.md`**：给在本仓库工作的 AI 编码助手提供上下文（被 Codex、OpenCode、Amp、Cursor 等自动读取）。
- **CI 校验**（`.github/workflows/validate.yml`）：校验 frontmatter 合规性、技能结构、安装器可用性，并在真实最小工程上验证体检脚本的检出能力与「目录 `.meta` 不误报」行为。
- **`CONTRIBUTING.md`** 与 **`.gitignore`**。

### 变更

- **结构调整为开放标准布局**：`SKILL.md` 与参考文档迁入 `skills/cocos-creator/`，长文档移入 `references/` 以符合**渐进式披露**原则（`SKILL.md` 从 297 行重构为 258 行，只保留核心工作流与路由表）。
- **`SKILL.md` 重写为可执行工作流**：从"知识罗列"改为「第 0 步确认版本 → 第 1 步定位代码 → 第 2 步写代码 → 第 3 步必须验证 → 第 4 步自查陷阱」，并新增「反合理化」条目与「危险信号」清单，堵住 AI 跳过验证的退路。
- 补充 `metadata`（作者、版本、适用引擎版本）与 `compatibility` 字段。
- README 重写：新增多语言安装说明、平台支持矩阵、内置工具说明。

### 修正的技术内容

- 修正原 `SKILL.md` 中关于 `Node.position` 用法的示例（`position` 返回引擎内部复用对象，原示例的链式 `add` 写法会误导）。
- 补充 `assets/resources/` 是唯一支持 `resources.load()` 按路径加载的目录这一硬约束。
- 补充 `.meta` 文件必须与资源一起提交的硬约束。
- 版本说明从「3.8」扩展为 2.x / 3.8.x / COCOS 4 三档判定表。

## [1.0.0] - 2024

- 初始版本。面向 OpenClaw 的 Cocos Creator 3.8 技能，含 `SKILL.md` 与四份参考文档。
