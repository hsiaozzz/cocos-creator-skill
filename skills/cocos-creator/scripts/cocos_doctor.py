#!/usr/bin/env python3
"""cocos_doctor - Cocos Creator 项目体检工具

检查 Cocos Creator 工程中几类「肉眼看不见、但会导致构建失败或包体失控」的问题：
  1. 资源缺失 .meta 文件（会导致资源引用丢失）
  2. 孤儿 .meta（源文件已删除但 .meta 残留）
  3. assets/resources 体积过大（首屏加载风险）
  4. 大文件（包体风险）
  5. 2.x 老式 API 残留（cc.Class / cc.Node / cc.director）
  6. 明显的事件监听未反注册（on 有、off 无）

用法：
    python cocos_doctor.py --project .
    python cocos_doctor.py --project ./my-game --json
    python cocos_doctor.py --project . --max-file-mb 1

退出码：0 = 无 ERROR；1 = 存在 ERROR 级问题。
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path

ASSET_EXTS = {
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tga",
    ".mp3", ".ogg", ".wav", ".m4a",
    ".prefab", ".scene", ".anim", ".animation", ".mtl", ".effect",
    ".ttf", ".fnt", ".plist", ".spine", ".skel", ".atlas",
    ".fbx", ".obj", ".dae", ".gltf",
    ".json", ".txt", ".csv", ".xml",
}

SKIP_DIRS = {".git", "node_modules", "library", "temp", "build", "local", ".workbuddy"}

# 2.x 老式 API 特征
LEGACY_API_PATTERNS = [
    (re.compile(r"\bcc\.Class\s*\("), "cc.Class( ) — 2.x 类定义方式"),
    (re.compile(r"\bcc\.Node\b"), "cc.Node — 2.x 全局命名空间"),
    (re.compile(r"\bcc\.director\b"), "cc.director — 2.x 全局命名空间"),
    (re.compile(r"\bcc\.instantiate\s*\("), "cc.instantiate — 2.x 全局命名空间"),
    (re.compile(r"\bcc\.v2\s*\(|\bcc\.v3\s*\("), "cc.v2/cc.v3 — 2.x 向量构造"),
]


@dataclass
class Finding:
    level: str          # ERROR | WARN | INFO
    code: str
    message: str
    paths: list = field(default_factory=list)


def iter_files(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            yield Path(dirpath) / name


def detect_version(project: Path) -> dict:
    """检测工程的目标引擎版本。

    - Creator 3.x+：根目录 package.json 的 creator.version（部分工程另有顶层 version）
    - Creator 2.x ：根目录 project.json 的 engine / version 字段
    """
    info = {"creator": None, "source": None}

    pkg = project / "package.json"
    if pkg.is_file():
        try:
            data = json.loads(pkg.read_text(encoding="utf-8"))
            creator = data.get("creator")
            if isinstance(creator, dict) and creator.get("version"):
                info["creator"] = str(creator["version"])
                info["source"] = "package.json#creator.version"
                return info
        except (json.JSONDecodeError, OSError):
            pass

    pj = project / "project.json"
    if pj.is_file():
        try:
            data = json.loads(pj.read_text(encoding="utf-8"))
            for key in ("engine", "version", "creator"):
                value = data.get(key)
                if value:
                    info["creator"] = str(value)
                    info["source"] = f"project.json#{key}"
                    return info
        except (json.JSONDecodeError, OSError):
            pass

    return info


def check_meta(assets: Path) -> list[Finding]:
    findings: list[Finding] = []
    missing: list[str] = []
    orphan: list[str] = []

    for f in iter_files(assets):
        if str(f).endswith(".meta"):
            continue
        if f.name.startswith("."):
            continue
        suffix = f.suffix.lower()

        meta = f.with_name(f.name + ".meta")
        if suffix in ASSET_EXTS:
            if not meta.is_file():
                missing.append(str(f.relative_to(assets)))
        elif suffix in {".ts", ".js"}:
            if not meta.is_file():
                missing.append(str(f.relative_to(assets)))

    for f in iter_files(assets):
        if f.suffix == ".meta":
            src = f.with_name(f.name[: -len(".meta")])
            # 注意：Cocos 中「目录」同样会有 .meta 文件，因此必须同时允许目录
            if not src.is_file() and not src.is_dir():
                orphan.append(str(f.relative_to(assets)))

    if missing:
        findings.append(Finding(
            "ERROR", "META_MISSING",
            f"{len(missing)} 个资源缺少 .meta 文件，构建时资源引用会丢失",
            sorted(missing)[:40],
        ))
    if orphan:
        findings.append(Finding(
            "WARN", "META_ORPHAN",
            f"{len(orphan)} 个 .meta 没有对应源文件（源文件可能已被删除）",
            sorted(orphan)[:40],
        ))
    return findings


def dir_size(path: Path) -> int:
    total = 0
    for f in iter_files(path):
        try:
            total += f.stat().st_size
        except OSError:
            pass
    return total


def human(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f}{unit}" if unit != "B" else f"{n}{unit}"
        n /= 1024.0
    return f"{n:.1f}GB"


def check_sizes(assets: Path, max_file_mb: float) -> list[Finding]:
    findings: list[Finding] = []

    big: list[tuple[str, int]] = []
    limit = max_file_mb * 1024 * 1024
    for f in iter_files(assets):
        if f.suffix == ".meta":
            continue
        try:
            size = f.stat().st_size
        except OSError:
            continue
        if size > limit:
            big.append((str(f.relative_to(assets)), size))

    if big:
        big.sort(key=lambda x: -x[1])
        findings.append(Finding(
            "WARN", "BIG_ASSET",
            f"{len(big)} 个资源超过 {max_file_mb}MB，存在包体与加载耗时风险",
            [f"{p} ({human(s)})" for p, s in big[:20]],
        ))

    res = assets / "resources"
    if res.is_dir():
        size = dir_size(res)
        level = "INFO"
        msg = f"assets/resources 体积 {human(size)}"
        if size > 40 * 1024 * 1024:
            level = "WARN"
            msg += " — 该目录下所有资源都会进主包并可能被全量加载，建议迁出大资源改用 AssetBundle"
        findings.append(Finding(level, "RESOURCES_SIZE", msg,
                                [f"assets/resources = {human(size)}"]))
    return findings


def check_legacy_api(assets: Path) -> list[Finding]:
    hits: list[str] = []
    for f in iter_files(assets):
        if f.suffix not in {".ts", ".js"}:
            continue
        if f.name.endswith(".d.ts"):
            continue
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for pattern, label in LEGACY_API_PATTERNS:
            if pattern.search(text):
                hits.append(f"{f.relative_to(assets)} → {label}")

    if hits:
        return [Finding(
            "WARN", "LEGACY_API",
            f"{len(hits)} 处命中 2.x 老式 API 特征（3.x/COCOS 4 下不可用）",
            sorted(hits)[:30],
        )]
    return []


def check_event_leak(assets: Path) -> list[Finding]:
    """粗略检测：同一文件里 on(...) 数量显著多于 off(...) 数量。"""
    suspects: list[str] = []
    on_re = re.compile(r"\.\s*on\s*\(\s*(?:Node\.EventType\.|Input\.EventType\.|['\"])")
    off_re = re.compile(r"\.\s*off\s*\(")

    for f in iter_files(assets):
        if f.suffix not in {".ts", ".js"} or f.name.endswith(".d.ts"):
            continue
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        on_count = len(on_re.findall(text))
        off_count = len(off_re.findall(text))
        if on_count >= 2 and off_count == 0 and "onDestroy" not in text and "onDisable" not in text:
            suspects.append(f"{f.relative_to(assets)} (on×{on_count}, off×0, 无 onDestroy/onDisable)")

    if suspects:
        return [Finding(
            "WARN", "EVENT_LEAK",
            f"{len(suspects)} 个脚本注册了事件但看不到反注册，场景切换后可能内存泄漏",
            sorted(suspects)[:20],
        )]
    return []


def run(project: Path, max_file_mb: float) -> tuple[list[Finding], dict]:
    assets = project / "assets"
    version = detect_version(project)
    findings: list[Finding] = []

    if not assets.is_dir():
        findings.append(Finding(
            "ERROR", "NO_ASSETS",
            f"未在 {project} 下找到 assets/ 目录，请用 --project 指向 Cocos Creator 工程根目录",
            [],
        ))
        return findings, version

    findings += check_meta(assets)
    findings += check_sizes(assets, max_file_mb)
    findings += check_legacy_api(assets)
    findings += check_event_leak(assets)
    return findings, version


def main() -> int:
    parser = argparse.ArgumentParser(description="Cocos Creator 项目体检工具")
    parser.add_argument("--project", default=".", help="Cocos Creator 工程根目录（含 assets/）")
    parser.add_argument("--max-file-mb", type=float, default=2.0, help="单个资源体积告警阈值（MB），默认 2")
    parser.add_argument("--json", action="store_true", help="以 JSON 格式输出")
    args = parser.parse_args()

    project = Path(args.project).expanduser().resolve()
    findings, version = run(project, args.max_file_mb)

    errors = [f for f in findings if f.level == "ERROR"]
    warns = [f for f in findings if f.level == "WARN"]

    if args.json:
        print(json.dumps({
            "project": str(project),
            "version": version,
            "errors": len(errors),
            "warnings": len(warns),
            "findings": [asdict(f) for f in findings],
        }, ensure_ascii=False, indent=2))
        return 1 if errors else 0

    print("=" * 60)
    print("Cocos Creator 项目体检报告")
    print("=" * 60)
    print(f"工程目录 : {project}")
    if version["creator"]:
        print(f"引擎版本 : {version['creator']}  (来自 {version['source']})")
    else:
        print("引擎版本 : 未检测到（project.json 缺失或无版本字段）")
    print()

    if not findings:
        print("✅ 未发现问题。")
        return 0

    order = {"ERROR": 0, "WARN": 1, "INFO": 2}
    icon = {"ERROR": "❌", "WARN": "⚠️ ", "INFO": "ℹ️ "}
    for f in sorted(findings, key=lambda x: order[x.level]):
        print(f"{icon[f.level]} [{f.code}] {f.message}")
        for p in f.paths:
            print(f"      - {p}")
        if len(f.paths) >= 40:
            print("      …（仅显示前 40 条）")
        print()

    print("-" * 60)
    print(f"汇总：{len(errors)} 个错误，{len(warns)} 个警告")
    if errors:
        print("请先修复「错误」项，再考虑提交或构建。")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
