# AGENTS.md

本文件给在本仓库工作的 AI 编码助手提供上下文。它遵循 AGENTS.md 开放格式，被 Codex CLI、OpenCode、Amp、Cursor、Zed 等工具自动读取。

## 这个仓库是什么

一个 **Agent Skill 包**（技能包），不是应用程序。发布物是 `skills/cocos-creator/` 目录，它会被安装到各 AI Agent 平台的 skills 目录中，供 AI 在回答 Cocos Creator 相关问题时加载。

**没有构建步骤，没有依赖，没有测试框架。** 产物就是 Markdown 与少量脚本。

## 目录结构与职责

```
skills/cocos-creator/
├── SKILL.md                 # 技能入口。含 YAML frontmatter，必须是文件第一行 `---` 开始
├── references/*.md          # 深度内容，被 SKILL.md 按需引用（渐进式披露）
├── scripts/cocos_doctor.py  # 工程体检脚本，零第三方依赖
└── assets/templates/        # 代码模板
install.mjs                  # 跨平台安装器，零依赖，Node 18+
docs/platforms.md            # 各平台技能目录对照
.github/workflows/validate.yml  # CI：校验 frontmatter 与结构
```

## 硬性规则

### 1. 不要修改 `SKILL.md` 的 frontmatter 结构

```yaml
---
name: cocos-creator          # 必须与父目录名 skills/cocos-creator 完全一致
description: "..."           # 1-1024 字符，含冒号时必须用引号包裹
license: MIT
---
```

- `name` 必须是小写字母、数字、连字符；不能以连字符开头/结尾；不能有连续连字符；**必须等于父目录名**。
- `description` 里**不能出现未转义的冒号**，否则 YAML 解析静默失败，技能不会被加载。
- frontmatter 必须从文件**第一行**的 `---` 开始，前面不能有任何空行或 BOM。

### 2. `SKILL.md` 保持精简

- 上限 500 行。超了就把内容拆到 `references/` 并在路由表里登记。
- `SKILL.md` 是**入口与路由**，不是知识库。深度内容一律放 `references/`。

### 3. 引用文件用相对路径，且只一层深

```markdown
正确：[references/api-quick-ref.md](references/api-quick-ref.md)
避免：references/sub/dir/deep.md（不要形成多级引用链）
```

### 4. 新增 `references/` 文件必须登记到路由表

`SKILL.md` 里的「渐进式参考索引」表格必须同步更新，否则该文件永远不会被加载。

### 5. `scripts/` 下的脚本必须零第三方依赖

只允许 Python 标准库或 Node 内置模块。技能会被安装到用户机器上裸跑，不能要求 `pip install`。

### 6. 不要写入"看起来对但无法验证"的技术断言

本技能包的价值在于**准确性**。凡是引擎版本相关的行为差异，必须：

- 用真实工程验证过，或
- 引用官方文档 / 官方仓库，或
- 明确标注"以官方文档为准"

不确定的内容宁可删掉，也不要写成确定语气。

## 修改后的验证清单

```bash
# 1) frontmatter 与结构校验（CI 也会跑）
node .github/scripts/validate-skills.mjs

# 2) 安装器可用性
node install.mjs --list
node install.mjs --agent workbuddy --project /tmp/ccs-test && ls /tmp/ccs-test/.workbuddy/skills/

# 3) 体检脚本在真实工程上能跑通
python skills/cocos-creator/scripts/cocos_doctor.py --project /path/to/a/real/cocos/project
```

**不要提交未在真实 Cocos 工程上验证过的体检脚本改动。** 已知真实陷阱：

- Cocos 的**目录**也有 `.meta` 文件 —— 检查孤儿 `.meta` 时必须同时判断文件和目录，否则会大量误报。
- Creator 3.x 的版本号在 `package.json` 的 `creator.version`，**不在** `project.json`（那是 2.x 的位置）。

## 常见任务怎么做

| 任务 | 做法 |
|---|---|
| 修正技术错误 | 直接改对应文件，并说明依据（官方文档链接或实测） |
| 新增参考文档 | 建 `references/xxx.md` → 更新 `SKILL.md` 路由表 |
| 新增平台支持 | 改 `install.mjs` 的 `AGENTS` 表 → 同步 `docs/platforms.md` |
| 补充示例代码 | 放 `references/examples.md`，保持可直接复制运行 |

## 提交信息

用 Conventional Commits：

```
feat: 新增 COCOS 4 迁移参考文档
fix(scripts): 修正目录 .meta 被误判为孤儿的问题
docs: 补充 dsh 平台安装路径
```

## 不要做的事

- ❌ 不要在仓库根目录放 `SKILL.md`（历史上犯过这个错：`npx skills add` 与所有平台都找不到它）
- ❌ 不要新增根目录的散装 `.md`（除了 `README.md` / `CHANGELOG.md` / `CONTRIBUTING.md` / `AGENTS.md`）
- ❌ 不要引入构建工具链或 npm 依赖
- ❌ 不要为了"看起来完整"而堆砌未经核实的内容
