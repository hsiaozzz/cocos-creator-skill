# 🎮 Cocos Creator Skill

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.8.x-2f6fdf.svg)](https://www.cocos.com/)
[![COCOS 4](https://img.shields.io/badge/COCOS%204-MIT%20Open%20Source-16a34a.svg)](https://github.com/cocos/cocos4)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Open%20Standard-6c5ce7.svg)](https://agentskills.io/specification)
[![Platforms](https://img.shields.io/badge/Platforms-79%2B-orange.svg)](docs/platforms.md)

**Cocos Creator 3.8.x / COCOS 4 game-development skill for AI coding agents**

[English](README.md) · [简体中文](README.zh-CN.md) · [Platform support](docs/platforms.md) · [Changelog](CHANGELOG.md)

</div>

---

## What is this

A skill package following the [Agent Skills open standard](https://agentskills.io/specification) that injects Cocos Creator game-development expertise into AI coding agents.

It is not a docs dump — it is an **executable workflow**: confirm the engine version → locate the code → write → **verify (mandatory)** → self-check before delivery. It ships with anti-rationalization rules and a red-flags list designed to stop an agent from shipping code that merely "looks right".

The same unmodified `SKILL.md` works on Claude Code, Codex CLI, DeepSeek Harness (dsh), WorkBuddy, Cursor, GitHub Copilot, Gemini CLI, OpenClaw and [70+ more platforms](docs/platforms.md).

> **In a hurry?** One command, then restart your agent:
>
> ```bash
> npx skills add hsiaozzz/cocos-creator-skill --all
> ```

---

## Table of contents

- [Installation](#installation)
  - [Step 0 — Pick a method](#step-0--pick-a-method)
  - [Method 1 — Official `skills` CLI](#method-1--official-skills-cli-recommended)
  - [Method 2 — Bundled installer](#method-2--bundled-installer-covers-dsh--workbuddy)
  - [Method 3 — Manual install](#method-3--manual-install)
- [Verify the installation](#verify-the-installation)
- [Project-level vs user-level](#project-level-vs-user-level)
- [Update & uninstall](#update--uninstall)
- [What it covers](#what-it-covers)
- [Skill structure](#skill-structure)
- [Built-in project doctor](#built-in-project-doctor)
- [Troubleshooting install issues](#troubleshooting-install-issues)
- [Contributing](#contributing) · [License](#license)

---

## Installation

### Step 0 — Pick a method

| | Method | One command | Covers | Requires |
|---|---|---|---|---|
| **1** | Official `skills` CLI | `npx skills add hsiaozzz/cocos-creator-skill --all` | 79 platforms, auto-detected | Node.js 18+ |
| **2** | Bundled `install.mjs` | `node install.mjs --agent dsh,workbuddy` | 25 platforms incl. **dsh** & **WorkBuddy** | Node.js 18+, git |
| **3** | Manual copy | `cp -r skills/cocos-creator ~/.agents/skills/` | Any platform you point it at | git (or just download the ZIP) |

**Which one do you want?**

- **Just works, most people** → Method 1.
- **You use DeepSeek Harness (dsh) or WorkBuddy** → Method 2 (or Method 3). The official CLI has no `dsh` / `workbuddy` entry in its agent list.
- **No npm, offline machine, or air-gapped network** → Method 3.
- **You only want it for one specific project** → any method, then add the project-level flag (`-g`-off / `--project` / copy into the project directory). See [Project-level vs user-level](#project-level-vs-user-level).

<details>
<summary>Prerequisites in detail</summary>

| Requirement | Needed for | Notes |
|---|---|---|
| **Node.js 18+** | Method 1, Method 2 | Only to *run the installer*. The skill itself is plain Markdown — it has no runtime dependency. |
| **git** | Method 2, Method 3 | Method 3 also works by downloading and unzipping the repo, no git needed. |
| **Python 3.8+** | *optional* | Only for `scripts/cocos_doctor.py` (the project health check). The skill works fine without Python. |
| **Cocos Creator editor / `cocos-cli`** | *optional* | Only needed for actual command-line builds. |

Check your Node version:

```bash
node -v          # must print v18.x or higher
```
</details>

---

### Method 1 — Official `skills` CLI (recommended)

The `skills` CLI from [vercel-labs/skills](https://github.com/vercel-labs/skills) is the cross-platform installer. It knows the skills directory of **79 agents** and auto-detects which ones you have installed.

**Install for every agent detected on your machine (user-level, no prompts):**

```bash
npx skills add hsiaozzz/cocos-creator-skill --all
```

`--all` is shorthand for `--skill '*' --agent '*' -y`. With `-y` the CLI skips the interactive prompts and auto-detects the scope (project-level if you are inside a project, otherwise user-level).

**Install to specific agents only:**

```bash
# One agent
npx skills add hsiaozzz/cocos-creator-skill -a claude-code

# Several agents (repeat the flag)
npx skills add hsiaozzz/cocos-creator-skill -a claude-code -a codex -a cursor
```

**Force user-level so every project on the machine can use it:**

```bash
npx skills add hsiaozzz/cocos-creator-skill --all -g
```

**Other useful things this CLI can do:**

```bash
# Preview what is in the repo without installing anything
npx skills add hsiaozzz/cocos-creator-skill --list

# Try the skill in a prompt without installing it at all
npx skills use hsiaozzz/cocos-creator-skill@cocos-creator

# See what is currently installed
npx skills list          # project-level
npx skills list -g       # user-level
```

**Full `add` flag reference:**

| Flag | Alias | Meaning |
|---|---|---|
| `--global` | `-g` | Install user-level (all projects) instead of project-level |
| `--agent <agents>` | `-a` | Target specific agents; use `*` for all. Repeatable. |
| `--skill <skills>` | `-s` | Target specific skill names; use `*` for all |
| `--list` | `-l` | List the skills available in the repo, install nothing |
| `--yes` | `-y` | Skip confirmation and scope prompts |
| `--all` | | Shorthand for `--skill '*' --agent '*' -y` |
| `--copy` | | Copy files instead of symlinking into agent directories |
| `--subagent <names>` | | Install to Eve subagents (`root` for the root agent) |
| `--full-depth` | | Search all subdirectories even when a root `SKILL.md` exists |

> **How the agent names work**: `-a` takes the CLI's own agent keys, e.g. `claude-code`, `codex`, `cursor`, `gemini-cli`, `github-copilot`, `openclaw`, `trae`, `qoder`, `qwen-code`, `lingma`, `windsurf`, `amp`, `cline`, `kilo`, `opencode`, `zed`, `warp`… The authoritative list lives in [src/agents.ts](https://github.com/vercel-labs/skills/blob/main/src/agents.ts). If you are unsure, use `-a '*'` and let auto-detection handle it.

> **`npx` is not a typo** — it runs the package without a global install. If you use it often, `npm i -g skills` makes the plain `skills` command available.

---

### Method 2 — Bundled installer (covers dsh / WorkBuddy)

Official CLI agent lists do **not** include entries for **DeepSeek Harness (dsh)** or **WorkBuddy**, so this repo ships its own zero-dependency installer that does — along with correct paths for 23 more platforms. Use this if you are on dsh or WorkBuddy, or if you are behind a restrictive network and want a fully local install.

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill
```

**Step 1 — See what is supported, and what you already have installed:**

```bash
node install.mjs --list
```

This prints every registered platform with its project-level and user-level target path, and appends `(已检测到)` / *(detected)* next to the ones found on your machine.

**Step 2 — Install:**

```bash
# The four most common agent platforms in one go
node install.mjs --agent claude-code,codex,dsh,workbuddy

# Just dsh
node install.mjs --agent dsh

# Every platform detected on this machine
node install.mjs --all

# Install into a specific project instead of your home directory
node install.mjs --agent dsh --project ./my-cocos-game
```

**Preview before writing anything** (recommended on first run):

```bash
node install.mjs --all --dry-run
```

**Full flag reference:**

| Flag | Alias | Meaning |
|---|---|---|
| `--list` | `-l` | List all supported platforms, their target paths, and detection status |
| `--agent <names>` | `-a` | Target platforms, comma-separated. Repeatable. |
| `--all` | | Install to every platform **detected** on this machine |
| `--project [dir]` | `-p` | Install project-level into `dir` (defaults to the current directory) |
| `--link` | | Symlink instead of copy (Windows needs Developer Mode / admin) |
| `--copy` | | Force copy — this is the default, chosen for Windows compatibility |
| `--dry-run` | | Print planned actions, write nothing |
| `--force` | `-f` | Overwrite an existing skill directory |
| `--help` | `-h` | Show help |

**Behaviour worth knowing:**

- **Copy, not symlink**, by default — Windows users get a working install without enabling Developer Mode. Use `--link` if you prefer a single source of truth.
- **Already installed → skipped**, not overwritten. Pass `--force` to upgrade in place.
- **Exit code 1** if any target failed, so it is safe to use in scripts and CI.
- Registered platforms: `universal`, `claude-code`, `codex`, `dsh`, `workbuddy`, `openclaw`, `cursor`, `github-copilot`, `gemini-cli`, `amp`, `cline`, `opencode`, `windsurf`, `kiro-cli`, `roo`, `kilo`, `trae`, `qoder`, `qwen-code`, `kimi-code-cli`, `iflow-cli`, `lingma`, `goose`, `junie`, `github-skills`.

---

### Method 3 — Manual install

No npm, no Node — just files. This is also the way to go if you want to inspect exactly what lands on disk before it lands.

**Clone the repo:**

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cd cocos-creator-skill
```

**Option A — the universal directory (covers most platforms at once)**

`~/.agents/skills/` is read by a large group of platforms: **Amp, Cline, Cursor (project-level), GitHub Copilot, Gemini CLI, Kilo Code, OpenCode, Warp, Zed, Kimi Code CLI** and more — plus **DeepSeek Harness**, which also scans `~/.agents/skills` as a fallback. Install once here and most of your tooling is covered.

*macOS / Linux / Git Bash:*

```bash
mkdir -p ~/.agents/skills
cp -r skills/cocos-creator ~/.agents/skills/
```

*Windows PowerShell:*

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.agents\skills" | Out-Null
Copy-Item -Recurse skills\cocos-creator "$env:USERPROFILE\.agents\skills\"
```

**Option B — a platform-specific directory**

*macOS / Linux / Git Bash:*

```bash
# Claude Code
mkdir -p ~/.claude/skills && cp -r skills/cocos-creator ~/.claude/skills/

# Codex CLI  (honours $CODEX_HOME)
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills" && cp -r skills/cocos-creator "${CODEX_HOME:-$HOME/.codex}/skills/"

# DeepSeek Harness (dsh)  (honours $DSH_HOME)
mkdir -p "${DSH_HOME:-$HOME/.dsh}/skills" && cp -r skills/cocos-creator "${DSH_HOME:-$HOME/.dsh}/skills/"

# WorkBuddy
mkdir -p ~/.workbuddy/skills && cp -r skills/cocos-creator ~/.workbuddy/skills/

# OpenClaw
mkdir -p ~/.openclaw/skills && cp -r skills/cocos-creator ~/.openclaw/skills/
```

*Windows PowerShell:*

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

**Option C — project-level (commit it, share it with your team)**

Copy the skill into your game project and commit it. Every teammate using the same agent gets the same Cocos conventions:

```bash
cd /path/to/your-cocos-game
mkdir -p .agents/skills
cp -r /path/to/cocos-creator-skill/skills/cocos-creator .agents/skills/
```

**Platform path reference:**

| Platform | Project-level | User-level | Notes |
|---|---|---|---|
| **Universal** | `.agents/skills` | `~/.agents/skills` | Covers most platforms — prefer this one |
| **Claude Code** | `.claude/skills` | `~/.claude/skills` | Overridable via `CLAUDE_CONFIG_DIR` |
| **Codex CLI** | `.agents/skills` | `~/.codex/skills` | Overridable via `CODEX_HOME` |
| **DeepSeek Harness (dsh)** | `.dsh/skills` · `.agents/skills` | `$DSH_HOME/skills` (default `~/.dsh/skills`) · `~/.agents/skills` | Overridable via `DSH_HOME`; also supports `customSkillDirs` |
| **WorkBuddy** | `.workbuddy/skills` | `~/.workbuddy/skills` | Directory name must equal the `name` field (`cocos-creator`) |
| **OpenClaw** | `skills` | `~/.openclaw/skills` | Legacy `~/.clawdbot`, `~/.moltbot` also still read |
| **Cursor** | `.agents/skills` | `~/.cursor/skills` | — |
| **GitHub Copilot** | `.agents/skills` | `~/.copilot/skills` | VS Code also reads `.github/skills` |
| **Gemini CLI** | `.agents/skills` | `~/.gemini/skills` | Antigravity reads `~/.gemini/antigravity/skills` |
| **Cline** | `.agents/skills` | `~/.agents/skills` | — |
| **Kilo Code** | `.agents/skills` | `~/.kilo/skills` | Legacy `~/.kilocode` also read |
| **OpenCode** | `.agents/skills` | `~/.config/opencode/skills` | — |
| **Windsurf** | `.windsurf/skills` | `~/.codeium/windsurf/skills` | — |
| **Kiro CLI** | `.kiro/skills` | `~/.kiro/skills` | — |
| **Roo Code** | `.roo/skills` | `~/.roo/skills` | — |
| **Trae / Trae CN** | `.trae/skills` | `~/.trae/skills` · `~/.trae-cn/skills` | — |
| **Qoder / Qoder CN** | `.qoder/skills` | `~/.qoder/skills` · `~/.qoder-cn/skills` | — |
| **Lingma (通义灵码)** | `.lingma/skills` | `~/.lingma/skills` | — |
| **Qwen Code** | `.qwen/skills` | `~/.qwen/skills` | — |
| **iFlow CLI** | `.iflow/skills` | `~/.iflow/skills` | — |
| **Goose** | `.goose/skills` | `~/.config/goose/skills` | — |
| **Junie** | `.junie/skills` | `~/.junie/skills` | — |
| **Warp** | `.agents/skills` | `~/.agents/skills` | — |
| **Zed** | `.agents/skills` | `~/.agents/skills` | — |
| **Droid (Factory)** | `.agents/skills` | `~/.factory/skills` | — |

> On Windows, expand `~` to `C:\Users\<your-name>`. Most platforms support `$XDG_CONFIG_HOME`; if you set it, `~/.config` paths move accordingly.

> **Structure matters more than location.** Whatever directory you choose, the file must end up at exactly `<skills-dir>/cocos-creator/SKILL.md`. One extra nesting level (`.../cocos-creator/cocos-creator/SKILL.md`) is the single most common reason a skill silently never loads.

---

## Verify the installation

**1. Confirm the files landed where you expect.** The command differs per method:

```bash
npx skills list -g                    # Method 1 (user-level; drop -g for project-level)
node install.mjs --list               # Method 2 — prints detection status per platform
ls ~/.agents/skills/cocos-creator/    # Method 3
```

Expected result — the skill folder contains:

```
cocos-creator/
├── SKILL.md
├── references/          (7 files)
├── scripts/cocos_doctor.py
└── assets/templates/
```

**2. Confirm the entry point is correct.** This one line catches nearly every broken install:

```bash
head -3 ~/.agents/skills/cocos-creator/SKILL.md
```

It must print:

```
---
name: cocos-creator
description: "Cocos Creator 3.8.x …
```

The `---` must be the very first line (no blank line, no BOM), and `name:` must be `cocos-creator`.

**3. Restart the agent.** Most platforms only scan skills directories at startup. Reload the window, or start a new session. For dsh, a new session is enough — it watches the directory and hot-reloads `SKILL.md` changes.

**4. Trigger the skill with a real request.** Say something that matches the skill's `description`:

```
Write a player movement controller in Cocos Creator, and tell me which pitfalls I'll hit.
```

Ask the agent *"which skills do you have available?"* to check directly; in dsh you can also force-load it with `/cocos-creator`.

**A working install behaves like this:** the agent asks which engine version you are on **before** writing code, then gives the code, then insists on verification. If it dumps code immediately with no version question, the skill is not loaded.

**If it does not trigger, check in this order:**

1. Is the file at `<skills-dir>/cocos-creator/SKILL.md` — exactly one level, no double nesting?
2. Is the directory name exactly `cocos-creator` (must match frontmatter `name`)?
3. Does `SKILL.md` start with `---` on line 1, with both `name` and `description` present?
4. Is `description` wrapped in quotes if it contains a colon followed by a space? (`dsh` drops such frontmatter **silently** — no error, empty skill list.)
5. Did you restart the agent or open a new session?
6. Is the agent on the right scope — you installed user-level but the agent is looking at project-level, or vice versa?

---

## Project-level vs user-level

| | Project-level | User-level |
|---|---|---|
| Lives in | A subdirectory of your game project | A subdirectory of your home directory |
| Applies to | That project only | Every project on the machine |
| Committed to git | Yes — the team shares one copy | No — local to you |
| Use when | A team wants one shared Cocos convention | You do Cocos work across many projects |

Choose per method:

```bash
npx skills add hsiaozzz/cocos-creator-skill --all -g      # Method 1: -g = user-level (default is project-level)
node install.mjs --all --project .                         # Method 2: --project = project-level (default is user-level)
cp -r skills/cocos-creator .agents/skills/                 # Method 3: wherever you copy it
```

For solo work, user-level is the better default — install once, use everywhere. For a team, committing the project-level copy into the game repo keeps everyone's agent answering with the same conventions.

---

## Update & uninstall

**Update** — the repository is the source of truth; re-install to refresh:

```bash
npx skills update -g                     # Method 1 (user-level); -p for project-level
node install.mjs --all --force           # Method 2: --force overwrites in place
```

If you installed with `--link` / symlinks, updating the clone is enough — no re-install needed.

**Uninstall:**

```bash
npx skills remove -g -y                  # Method 1 (user-level); add -s cocos-creator to be explicit
rm -rf ~/.agents/skills/cocos-creator    # Method 3 (adjust the path to wherever you installed)
```

Removing the `cocos-creator` folder is always sufficient and never touches anything else — nothing is registered outside that directory.

---

## What it covers

| Area | Details |
|---|---|
| **Version detection** | Distinguishes 2.x / 3.x / COCOS 4 first, so the agent does not emit APIs that do not exist on your engine |
| **Scripting** | TypeScript components, lifecycle callbacks, `@ccclass` / `@property` decorators |
| **Nodes & components** | Lookup, hierarchy, instantiation, component caching |
| **Events** | Register/unregister pairing to prevent leaks surviving scene changes |
| **Animation** | `Animation` component and `tween` |
| **Physics** | Rigid bodies, colliders, contact callbacks |
| **UI** | Label / Sprite / Button / Widget / Layout, multi-resolution adaptation |
| **Assets** | `resources.load`, AssetBundle, reference-counted release, object pools |
| **Performance** | DrawCall and batching, GC spikes, package size and first-screen load — with quantified targets |
| **Publishing** | WeChat & Douyin mini-game subpackaging, H5, iOS, Android, HarmonyOS Next |
| **COCOS 4 migration** | 3.8 → COCOS 4 workflow, `cocos-cli` / headless builds, AI-native changes |

---

## Skill structure

```
skills/cocos-creator/
├── SKILL.md                    # Entry point & router: core workflow + cheat sheet (< 500 lines)
├── references/                 # Loaded on demand — costs no context until needed
│   ├── api-quick-ref.md        # API quick reference
│   ├── examples.md             # Complete runnable examples
│   ├── best-practices.md       # Architecture & conventions
│   ├── performance.md          # Quantified performance guide
│   ├── publishing.md           # Multi-platform build & release
│   ├── troubleshooting.md      # Problem-solving handbook
│   └── cocos4-migration.md     # 3.8 → COCOS 4 migration
├── scripts/
│   └── cocos_doctor.py         # Project health check (zero dependencies)
└── assets/templates/           # Component templates
```

**Progressive disclosure**: `SKILL.md` holds only the core workflow and a routing table; deep content is pulled from `references/` on demand so the skill never floods the model's context window.

---

## Built-in project doctor

A zero-dependency Python script that audits a real Cocos project:

```bash
python skills/cocos-creator/scripts/cocos_doctor.py --project /path/to/your-game
```

It checks:

- Assets missing `.meta` files (silently breaks references at build time)
- Orphan `.meta` files (source deleted, meta left behind)
- Oversized `assets/resources` (first-screen load risk — everything there is bundled)
- Individual files over the size threshold (package size risk)
- Legacy 2.x API remnants (`cc.Class` / `cc.Node` / `cc.director`)
- Scripts that register event listeners with no visible unregister (leak risk)

Add `--json` for machine-readable output. Exits `1` when ERROR-level issues are found, so it drops straight into CI.

Verified against real projects — it caught a 3.4 MB `map120.prefab` package-size risk and legacy `cc.Node.prototype` usage.

---

## Troubleshooting install issues

| Symptom | Cause | Fix |
|---|---|---|
| Agent never mentions the skill | Extra nesting level | Must be exactly `<skills-dir>/cocos-creator/SKILL.md` |
| Agent never mentions the skill | Directory renamed | Directory name must equal frontmatter `name` → `cocos-creator` |
| Agent never mentions the skill | No restart | Restart the agent / open a new session |
| dsh: skill list is empty, no error at all | `description` contains an unquoted `:` | Wrap the value in quotes; dsh drops malformed frontmatter **silently** |
| Frontmatter not parsed | File starts with a blank line or BOM | `---` must be line 1, byte for byte |
| `npx skills` cannot install to dsh / WorkBuddy | No entry in its agent list | Use Method 2 or Method 3 |
| Symlink creation fails on Windows | Developer Mode off | Use `--copy`, or the default `install.mjs` behaviour |
| Wrong scope | Installed user-level, agent reads project-level | See [Project-level vs user-level](#project-level-vs-user-level) |
| `node install.mjs` says source dir not found | Run from outside the repo | `cd` into the cloned repo root first |

---

## Contributing

Issues and PRs are welcome. Fixing factual errors, adding new engine-version behaviour, and adding platform support are all valuable — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE)
