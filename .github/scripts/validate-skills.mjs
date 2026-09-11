#!/usr/bin/env node
/**
 * 校验 skills/ 下的技能包是否符合 Agent Skills 开放标准。
 * 零依赖，供 CI 与本地使用。
 *
 * 用法：node .github/scripts/validate-skills.mjs
 * 退出码：0 = 通过；1 = 存在错误
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SKILLS_DIR = path.join(ROOT, 'skills');

const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SKILL_LINES = 500;

const errors = [];
const warnings = [];
const notes = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

/** 极简 YAML frontmatter 解析（只处理顶层标量与简单嵌套） */
function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return null;
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const yamlText = match[1];
  const body = match[2] ?? '';
  const data = {};
  let currentKey = null;

  for (const line of yamlText.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.match(/^\s*/)[0].length;
    const kv = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);

    if (indent === 0 && kv) {
      currentKey = kv[1];
      let value = kv[2].trim();
      if (value === '') {
        data[currentKey] = {};
      } else {
        // 去掉包裹引号
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        data[currentKey] = value;
        currentKey = null;
      }
    } else if (indent > 0 && currentKey && kv) {
      if (typeof data[currentKey] !== 'object' || data[currentKey] === null) data[currentKey] = {};
      let value = kv[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[currentKey][kv[1]] = value;
    }
  }
  return { data, body };
}

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile()) acc.push(full);
  }
  return acc;
}

function main() {
  if (!isDir(SKILLS_DIR)) {
    err(`未找到 skills/ 目录：${SKILLS_DIR}`);
    return finish();
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => path.join(SKILLS_DIR, e.name));

  if (skillDirs.length === 0) {
    err('skills/ 下没有任何技能目录。');
    return finish();
  }

  // 仓库根目录不应存在散装 SKILL.md
  if (fs.existsSync(path.join(ROOT, 'SKILL.md'))) {
    err('仓库根目录存在 SKILL.md —— 技能必须放在 skills/<name>/SKILL.md，否则任何平台都发现不了它。');
  }

  for (const skillDir of skillDirs) {
    const dirName = path.basename(skillDir);
    const skillMd = path.join(skillDir, 'SKILL.md');
    const rel = path.relative(ROOT, skillDir);

    if (!fs.existsSync(skillMd)) {
      err(`${rel}：缺少 SKILL.md`);
      continue;
    }

    const raw = fs.readFileSync(skillMd, 'utf8');

    if (!raw.startsWith('---')) {
      err(`${rel}/SKILL.md：文件必须以第一行的 "---" 开始（frontmatter 前不能有空行或 BOM）`);
      continue;
    }

    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      err(`${rel}/SKILL.md：frontmatter 未正确闭合（需要一对 --- 包裹）`);
      continue;
    }

    const { data, body } = parsed;

    // name
    if (!data.name) {
      err(`${rel}/SKILL.md：缺少必填字段 name`);
    } else {
      if (typeof data.name !== 'string') {
        err(`${rel}/SKILL.md：name 必须是字符串`);
      } else {
        if (data.name !== dirName) {
          err(`${rel}/SKILL.md：name "${data.name}" 与目录名 "${dirName}" 不一致`);
        }
        if (!NAME_RE.test(data.name)) {
          err(`${rel}/SKILL.md：name "${data.name}" 不符合规范（仅小写字母/数字/连字符，不能以连字符开头结尾，不能有连续连字符）`);
        }
        if (data.name.length > 64) {
          err(`${rel}/SKILL.md：name 超过 64 字符`);
        }
      }
    }

    // description
    if (!data.description) {
      err(`${rel}/SKILL.md：缺少必填字段 description`);
    } else if (typeof data.description === 'string') {
      if (data.description.length > 1024) {
        err(`${rel}/SKILL.md：description 超过 1024 字符（当前 ${data.description.length}）`);
      }
      if (data.description.length < 20) {
        warn(`${rel}/SKILL.md：description 过短（${data.description.length} 字符），不利于触发路由`);
      }
    }

    // compatibility
    if (data.compatibility && typeof data.compatibility === 'string' && data.compatibility.length > 500) {
      err(`${rel}/SKILL.md：compatibility 超过 500 字符`);
    }

    // 行数
    const lineCount = raw.split(/\r?\n/).length;
    if (lineCount > MAX_SKILL_LINES) {
      warn(`${rel}/SKILL.md：${lineCount} 行，超过建议上限 ${MAX_SKILL_LINES} 行，请把内容拆到 references/`);
    }
    notes.push(`${dirName}: SKILL.md ${lineCount} 行`);

    // references 必须被 SKILL.md 引用
    const refDir = path.join(skillDir, 'references');
    if (isDir(refDir)) {
      for (const f of fs.readdirSync(refDir)) {
        if (!f.endsWith('.md')) continue;
        const fileName = `references/${f}`;
        if (!body.includes(fileName)) {
          warn(`${rel}/SKILL.md：references/${f} 未被 SKILL.md 引用，永远不会被加载`);
        }
      }
    }

    // 相对路径引用不应超过一层
    const deepRefs = body.match(/\]\((?:\.\.\/|references\/[^)]*\/[^)]*)\)/g);
    if (deepRefs) {
      warn(`${rel}/SKILL.md：存在多级相对路径引用：${deepRefs.join(', ')}`);
    }

    // 脚本应零第三方依赖（粗检）
    const scriptDir = path.join(skillDir, 'scripts');
    if (isDir(scriptDir)) {
      for (const f of fs.readdirSync(scriptDir)) {
        const full = path.join(scriptDir, f);
        if (!fs.statSync(full).isFile()) continue;
        const text = fs.readFileSync(full, 'utf8');
        if (/^\s*(import|from)\s+(requests|numpy|pandas|axios|lodash)/m.test(text)) {
          warn(`${rel}/scripts/${f}：疑似引入了第三方依赖，技能脚本应为零依赖`);
        }
      }
    }
  }

  // 根目录散装 md 检查
  const allowedRootMd = new Set(['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'AGENTS.md', 'LICENSE.md']);
  for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.md') && !allowedRootMd.has(f)) {
      warn(`根目录存在未登记的 Markdown 文件：${f}（技能内容应放在 skills/<name>/ 下）`);
    }
  }

  return finish();
}

function finish() {
  for (const n of notes) console.log(`  · ${n}`);
  console.log();
  if (warnings.length) {
    console.log('警告：');
    for (const w of warnings) console.log(`  ⚠ ${w}`);
    console.log();
  }
  if (errors.length) {
    console.log('错误：');
    for (const e of errors) console.log(`  ✘ ${e}`);
    console.log();
    console.log(`校验失败：${errors.length} 个错误，${warnings.length} 个警告`);
    process.exit(1);
  }
  console.log(`校验通过：0 个错误，${warnings.length} 个警告`);
  process.exit(0);
}

main();
