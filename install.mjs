#!/usr/bin/env node
/**
 * cocos-creator-skill 跨平台安装器
 *
 * 把 skills/cocos-creator 安装到各 AI Agent 平台的 skills 目录。
 * 零依赖，只需要 Node.js 18+。
 *
 * 为什么需要它？
 *   `npx skills add` 已支持 100+ 平台，但它目前**不包含 DeepSeek Harness (dsh)
 *   和 WorkBuddy**。本脚本覆盖这两个平台的正确路径，同时也能把技能装到
 *   其他所有平台，便于离线 / 内网环境使用。
 *
 * 用法：
 *   node install.mjs --list
 *   node install.mjs --agent claude-code,codex,dsh,workbuddy
 *   node install.mjs --all
 *   node install.mjs --all --project .          # 装到当前项目而非用户目录
 *   node install.mjs --agent codex --link       # 用软链接代替复制
 *   node install.mjs --agent codex --dry-run
 *
 * 也可以直接：
 *   npx skills add hsiaozzz/cocos-creator-skill --all
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const IS_WINDOWS = process.platform === 'win32';
const XDG_CONFIG = process.env.XDG_CONFIG_HOME?.trim() || path.join(HOME, '.config');

const SKILL_NAME = 'cocos-creator';
const SOURCE_DIR = path.join(__dirname, 'skills', SKILL_NAME);

/**
 * 平台注册表。
 * project = 工程级相对路径；global = 用户级绝对路径。
 * 路径依据 vercel-labs/skills 的 src/agents.ts（权威来源）以及各平台官方文档。
 */
const AGENTS = {
  universal: {
    display: 'Universal (.agents) — Cline / Cursor / Copilot / Gemini CLI / Zed / Warp 等共用',
    project: '.agents/skills',
    global: path.join(XDG_CONFIG, 'agents', 'skills'),
  },
  'claude-code': {
    display: 'Claude Code',
    project: '.claude/skills',
    global: path.join(process.env.CLAUDE_CONFIG_DIR?.trim() || path.join(HOME, '.claude'), 'skills'),
    detect: path.join(HOME, '.claude'),
  },
  codex: {
    display: 'OpenAI Codex CLI',
    project: '.agents/skills',
    global: path.join(process.env.CODEX_HOME?.trim() || path.join(HOME, '.codex'), 'skills'),
    detect: process.env.CODEX_HOME?.trim() || path.join(HOME, '.codex'),
  },
  dsh: {
    display: 'DeepSeek Harness (dsh)',
    project: '.dsh/skills',
    global: path.join(process.env.DSH_HOME?.trim() || path.join(HOME, '.dsh'), 'skills'),
    detect: process.env.DSH_HOME?.trim() || path.join(HOME, '.dsh'),
  },
  workbuddy: {
    display: 'WorkBuddy',
    project: '.workbuddy/skills',
    global: path.join(HOME, '.workbuddy', 'skills'),
    detect: path.join(HOME, '.workbuddy'),
  },
  openclaw: {
    display: 'OpenClaw',
    project: 'skills',
    global: path.join(HOME, '.openclaw', 'skills'),
    detect: path.join(HOME, '.openclaw'),
  },
  cursor: {
    display: 'Cursor',
    project: '.agents/skills',
    global: path.join(HOME, '.cursor', 'skills'),
    detect: path.join(HOME, '.cursor'),
  },
  'github-copilot': {
    display: 'GitHub Copilot',
    project: '.agents/skills',
    global: path.join(HOME, '.copilot', 'skills'),
    detect: path.join(HOME, '.copilot'),
  },
  'gemini-cli': {
    display: 'Gemini CLI',
    project: '.agents/skills',
    global: path.join(HOME, '.gemini', 'skills'),
    detect: path.join(HOME, '.gemini'),
  },
  amp: {
    display: 'Amp',
    project: '.agents/skills',
    global: path.join(XDG_CONFIG, 'agents', 'skills'),
    detect: path.join(XDG_CONFIG, 'amp'),
  },
  cline: {
    display: 'Cline',
    project: '.agents/skills',
    global: path.join(HOME, '.agents', 'skills'),
    detect: path.join(HOME, '.cline'),
  },
  opencode: {
    display: 'OpenCode',
    project: '.agents/skills',
    global: path.join(XDG_CONFIG, 'opencode', 'skills'),
    detect: path.join(XDG_CONFIG, 'opencode'),
  },
  windsurf: {
    display: 'Windsurf',
    project: '.windsurf/skills',
    global: path.join(HOME, '.codeium', 'windsurf', 'skills'),
    detect: path.join(HOME, '.codeium', 'windsurf'),
  },
  'kiro-cli': {
    display: 'Kiro CLI',
    project: '.kiro/skills',
    global: path.join(HOME, '.kiro', 'skills'),
    detect: path.join(HOME, '.kiro'),
  },
  roo: {
    display: 'Roo Code',
    project: '.roo/skills',
    global: path.join(HOME, '.roo', 'skills'),
    detect: path.join(HOME, '.roo'),
  },
  kilo: {
    display: 'Kilo Code',
    project: '.agents/skills',
    global: path.join(HOME, '.kilo', 'skills'),
    detect: path.join(HOME, '.kilo'),
  },
  trae: {
    display: 'Trae',
    project: '.trae/skills',
    global: path.join(HOME, '.trae', 'skills'),
    detect: path.join(HOME, '.trae'),
  },
  qoder: {
    display: 'Qoder',
    project: '.qoder/skills',
    global: path.join(HOME, '.qoder', 'skills'),
    detect: path.join(HOME, '.qoder'),
  },
  'qwen-code': {
    display: 'Qwen Code',
    project: '.qwen/skills',
    global: path.join(HOME, '.qwen', 'skills'),
    detect: path.join(HOME, '.qwen'),
  },
  'kimi-code-cli': {
    display: 'Kimi Code CLI',
    project: '.agents/skills',
    global: path.join(HOME, '.agents', 'skills'),
    detect: path.join(HOME, '.kimi-code'),
  },
  'iflow-cli': {
    display: 'iFlow CLI',
    project: '.iflow/skills',
    global: path.join(HOME, '.iflow', 'skills'),
    detect: path.join(HOME, '.iflow'),
  },
  lingma: {
    display: 'Lingma (通义灵码)',
    project: '.lingma/skills',
    global: path.join(HOME, '.lingma', 'skills'),
    detect: path.join(HOME, '.lingma'),
  },
  goose: {
    display: 'Goose',
    project: '.goose/skills',
    global: path.join(XDG_CONFIG, 'goose', 'skills'),
    detect: path.join(XDG_CONFIG, 'goose'),
  },
  junie: {
    display: 'Junie',
    project: '.junie/skills',
    global: path.join(HOME, '.junie', 'skills'),
    detect: path.join(HOME, '.junie'),
  },
  'github-skills': {
    display: 'GitHub Copilot (VS Code 工程级 .github/skills)',
    project: '.github/skills',
    global: null,
  },
};

// ---------------------------------------------------------------- CLI 解析

function parseArgs(argv) {
  const opts = { agents: [], all: false, list: false, project: null, link: false, dryRun: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case '--agent':
      case '-a':
        opts.agents.push(...String(next() || '').split(',').map((s) => s.trim()).filter(Boolean));
        break;
      case '--all':
        opts.all = true;
        break;
      case '--list':
      case '-l':
        opts.list = true;
        break;
      case '--project':
      case '-p': {
        const value = next();
        opts.project = value ? path.resolve(value) : process.cwd();
        break;
      }
      case '--link':
        opts.link = true;
        break;
      case '--copy':
        opts.link = false;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--force':
      case '-f':
        opts.force = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`未知参数：${arg}`);
          printHelp();
          process.exit(2);
        }
        opts.agents.push(arg);
    }
  }
  return opts;
}

function printHelp() {
  console.log(`
cocos-creator-skill 安装器

用法:
  node install.mjs --list
  node install.mjs --agent <平台[,平台...]>
  node install.mjs --all [--project <工程目录>]

参数:
  -a, --agent <names>   目标平台，逗号分隔；可用 --list 查看全部
      --all             安装到所有「检测到已安装」的平台
  -p, --project [dir]   安装到工程级目录（默认为当前目录），而非用户级目录
  -l, --list            列出所有支持的平台及其目标路径
      --link            使用软链接（默认复制；Windows 下软链接需要开发者模式）
      --copy            强制复制
      --dry-run         只显示将要执行的操作，不落盘
  -f, --force           覆盖已存在的同名技能目录
  -h, --help            显示帮助

示例:
  node install.mjs --all
  node install.mjs --agent claude-code,codex,dsh,workbuddy
  node install.mjs -a dsh -p ./my-game

提示: 更通用的方式是使用官方 skills CLI（支持 100+ 平台，自动软链接）:
  npx skills add hsiaozzz/cocos-creator-skill --all
`);
}

// ---------------------------------------------------------------- 工具函数

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function tilde(p) {
  return p.startsWith(HOME) ? '~' + p.slice(HOME.length) : p;
}

function resolveTarget(agentKey, spec, opts) {
  if (opts.project) {
    // 工程级：把绝对路径转成相对工程根
    return { dir: path.join(opts.project, ...spec.project.split('/')), scope: 'project' };
  }
  if (!spec.global) return null;
  return { dir: spec.global, scope: 'global' };
}

function linkOrCopy(src, dest, useLink) {
  if (useLink) {
    const type = IS_WINDOWS ? 'junction' : 'dir';
    fs.symlinkSync(src, dest, type);
    return 'linked';
  }
  fs.cpSync(src, dest, { recursive: true });
  return 'copied';
}

// ---------------------------------------------------------------- 主流程

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!exists(SOURCE_DIR)) {
    console.error(`❌ 找不到技能源目录：${SOURCE_DIR}`);
    console.error('   请在仓库根目录运行本脚本。');
    process.exit(1);
  }

  if (opts.list) {
    console.log('\n支持的平台：\n');
    const pad = Math.max(...Object.keys(AGENTS).map((k) => k.length));
    for (const [key, spec] of Object.entries(AGENTS)) {
      console.log(`  ${key.padEnd(pad)}  ${spec.display}`);
      console.log(`  ${' '.repeat(pad)}    工程级: ${spec.project}`);

      const globalDir = spec.global;
      if (!globalDir) {
        console.log(`  ${' '.repeat(pad)}    用户级: （不支持，仅工程级）`);
      } else {
        const installed = spec.detect ? exists(spec.detect) : false;
        const mark = installed ? ' (已检测到)' : '';
        console.log(`  ${' '.repeat(pad)}    用户级: ${tilde(globalDir)}${mark}`);
      }
      console.log();
    }
    console.log(`共 ${Object.keys(AGENTS).length} 个平台登记项。`);
    console.log('完整 100+ 平台列表请用官方 CLI：npx skills add hsiaozzz/cocos-creator-skill --all\n');
    return;
  }

  let targetKeys = opts.agents;

  if (opts.all) {
    targetKeys = Object.keys(AGENTS).filter((key) => {
      const spec = AGENTS[key];
      if (!spec.detect) return false;
      return exists(spec.detect);
    });
    if (targetKeys.length === 0) {
      console.error('❌ 未检测到任何已安装的 Agent 平台。');
      console.error('   请用 --agent 显式指定，例如：--agent claude-code,codex,dsh,workbuddy');
      process.exit(1);
    }
  }

  if (targetKeys.length === 0) {
    console.error('❌ 未指定目标平台。用 --all 或 --agent <names>，--list 查看全部。');
    process.exit(2);
  }

  const unknown = targetKeys.filter((k) => !AGENTS[k]);
  if (unknown.length) {
    console.error(`❌ 未知平台：${unknown.join(', ')}`);
    console.error('   用 --list 查看受支持的平台名称。');
    process.exit(2);
  }

  console.log(`\n源技能：${tilde(SOURCE_DIR)}`);
  console.log(`方式  ：${opts.link ? '软链接' : '复制'}${opts.dryRun ? '（dry-run，不落盘）' : ''}`);
  console.log(`范围  ：${opts.project ? `工程级 → ${opts.project}` : '用户级'}\n`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const key of targetKeys) {
    const spec = AGENTS[key];
    const resolved = resolveTarget(key, spec, opts);

    if (!resolved) {
      console.log(`⊘ ${spec.display}：用户级目录未定义（仅支持工程级，用 --project）`);
      skipped++;
      continue;
    }

    const dest = path.join(resolved.dir, SKILL_NAME);

    if (exists(dest)) {
      if (!opts.force) {
        console.log(`⊘ ${spec.display}：目标已存在，跳过 → ${tilde(dest)}`);
        console.log(`  （用 --force 覆盖）`);
        skipped++;
        continue;
      }
      if (!opts.dryRun) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      console.log(`  ⚠ ${spec.display}：覆盖已存在的目录`);
    }

    try {
      if (opts.dryRun) {
        console.log(`✔ ${spec.display}：将安装到 ${tilde(dest)}`);
      } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const action = linkOrCopy(SOURCE_DIR, dest, opts.link);
        console.log(`✔ ${spec.display}：${action === 'linked' ? '已软链接' : '已复制'} → ${tilde(dest)}`);
      }
      ok++;
    } catch (err) {
      console.error(`✘ ${spec.display}：失败 → ${tilde(dest)}`);
      console.error(`  ${err.message}`);
      failed++;
    }
  }

  console.log(`\n完成：${ok} 成功，${skipped} 跳过，${failed} 失败`);

  if (!opts.dryRun && ok > 0) {
    console.log('\n下一步：重启对应的 Agent（或新开一个会话）使技能被发现。');
    console.log('验证方式：向 Agent 提问「用 Cocos Creator 写一个玩家控制器」看是否命中技能。');
  }

  if (failed > 0) process.exit(1);
}

main();
