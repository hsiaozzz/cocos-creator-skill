# 🎮 Cocos Creator Skill

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.8.x-2f6fdf.svg)](https://www.cocos.com/)
[![COCOS 4](https://img.shields.io/badge/COCOS%204-MIT%20Open%20Source-16a34a.svg)](https://github.com/cocos/cocos4)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Open%20Standard-6c5ce7.svg)](https://agentskills.io/specification)
[![Platforms](https://img.shields.io/badge/Platforms-100%2B-orange.svg)](docs/platforms.md)

*面向 AI 编码助手的 Cocos Creator 游戏开发技能包*

[English](#english) · [中文](#中文) · [日本語](#日本語) · [한국어](#한국어) · [平台支持](docs/platforms.md) · [更新日志](CHANGELOG.md)

</div>

---

## 中文

### 这是什么

这是一个遵循 [Agent Skills 开放标准](https://agentskills.io/specification) 的**技能包**，为 AI 编码助手注入 Cocos Creator 游戏开发的领域知识与工作流。

它不是一份"文档合集"，而是一套**可执行的工作流**：先确认引擎版本 → 定位代码位置 → 写代码 → **必须验证** → 提交前自查。里面内置了防偷懒条目和危险信号清单，专门堵住 AI "看着对就交付"的退路。

**同一份技能，在 Claude Code、Codex CLI、DeepSeek Harness (dsh)、WorkBuddy、Cursor、Copilot、Gemini CLI、OpenClaw 等 100+ 平台上都能直接用。**

### 安装

#### 方式一：官方 skills CLI（推荐）

自动检测本机已安装的 Agent，一次性装好：

```bash
npx skills add hsiaozzz/cocos-creator-skill --all
```

只装到指定平台：

```bash
npx skills add hsiaozzz/cocos-creator-skill -a claude-code -a codex -g -y
```

#### 方式二：本仓库自带安装器（覆盖 dsh / WorkBuddy）

官方 CLI 目前**不包含 DeepSeek Harness (dsh) 和 WorkBuddy**，用本仓库的安装器可以精确覆盖：

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill

node install.mjs --list                                        # 查看所有平台与本机检测结果
node install.mjs --agent claude-code,codex,dsh,workbuddy       # 装到指定平台
node install.mjs --all                                         # 装到所有检测到的平台
node install.mjs --all --project .                             # 装到当前工程而非用户目录
```

零依赖，只需 Node.js 18+。加 `--dry-run` 可先预览将要执行的操作。

#### 方式三：手动复制

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
mkdir -p ~/.agents/skills
cp -r cocos-creator-skill/skills/cocos-creator ~/.agents/skills/
```

> **关键**：`~/.agents/skills/` 是绝大多数平台共用的通用目录 —— 装到这里一次，Amp、Cline、Cursor（工程级）、Copilot、Gemini CLI、Kilo Code、OpenCode、Zed、Warp 等平台就都能发现它。

各平台的精确目录见 [docs/platforms.md](docs/platforms.md)。

### 装完验证

重启对应 Agent（或至少新开一个会话），然后问一句能命中触发词的话：

```
用 Cocos Creator 写一个玩家移动控制器，并说明我会踩哪些坑。
```

命中后，助手会先问你引擎版本，再给代码，最后要求跑验证 —— 而不是直接吐一段代码就完事。

### 它覆盖什么

| 能力 | 说明 |
|---|---|
| **版本判定** | 先确认 2.x / 3.x / COCOS 4，避免写出不可用的 API |
| **脚本开发** | TypeScript 组件、生命周期、`@ccclass` / `@property` 装饰器 |
| **节点与组件** | 查找、层级、实例化、组件缓存 |
| **事件系统** | 注册与反注册配对，防止场景切换后的内存泄漏 |
| **动画** | `Animation` 组件与 `tween` 补间 |
| **物理** | 刚体、碰撞、事件回调 |
| **UI** | Label / Sprite / Button / Widget / Layout 与多分辨率适配 |
| **资源管理** | `resources.load`、AssetBundle、引用计数释放、对象池 |
| **性能优化** | DrawCall 与合批、GC 抖动、包体与首屏加载的量化路径 |
| **多平台发布** | 微信 / 抖音小游戏分包、H5、iOS、Android、HarmonyOS Next |
| **COCOS 4 迁移** | 3.8 → COCOS 4 流程、cocos-cli / Headless 构建、AI-Native 变化 |

### 技能结构

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
│   └── cocos_doctor.py         # 工程体检：.meta 缺失、孤儿 .meta、大资源、老 API 残留
└── assets/templates/           # 组件模板
```

**渐进式披露**：`SKILL.md` 只放核心流程与路由表，详细内容按需从 `references/` 读取，避免一次性占满模型的上下文窗口。

### 内置工程体检工具

```bash
python skills/cocos-creator/scripts/cocos_doctor.py --project /path/to/your-game
```

检查项：

- 资源缺失 `.meta`（会导致构建时引用丢失）
- 孤儿 `.meta`（源文件已删除但 `.meta` 残留）
- `assets/resources` 体积过大（首屏加载风险）
- 单文件超阈值（包体风险）
- 2.x 老式 API 残留（`cc.Class` / `cc.Node` / `cc.director`）
- 注册了事件但看不到反注册的脚本（内存泄漏风险）

支持 `--json` 输出，便于接入 CI。存在 ERROR 级问题时退出码为 1。

### 参与贡献

欢迎提 Issue 与 PR。修正事实性错误、补充新版本 API、完善平台适配都很有价值 —— 详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 开源协议

MIT License —— 详见 [LICENSE](LICENSE)

---

## English

### What is this

A skill package following the [Agent Skills open standard](https://agentskills.io/specification) that injects Cocos Creator game-development expertise and workflow into AI coding agents.

It is not a docs dump — it is an **executable workflow**: confirm the engine version → locate the code → write → **verify (mandatory)** → self-check before delivery. It ships with anti-rationalization rules and a red-flags list designed to block an agent from shipping code that "looks right".

**The same skill works unmodified across Claude Code, Codex CLI, DeepSeek Harness (dsh), WorkBuddy, Cursor, Copilot, Gemini CLI, OpenClaw and 100+ more platforms.**

### Install

**Option 1 — Official skills CLI (recommended):**

```bash
npx skills add hsiaozzz/cocos-creator-skill --all
```

**Option 2 — Bundled installer (covers dsh / WorkBuddy):**

The official CLI currently does **not** include DeepSeek Harness (dsh) or WorkBuddy:

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill

node install.mjs --list
node install.mjs --agent claude-code,codex,dsh,workbuddy
node install.mjs --all
```

Zero dependencies, Node.js 18+ only. Add `--dry-run` to preview.

**Option 3 — Manual copy:**

```bash
mkdir -p ~/.agents/skills
cp -r cocos-creator-skill/skills/cocos-creator ~/.agents/skills/
```

`~/.agents/skills/` is the shared directory read by most platforms — installing there covers Amp, Cline, Cursor (project-level), Copilot, Gemini CLI, Kilo Code, OpenCode, Zed, Warp and more in one shot.

Per-platform paths: [docs/platforms.md](docs/platforms.md).

### Verify

Restart your agent (or start a new session), then ask something that matches the trigger keywords:

```
Write a player movement controller in Cocos Creator, and tell me which pitfalls I'll hit.
```

A working install will first confirm your engine version, then give code, then insist on running verification.

### Coverage

Version detection (2.x / 3.x / COCOS 4) · TypeScript components & lifecycle · Node/component system · Event pairing · Animation & tween · Physics · UI & multi-resolution · Asset loading, AssetBundle & object pools · DrawCall/batching/GC/package-size optimization · Publishing to WeChat & Douyin mini games, H5, iOS, Android, HarmonyOS Next · 3.8 → COCOS 4 migration.

### Built-in project doctor

```bash
python skills/cocos-creator/scripts/cocos_doctor.py --project /path/to/your-game
```

Detects missing/orphan `.meta` files, oversized assets, bloated `assets/resources`, legacy 2.x APIs, and probable event-listener leaks. Supports `--json` for CI.

### License

MIT — see [LICENSE](LICENSE)

---

## 日本語

### 概要

[Agent Skills オープン標準](https://agentskills.io/specification) に準拠したスキルパッケージです。AI コーディングエージェントに Cocos Creator のゲーム開発知識とワークフローを注入します。

単なるドキュメント集ではなく、**実行可能なワークフロー**です：エンジンのバージョン確認 → コード配置の特定 → 実装 → **検証（必須）** → 提出前セルフチェック。

**Claude Code、Codex CLI、DeepSeek Harness (dsh)、WorkBuddy、Cursor、Copilot、Gemini CLI、OpenClaw など 100+ のプラットフォームでそのまま動作します。**

### インストール

```bash
# 推奨：公式 skills CLI
npx skills add hsiaozzz/cocos-creator-skill --all

# または本リポジトリのインストーラー（dsh / WorkBuddy をカバー）
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill
node install.mjs --list
node install.mjs --agent claude-code,codex,dsh,workbuddy

# または手動コピー
mkdir -p ~/.agents/skills
cp -r skills/cocos-creator ~/.agents/skills/
```

プラットフォーム別のパスは [docs/platforms.md](docs/platforms.md) を参照してください。

### 検証

エージェントを再起動（または新しいセッションを開始）してから：

```
Cocos Creator でプレイヤーの移動コントローラーを書いて。どんな落とし穴があるかも教えて。
```

### 収録内容

バージョン判定（2.x / 3.x / COCOS 4）· TypeScript コンポーネントとライフサイクル · ノード／コンポーネント · イベント · アニメーション · 物理 · UI · アセット管理と AssetBundle · パフォーマンス最適化 · WeChat / Douyin ミニゲーム、H5、iOS、Android、HarmonyOS Next への公開 · COCOS 4 への移行。

### ライセンス

MIT — [LICENSE](LICENSE) を参照

---

## 한국어

### 개요

[Agent Skills 오픈 표준](https://agentskills.io/specification) 을 따르는 스킬 패키지로, AI 코딩 에이전트에 Cocos Creator 게임 개발 지식과 워크플로를 주입합니다.

단순한 문서 모음이 아니라 **실행 가능한 워크플로** 입니다: 엔진 버전 확인 → 코드 위치 파악 → 구현 → **검증(필수)** → 제출 전 자체 점검.

**Claude Code, Codex CLI, DeepSeek Harness (dsh), WorkBuddy, Cursor, Copilot, Gemini CLI, OpenClaw 등 100+ 플랫폼에서 그대로 동작합니다.**

### 설치

```bash
# 권장: 공식 skills CLI
npx skills add hsiaozzz/cocos-creator-skill --all

# 또는 이 저장소의 설치 스크립트 (dsh / WorkBuddy 지원)
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill
node install.mjs --list
node install.mjs --agent claude-code,codex,dsh,workbuddy

# 또는 수동 복사
mkdir -p ~/.agents/skills
cp -r skills/cocos-creator ~/.agents/skills/
```

플랫폼별 경로는 [docs/platforms.md](docs/platforms.md) 를 참고하세요.

### 확인

에이전트를 재시작하거나 새 세션을 시작한 뒤:

```
Cocos Creator로 플레이어 이동 컨트롤러를 작성해줘. 어떤 함정이 있는지도 알려줘.
```

### 포함 내용

버전 판별 (2.x / 3.x / COCOS 4) · TypeScript 컴포넌트와 라이프사이클 · 노드/컴포넌트 · 이벤트 · 애니메이션 · 물리 · UI · 에셋 관리와 AssetBundle · 성능 최적화 · WeChat / Douyin 미니게임, H5, iOS, Android, HarmonyOS Next 배포 · COCOS 4 마이그레이션.

### 라이선스

MIT — [LICENSE](LICENSE) 참조
