# 🎮 Cocos Creator Skill

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.8.x-2f6fdf.svg)](https://www.cocos.com/)
[![COCOS 4](https://img.shields.io/badge/COCOS%204-MIT%20Open%20Source-16a34a.svg)](https://github.com/cocos/cocos4)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Open%20Standard-6c5ce7.svg)](https://agentskills.io/specification)
[![Platforms](https://img.shields.io/badge/Platforms-79%2B-orange.svg)](docs/platforms.md)

**面向 AI 编码助手的 Cocos Creator 3.8.x / COCOS 4 游戏开发技能包**

[English](README.md) · [简体中文](README.zh-CN.md) · [平台支持](docs/platforms.md) · [更新日志](CHANGELOG.md)

</div>

---

## 这是什么

一个遵循 [Agent Skills 开放标准](https://agentskills.io/specification) 的**技能包**，为 AI 编码助手注入 Cocos Creator 游戏开发的领域知识与工作流。

它不是一份"文档合集"，而是一套**可执行的工作流**：确认引擎版本 → 定位代码位置 → 写代码 → **必须验证** → 提交前自查。里面内置了防偷懒条目和危险信号清单，专门堵住 AI"看着对就交付"的退路。

**同一份 `SKILL.md` 无需任何改动，即可在 Claude Code、Codex CLI、DeepSeek Harness (dsh)、WorkBuddy、Cursor、GitHub Copilot、Gemini CLI、OpenClaw 等 [79 个平台](docs/platforms.md) 上使用。**

> **急着用？** 一条命令，然后重启你的 Agent：
>
> ```bash
> npx skills add hsiaozzz/cocos-creator-skill --all
> ```

---

## 目录

- [安装](#安装)
  - [第 0 步 —— 选一种方式](#第-0-步--选一种方式)
  - [方式一 —— 官方 skills CLI](#方式一--官方-skills-cli推荐)
  - [方式二 —— 本仓库安装器](#方式二--本仓库安装器覆盖-dsh--workbuddy)
  - [方式三 —— 手动复制](#方式三--手动复制)
- [装完怎么验证](#装完怎么验证)
- [工程级 vs 用户级](#工程级-vs-用户级)
- [升级与卸载](#升级与卸载)
- [它覆盖什么](#它覆盖什么)
- [技能结构](#技能结构)
- [内置工程体检工具](#内置工程体检工具)
- [安装问题排查](#安装问题排查)
- [参与贡献](#参与贡献) · [开源协议](#开源协议)

---

## 安装

### 第 0 步 —— 选一种方式

| | 方式 | 一条命令 | 覆盖范围 | 依赖 |
|---|---|---|---|---|
| **一** | 官方 `skills` CLI | `npx skills add hsiaozzz/cocos-creator-skill --all` | 79 个平台，自动检测本机已装 | Node.js 18+ |
| **二** | 本仓库 `install.mjs` | `node install.mjs --agent dsh,workbuddy` | 25 个平台，**含 dsh / WorkBuddy** | Node.js 18+、git |
| **三** | 手动复制 | `cp -r skills/cocos-creator ~/.agents/skills/` | 你指向哪个平台就是哪个 | git（或直接下载 ZIP） |

**怎么选？**

- **只想开箱即用** → 方式一。
- **你在用 DeepSeek Harness (dsh) 或 WorkBuddy** → 方式二（或方式三）。官方 CLI 的 agent 列表里**没有 dsh 和 workbuddy 条目**。
- **本机没有 npm、离线内网** → 方式三。
- **只想给某一个工程用** → 任意方式，然后改用工程级参数（不加 `-g` / 用 `--project` / 直接拷进工程目录）。见 [工程级 vs 用户级](#工程级-vs-用户级)。

<details>
<summary>依赖要求明细</summary>

| 依赖 | 谁需要它 | 说明 |
|---|---|---|
| **Node.js 18+** | 方式一、方式二 | **只是用来跑安装器**。技能本身是纯 Markdown，不依赖任何运行时。 |
| **git** | 方式二、方式三 | 方式三也可以直接下载仓库 ZIP 解压，不需要 git。 |
| **Python 3.8+** | *可选* | 仅 `scripts/cocos_doctor.py`（工程体检）需要。不装 Python 不影响技能使用。 |
| **Cocos Creator 编辑器 / `cocos-cli`** | *可选* | 只有在需要命令行构建时才用到。 |

检查 Node 版本：

```bash
node -v          # 需要输出 v18.x 或更高
```
</details>

---

### 方式一 —— 官方 `skills` CLI（推荐）

[vercel-labs/skills](https://github.com/vercel-labs/skills) 的 `skills` CLI 是跨平台安装器，内置 **79 个 Agent** 的技能目录映射，并会自动检测你本机装了哪些。

**装到本机所有已检测到的 Agent（用户级，无交互）：**

```bash
npx skills add hsiaozzz/cocos-creator-skill --all
```

`--all` 等价于 `--skill '*' --agent '*' -y`。带 `-y` 会跳过交互提示并自动判定范围（在工程目录内则工程级，否则用户级）。

**只装到指定平台：**

```bash
# 单个平台
npx skills add hsiaozzz/cocos-creator-skill -a claude-code

# 多个平台（重复该参数）
npx skills add hsiaozzz/cocos-creator-skill -a claude-code -a codex -a cursor
```

**强制装到用户级，让本机所有工程都能用：**

```bash
npx skills add hsiaozzz/cocos-creator-skill --all -g
```

**这个 CLI 还有几个好用的子命令：**

```bash
# 只看仓库里有什么技能，不安装任何东西
npx skills add hsiaozzz/cocos-creator-skill --list

# 不安装，直接生成一段可粘贴的调用提示词
npx skills use hsiaozzz/cocos-creator-skill@cocos-creator

# 查看当前已安装的技能
npx skills list          # 工程级
npx skills list -g       # 用户级
```

**`add` 完整参数表：**

| 参数 | 短写 | 作用 |
|---|---|---|
| `--global` | `-g` | 装到用户级（所有工程可用），而非工程级 |
| `--agent <agents>` | `-a` | 指定目标平台；`*` 表示全部；可重复 |
| `--skill <skills>` | `-s` | 指定技能名；`*` 表示全部 |
| `--list` | `-l` | 只列出仓库内的技能，不安装 |
| `--yes` | `-y` | 跳过确认与范围选择提示 |
| `--all` | | `--skill '*' --agent '*' -y` 的简写 |
| `--copy` | | 复制文件，而非软链接到各平台目录 |
| `--subagent <names>` | | 装到 Eve 子 Agent（`root` 表示根 Agent） |
| `--full-depth` | | 即使根目录已有 `SKILL.md` 也递归搜索所有子目录 |

> **关于 `-a` 的取值**：它用的是 CLI 自己的平台 key，例如 `claude-code`、`codex`、`cursor`、`gemini-cli`、`github-copilot`、`openclaw`、`trae`、`qoder`、`qwen-code`、`lingma`、`windsurf`、`amp`、`cline`、`kilo`、`opencode`、`zed`、`warp` 等。权威列表见上游 [src/agents.ts](https://github.com/vercel-labs/skills/blob/main/src/agents.ts)。不确定就直接用 `-a '*'`，交给自动检测。

> **`npx` 不是笔误** —— 它免全局安装直接运行该包。如果经常用，可以 `npm i -g skills`，之后直接用 `skills` 命令。

---

### 方式二 —— 本仓库安装器（覆盖 dsh / WorkBuddy）

官方 CLI 的 agent 列表里**没有 DeepSeek Harness (dsh) 和 workbuddy 条目**，所以本仓库自带一个零依赖安装器补位，同时内置另外 23 个平台的正确路径。如果你在用 dsh 或 WorkBuddy，或者内网环境需要完全本地安装，用这个。

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill
```

**第一步 —— 看支持哪些平台，以及本机已装了哪些：**

```bash
node install.mjs --list
```

它会列出每个登记平台的工程级 / 用户级目标路径，并在本机检测到的平台后面标注 `(已检测到)`。

**第二步 —— 安装：**

```bash
# 一次装好四个最常用的平台
node install.mjs --agent claude-code,codex,dsh,workbuddy

# 只装 dsh
node install.mjs --agent dsh

# 装到本机检测到的所有平台
node install.mjs --all

# 装进指定工程，而不是用户目录
node install.mjs --agent dsh --project ./my-cocos-game
```

**先预览再落盘**（首次使用建议加）：

```bash
node install.mjs --all --dry-run
```

**完整参数表：**

| 参数 | 短写 | 作用 |
|---|---|---|
| `--list` | `-l` | 列出所有支持的平台、目标路径与本机检测结果 |
| `--agent <names>` | `-a` | 目标平台，逗号分隔，可重复 |
| `--all` | | 装到本机**检测到**的所有平台 |
| `--project [dir]` | `-p` | 装到工程级目录 `dir`（默认当前目录） |
| `--link` | | 用软链接代替复制（Windows 需开发者模式 / 管理员权限） |
| `--copy` | | 强制复制 —— 这是默认值，为 Windows 兼容性而选 |
| `--dry-run` | | 只显示将执行的操作，不落盘 |
| `--force` | `-f` | 覆盖已存在的同名技能目录 |
| `--help` | `-h` | 显示帮助 |

**几个值得知道的行为：**

- **默认复制而非软链接** —— Windows 用户不需要开启开发者模式就能装成功。想要"改一处全部生效"就加 `--link`。
- **已存在则跳过**，不会覆盖。要原地升级加 `--force`。
- **有目标失败时退出码为 1**，可以直接用在脚本和 CI 里。
- 已登记平台：`universal`、`claude-code`、`codex`、`dsh`、`workbuddy`、`openclaw`、`cursor`、`github-copilot`、`gemini-cli`、`amp`、`cline`、`opencode`、`windsurf`、`kiro-cli`、`roo`、`kilo`、`trae`、`qoder`、`qwen-code`、`kimi-code-cli`、`iflow-cli`、`lingma`、`goose`、`junie`、`github-skills`。

---

### 方式三 —— 手动复制

不需要 npm、不需要 Node，只要有文件。想在落盘前先看清到底写了什么，也用这个方式。

**克隆仓库：**

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill
```

**方案 A —— 装到通用目录（一次覆盖多数平台）**

`~/.agents/skills/` 被一大批平台读取：**Amp、Cline、Cursor（工程级）、GitHub Copilot、Gemini CLI、Kilo Code、OpenCode、Warp、Zed、Kimi Code CLI** 等，此外 **DeepSeek Harness 也会把 `~/.agents/skills` 作为回退路径扫描**。装这一个目录，你的多数工具就都覆盖到了。

*macOS / Linux / Git Bash：*

```bash
mkdir -p ~/.agents/skills
cp -r skills/cocos-creator ~/.agents/skills/
```

*Windows PowerShell：*

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.agents\skills" | Out-Null
Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.agents\skills\"
```

**方案 B —— 装到具体平台的专属目录**

*macOS / Linux / Git Bash：*

```bash
# Claude Code
mkdir -p ~/.claude/skills && cp -r skills/cocos-creator ~/.claude/skills/

# Codex CLI（识别 $CODEX_HOME）
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills" && cp -r skills/cocos-creator "${CODEX_HOME:-$HOME/.codex}/skills/"

# DeepSeek Harness (dsh)（识别 $DSH_HOME）
mkdir -p "${DSH_HOME:-$HOME/.dsh}/skills" && cp -r skills/cocos-creator "${DSH_HOME:-$HOME/.dsh}/skills/"

# WorkBuddy
mkdir -p ~/.workbuddy/skills && cp -r skills/cocos-creator ~/.workbuddy/skills/

# OpenClaw
mkdir -p ~/.openclaw/skills && cp -r skills/cocos-creator ~/.openclaw/skills/
```

*Windows PowerShell：*

```powershell
# Claude Code
Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.claude\skills\"
# Codex CLI
Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.codex\skills\"
# DeepSeek Harness (dsh)
Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.dsh\skills\"
# WorkBuddy
Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.workbuddy\skills\"
```

**方案 C —— 工程级（提交进仓库，团队共享）**

把技能拷进你的游戏工程并提交。团队里用同一个 Agent 的人就都遵循同一套 Cocos 规范：

```bash
cd /path/to/your-cocos-game
mkdir -p .agents/skills
cp -r /path/to/cocos-creator-skill/skills/cocos-creator .agents/skills/
```

**平台路径对照表：**

| 平台 | 工程级目录 | 用户级目录 | 备注 |
|---|---|---|---|
| **通用** | `.agents/skills` | `~/.agents/skills` | 覆盖绝大多数平台，优先装这里 |
| **Claude Code** | `.claude/skills` | `~/.claude/skills` | 可用 `CLAUDE_CONFIG_DIR` 覆盖 |
| **Codex CLI** | `.agents/skills` | `~/.codex/skills` | 可用 `CODEX_HOME` 覆盖 |
| **DeepSeek Harness (dsh)** | `.dsh/skills` · `.agents/skills` | `$DSH_HOME/skills`（默认 `~/.dsh/skills`）· `~/.agents/skills` | 可用 `DSH_HOME` 覆盖；另支持 `customSkillDirs` |
| **WorkBuddy** | `.workbuddy/skills` | `~/.workbuddy/skills` | 目录名必须与 frontmatter 的 `name` 一致（`cocos-creator`） |
| **OpenClaw** | `skills` | `~/.openclaw/skills` | 旧目录 `~/.clawdbot`、`~/.moltbot` 仍兼容 |
| **Cursor** | `.agents/skills` | `~/.cursor/skills` | — |
| **GitHub Copilot** | `.agents/skills` | `~/.copilot/skills` | VS Code 也会读 `.github/skills` |
| **Gemini CLI** | `.agents/skills` | `~/.gemini/skills` | Antigravity 读 `~/.gemini/antigravity/skills` |
| **Cline** | `.agents/skills` | `~/.agents/skills` | — |
| **Kilo Code** | `.agents/skills` | `~/.kilo/skills` | 旧目录 `~/.kilocode` 兼容 |
| **OpenCode** | `.agents/skills` | `~/.config/opencode/skills` | — |
| **Windsurf** | `.windsurf/skills` | `~/.codeium/windsurf/skills` | — |
| **Kiro CLI** | `.kiro/skills` | `~/.kiro/skills` | — |
| **Roo Code** | `.roo/skills` | `~/.roo/skills` | — |
| **Trae / Trae CN** | `.trae/skills` | `~/.trae/skills` · `~/.trae-cn/skills` | — |
| **Qoder / Qoder CN** | `.qoder/skills` | `~/.qoder/skills` · `~/.qoder-cn/skills` | — |
| **通义灵码 Lingma** | `.lingma/skills` | `~/.lingma/skills` | — |
| **Qwen Code** | `.qwen/skills` | `~/.qwen/skills` | — |
| **iFlow CLI** | `.iflow/skills` | `~/.iflow/skills` | — |
| **Goose** | `.goose/skills` | `~/.config/goose/skills` | — |
| **Junie** | `.junie/skills` | `~/.junie/skills` | — |
| **Warp** | `.agents/skills` | `~/.agents/skills` | — |
| **Zed** | `.agents/skills` | `~/.agents/skills` | — |
| **Droid (Factory)** | `.agents/skills` | `~/.factory/skills` | — |

> Windows 下把 `~` 展开为 `C:\Users\<你的用户名>`。多数平台支持 `$XDG_CONFIG_HOME`，如果你设了它，`~/.config` 开头的路径要相应变更。

> **结构比位置更重要。** 无论选哪个目录，文件都必须落在 `<技能目录>/cocos-creator/SKILL.md`。**多套一层目录（`.../cocos-creator/cocos-creator/SKILL.md`）是技能静默不生效的头号原因。**

---

## 装完怎么验证

**1. 确认文件落到了预期位置。** 三种方式各自的检查命令：

```bash
npx skills list -g                    # 方式一（用户级；工程级去掉 -g）
node install.mjs --list               # 方式二 —— 会打印各平台的检测状态
ls ~/.agents/skills/cocos-creator/    # 方式三
```

预期结果 —— 技能目录内容为：

```
cocos-creator/
├── SKILL.md
├── references/          （7 个文件）
├── scripts/cocos_doctor.py
└── assets/templates/
```

**2. 确认入口文件正确。** 这一条能揪出几乎所有的坏安装：

```bash
head -3 ~/.agents/skills/cocos-creator/SKILL.md
```

输出必须是：

```
---
name: cocos-creator
description: "Cocos Creator 3.8.x …
```

`---` 必须就在第一行（前面不能有空行，也不能有 BOM），且 `name:` 必须是 `cocos-creator`。

**3. 重启对应的 Agent。** 多数平台只在启动时扫描技能目录 —— 重载窗口或新开会话。dsh 的话新开会话即可，它会监视目录并热加载 `SKILL.md` 的变化。

**4. 用真实提问试探。** 说一句能命中技能 `description` 的话：

```
用 Cocos Creator 写一个玩家移动控制器，并说明我会踩哪些坑。
```

也可以直接问 Agent"你有哪些可用技能"；在 dsh 里还能用 `/cocos-creator` 手动强制加载。

**装成功的表现是**：Agent 在写代码**之前**先问你引擎版本，然后给代码，最后要求做验证。如果它二话不说直接吐一段代码、也不问版本，那就是技能没加载。

**如果没触发，按这个顺序排查：**

1. 文件是否就在 `<技能目录>/cocos-creator/SKILL.md` —— 只允许一层，不能重复嵌套？
2. 目录名是否严格是 `cocos-creator`（必须与 frontmatter 的 `name` 一致）？
3. `SKILL.md` 是否第一行就是 `---`，且 `name` 与 `description` 都在？
4. `description` 里如果有"冒号 + 空格"，是否用引号包住了？（dsh 会**静默丢弃**这种 frontmatter —— 不报错，技能列表直接是空的。）
5. 是否重启了 Agent 或新开了会话？
6. 范围是否对得上 —— 你装的是用户级，而 Agent 读的是工程级（或反过来）？

---

## 工程级 vs 用户级

| | 工程级 | 用户级 |
|---|---|---|
| 位置 | 游戏工程目录下的对应子目录 | 用户主目录下的对应子目录 |
| 生效范围 | 仅该工程 | 本机所有工程 |
| 是否提交进 git | 是 —— 团队共享同一份 | 否 —— 只在本机 |
| 适用场景 | 团队想统一 Cocos 开发规范 | 个人在多个工程做 Cocos 开发 |

各方式的切换写法：

```bash
npx skills add hsiaozzz/cocos-creator-skill --all -g        # 方式一：-g 是用户级（默认是工程级）
node install.mjs --all --project .                           # 方式二：--project 是工程级（默认是用户级）
cp -r skills/cocos-creator .agents/skills/                   # 方式三：取决于你拷到哪里
```

个人使用建议装**用户级**，一次安装到处可用。团队协作则把工程级那份提交进游戏仓库，让所有人的 Agent 都给出同一套规范。

---

## 升级与卸载

**升级** —— 仓库是唯一源头，重新安装即可刷新：

```bash
npx skills update -g                     # 方式一（用户级）；工程级用 -p
node install.mjs --all --force            # 方式二：--force 原地覆盖
```

如果你是用 `--link` / 软链接装的，更新克隆下来的仓库就够了，无需重新安装。

**卸载：**

```bash
npx skills remove -g -y                  # 方式一（用户级）；想明确指定可加 -s cocos-creator
rm -rf ~/.agents/skills/cocos-creator    # 方式三（路径换成你实际安装的位置）
```

删掉 `cocos-creator` 文件夹总是足够的，也不会影响其他任何东西 —— 该目录之外没有任何注册项。

---

## 它覆盖什么

| 能力 | 说明 |
|---|---|
| **版本判定** | 先区分 2.x / 3.x / COCOS 4，避免给出你引擎上不存在的 API |
| **脚本开发** | TypeScript 组件、生命周期、`@ccclass` / `@property` 装饰器 |
| **节点与组件** | 查找、层级、实例化、组件缓存 |
| **事件系统** | 注册与反注册配对，防止场景切换后的内存泄漏 |
| **动画** | `Animation` 组件与 `tween` 补间 |
| **物理** | 刚体、碰撞、碰撞回调 |
| **UI** | Label / Sprite / Button / Widget / Layout 与多分辨率适配 |
| **资源管理** | `resources.load`、AssetBundle、引用计数释放、对象池 |
| **性能优化** | DrawCall 与合批、GC 抖动、包体与首屏加载 —— 带量化目标 |
| **多平台发布** | 微信 / 抖音小游戏分包、H5、iOS、Android、HarmonyOS Next |
| **COCOS 4 迁移** | 3.8 → COCOS 4 流程、`cocos-cli` / Headless 构建、AI-Native 变化 |

---

## 技能结构

```
skills/cocos-creator/
├── SKILL.md                    # 入口与路由：核心工作流 + 速查表（< 500 行）
├── references/                 # 按需加载，不占初始上下文
│   ├── api-quick-ref.md        # API 速查
│   ├── examples.md             # 完整可运行示例
│   ├── best-practices.md       # 架构与规范
│   ├── performance.md          # 性能优化量化指南
│   ├── publishing.md           # 多平台构建发布
│   ├── troubleshooting.md      # 问题排查手册
│   └── cocos4-migration.md     # 3.8 → COCOS 4 迁移
├── scripts/
│   └── cocos_doctor.py         # 工程体检（零依赖）
└── assets/templates/           # 组件模板
```

**渐进式披露**：`SKILL.md` 只放核心流程与路由表，详细内容按需从 `references/` 读取，避免一次性占满模型的上下文窗口。

---

## 内置工程体检工具

一个零依赖的 Python 脚本，用来体检真实的 Cocos 工程：

```bash
python skills/cocos-creator/scripts/cocos_doctor.py --project /path/to/your-game
```

检查项：

- 资源缺失 `.meta`（会导致构建时引用丢失）
- 孤儿 `.meta`（源文件已删除但 `.meta` 残留）
- `assets/resources` 体积过大（首屏加载风险 —— 该目录内容会被打包）
- 单文件超阈值（包体风险）
- 2.x 老式 API 残留（`cc.Class` / `cc.Node` / `cc.director`）
- 注册了事件但看不到反注册的脚本（内存泄漏风险）

加 `--json` 输出机器可读结果。存在 ERROR 级问题时退出码为 `1`，可直接接入 CI。

已在真实工程上验证过 —— 实际抓到过 3.4MB 的 `map120.prefab` 包体风险，以及 `cc.Node.prototype` 老 API 残留。

---

## 安装问题排查

| 症状 | 原因 | 修复 |
|---|---|---|
| Agent 从不提到该技能 | 多套了一层目录 | 必须严格是 `<技能目录>/cocos-creator/SKILL.md` |
| Agent 从不提到该技能 | 目录被改名 | 目录名必须等于 frontmatter 的 `name` → `cocos-creator` |
| Agent 从不提到该技能 | 没重启 | 重启 Agent / 新开会话 |
| dsh：技能列表空的，且毫无报错 | `description` 里的 `:` 没有加引号 | 用引号包裹该值；dsh 会**静默丢弃**解析失败的 frontmatter |
| frontmatter 解析不出来 | 文件开头有空行或 BOM | `---` 必须是第 1 行，逐字节对齐 |
| `npx skills` 装不到 dsh / WorkBuddy | 它的 agent 列表里没有这两个条目 | 用方式二或方式三 |
| Windows 下软链接创建失败 | 未开启开发者模式 | 用 `--copy`，或使用 `install.mjs` 的默认行为 |
| 范围装错了 | 装到了用户级，Agent 却读工程级 | 见 [工程级 vs 用户级](#工程级-vs-用户级) |
| `node install.mjs` 报找不到源目录 | 在仓库外运行了 | 先 `cd` 进克隆下来的仓库根目录 |

---

## 参与贡献

欢迎提 Issue 与 PR。修正事实性错误、补充新版本 API、新增平台支持都很有价值 —— 详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 开源协议

MIT License —— 详见 [LICENSE](LICENSE)
