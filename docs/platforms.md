# 平台支持与技能目录对照

本技能遵循 [Agent Skills 开放标准](https://agentskills.io/specification)（Anthropic 发起，已被 Claude Code、Codex、Cursor、Gemini CLI、VS Code、GitHub Copilot、Kiro 等 40+ 产品采纳）。**同一份 `SKILL.md` 无需改动即可在所有兼容平台上使用。**

## 一、先理解一件事：多数平台共用同一个目录

这是最容易被忽略、也最能省事的结构：

```
.agents/skills/<skill-name>/SKILL.md      # 工程级
~/.agents/skills/<skill-name>/SKILL.md    # 用户级
```

**Amp、Cline、Cursor（工程级）、GitHub Copilot、Gemini CLI、Kilo Code、OpenCode、Warp、Zed、Kimi Code CLI、Deepto、Loaf、Sarvam Code 等一大批平台都读这个路径。**

也就是说：**把它装到 `~/.agents/skills/`，就一次性覆盖了上面所有这些平台**，不用逐个平台复制。

少数平台有自己的专属目录（Claude Code、dsh、WorkBuddy 等），需要单独安装。

## 二、重点平台对照表

| 平台 | 工程级目录 | 用户级目录 | 备注 |
|---|---|---|---|
| **通用** | `.agents/skills` | `~/.agents/skills` | 覆盖绝大多数平台，优先装这里 |
| **Claude Code** | `.claude/skills` | `~/.claude/skills` | 可用 `CLAUDE_CONFIG_DIR` 覆盖 |
| **Codex CLI** | `.agents/skills` | `~/.codex/skills` | 工程级读通用目录；可用 `CODEX_HOME` 覆盖 |
| **DeepSeek Harness (dsh)** | `.dsh/skills` / `.agents/skills` | `$DSH_HOME/skills` | 可用 `DSH_HOME` 覆盖；另支持自定义 `customSkillDirs` |
| **WorkBuddy** | `.workbuddy/skills` | `~/.workbuddy/skills` | 也可通过技能市场或对话安装 |
| **OpenClaw** | `skills` | `~/.openclaw/skills` | 旧目录 `~/.clawdbot`、`~/.moltbot` 亦兼容 |
| **Cursor** | `.agents/skills` | `~/.cursor/skills` | — |
| **GitHub Copilot** | `.agents/skills` | `~/.copilot/skills` | VS Code 亦读 `.github/skills` |
| **Gemini CLI** | `.agents/skills` | `~/.gemini/skills` | Antigravity 读 `~/.gemini/antigravity/skills` |
| **Cline** | `.agents/skills` | `~/.agents/skills` | — |
| **Kilo Code** | `.agents/skills` | `~/.kilo/skills` | 旧目录 `~/.kilocode` 兼容 |
| **OpenCode** | `.agents/skills` | `~/.config/opencode/skills` | — |
| **Windsurf** | `.windsurf/skills` | `~/.codeium/windsurf/skills` | — |
| **Kiro CLI** | `.kiro/skills` | `~/.kiro/skills` | — |
| **Roo Code** | `.roo/skills` | `~/.roo/skills` | — |
| **Trae / Trae CN** | `.trae/skills` | `~/.trae/skills` / `~/.trae-cn/skills` | — |
| **Qoder / Qoder CN** | `.qoder/skills` | `~/.qoder/skills` / `~/.qoder-cn/skills` | — |
| **通义灵码 Lingma** | `.lingma/skills` | `~/.lingma/skills` | — |
| **Qwen Code** | `.qwen/skills` | `~/.qwen/skills` | — |
| **iFlow CLI** | `.iflow/skills` | `~/.iflow/skills` | — |
| **Goose** | `.goose/skills` | `~/.config/goose/skills` | — |
| **Junie** | `.junie/skills` | `~/.junie/skills` | — |
| **Warp** | `.agents/skills` | `~/.agents/skills` | — |
| **Zed** | `.agents/skills` | `~/.agents/skills` | — |
| **Droid (Factory)** | `.agents/skills` | `~/.factory/skills` | — |

> Windows 下把 `~` 展开为 `C:\Users\<你的用户名>`。

## 三、完整平台列表（79 个）

官方 skills CLI 内置 **79 个 Agent** 的技能目录映射，且会自动检测本机已安装的 Agent。查完整列表：

```bash
npx skills add hsiaozzz/cocos-creator-skill --list
```

或直接查看上游权威来源（平台路径映射的唯一真相）：
https://github.com/vercel-labs/skills/blob/main/src/agents.ts

本仓库的 `install.mjs --list` 也会列出内置登记的平台及其在本机的检测结果：

```bash
node install.mjs --list
```

## 四、三种安装方式，怎么选

| 方式 | 命令 | 适用场景 |
|---|---|---|
| **官方 skills CLI**（推荐） | `npx skills add hsiaozzz/cocos-creator-skill --all` | 覆盖 79 个平台，自动软链接，支持 `update` / `remove` |
| **本仓库安装器** | `node install.mjs --all` | 需要装到 **dsh / WorkBuddy**（官方 CLI 暂不含这两个），或离线 / 内网环境 |
| **手动复制** | 见下 | 完全离线，或只想给某一个项目用 |

### 手动复制

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill

# 通用目录（一次覆盖多数平台）
mkdir -p ~/.agents/skills
cp -r skills/cocos-creator ~/.agents/skills/

# Windows PowerShell
# New-Item -ItemType Directory -Force "$env:USERPROFILE\.agents\skills" | Out-Null
# Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.agents\skills\"
```

装到具体平台：

```bash
# Claude Code
cp -r skills/cocos-creator ~/.claude/skills/

# Codex CLI
cp -r skills/cocos-creator ~/.codex/skills/

# dsh（DeepSeek Harness）
cp -r skills/cocos-creator ~/.dsh/skills/

# WorkBuddy
cp -r skills/cocos-creator ~/.workbuddy/skills/
```

**Windows 用户提示**：`~/.workbuddy/skills/你的技能名称/SKILL.md` 是 WorkBuddy 唯一识别的入口结构，目录名必须与 `SKILL.md` 里的 `name` 字段一致（本技能为 `cocos-creator`）。

## 五、工程级 vs 用户级

| | 工程级 | 用户级 |
|---|---|---|
| 位置 | 项目根目录下的对应子目录 | 用户主目录下的对应子目录 |
| 生效范围 | 仅该项目 | 所有项目 |
| 是否提交进仓库 | 是，团队共享同一份 | 否，只在本机 |
| 什么时候用 | 团队想统一 Cocos 开发规范 | 个人日常开发，装一次到处用 |

个人使用建议装**用户级**；团队协作如果希望所有人用同一份规范，可以把工程级目录提交进项目仓库。

## 六、软链接 vs 复制

- **软链接**（`npx skills` 默认）：多个平台指向同一份源，改一处全部生效，升级只需更新源。
  - Windows 下创建目录软链接需要**开发者模式**或管理员权限，否则会失败。
- **复制**（本仓库 `install.mjs` 默认）：兼容性最好，但每个平台各存一份，升级要重新拷贝。

本仓库 `install.mjs` 默认复制、`--link` 切换为软链接，是为了在 Windows 上"开箱即用"。

## 七、装完怎么验证

1. **重启对应 Agent**，或至少新开一个会话（技能目录通常只在启动时扫描）。
2. 用能命中 `description` 的提问试探，例如：

   > 用 Cocos Creator 写一个玩家移动控制器，并说明我会踩哪些坑。

3. 若未命中，依次检查：
   - `SKILL.md` 是否**就位于** `<skills 目录>/cocos-creator/SKILL.md`（多套一层目录是常见错误）
   - 目录名是否与 frontmatter 的 `name` 一致（必须是 `cocos-creator`）
   - frontmatter 是否以文件第一行的 `---` 开始，且 `name` / `description` 都存在
   - 平台是否需要重启才能重新扫描技能目录

## 八、没有列在这里的平台怎么办

先试通用目录。`SKILL.md` 只是一个 Markdown 指令包，不依赖任何运行时或 SDK。任何满足以下任一条件的工具都能用：

- 读 `AGENTS.md`（把它指向本技能即可）
- 支持自定义系统提示 / 规则文件（把 `SKILL.md` 内容接进去即可）
- 支持任何形式的 "skills" 或 "rules" 目录（放进通用目录试一次）

装到 `~/.agents/skills/` 后再确认一次，往往就可以了。真的不支持的话，把 `SKILL.md` 正文贴进该工具的规则文件也是一种可用的降级方案。
