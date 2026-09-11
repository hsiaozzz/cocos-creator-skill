# 贡献指南

感谢你有兴趣改进这个技能包。它是社区维护的，最有价值的贡献是**修正事实性错误**。

## 最有价值的贡献类型

按价值排序：

1. **修正技术错误** —— 引擎 API 写错了、版本行为描述不准、示例代码跑不通
2. **补充新版本内容** —— 新引擎版本的 API 变化、新的发布平台、新的踩坑经验
3. **新增平台支持** —— 新的 AI Agent 平台的技能目录
4. **完善排查手册** —— 你实际遇到并解决了的问题，附上症状与根因
5. **翻译** —— README 的多语言版本

## 修改内容前请先读

- [`AGENTS.md`](AGENTS.md) —— 本仓库的结构约定与硬性规则（AI 助手也读这个文件）
- [Agent Skills 规范](https://agentskills.io/specification) —— 目录结构与 frontmatter 字段定义

## 硬性约束

### 1. 目录结构不能变

```
skills/<skill-name>/SKILL.md     # 必须是这个层级
```

仓库根目录**不能**放 `SKILL.md`。技能目录名必须与 frontmatter 的 `name` 一致。

### 2. frontmatter 必须合法

```yaml
---
name: cocos-creator
description: "..."
---
```

- `description` 里含冒号时**必须用引号包裹**，否则 YAML 解析静默失败（技能会加载不出来，且没有任何报错）
- frontmatter 必须是文件的第一行 `---` 开始，前面不能有空行或 BOM

### 3. `SKILL.md` 保持精简

上限 500 行。深度内容放 `references/`，并在 `SKILL.md` 的「渐进式参考索引」表格里登记 —— **没被引用的参考文件永远不会被加载**。

### 4. 脚本零第三方依赖

`scripts/` 下的脚本会被安装到用户机器上裸跑，只能使用标准库。

### 5. 不要写无法验证的技术断言

这是最重要的一条。凡是引擎版本相关的行为，必须满足以下至少一项：

- 在真实工程上实测过（请在 PR 描述里说明验证方式）
- 引用官方文档 / 官方仓库链接
- 明确标注「以官方文档为准」

**不确定的内容宁可删掉，也不要写成确定语气。** 一份会给出错误 API 的技能包比没有技能包更糟。

## 提交流程

```bash
# 1. Fork 并克隆
git clone https://github.com/<your-name>/cocos-creator-skill.git
cd cocos-creator-skill

# 2. 建分支
git checkout -b fix/xx

# 3. 修改后跑校验
node .github/scripts/validate-skills.mjs

# 4. 如果改了体检脚本，在真实工程上验证
python skills/cocos-creator/scripts/cocos_doctor.py --project /path/to/real/cocos/project

# 5. 提交
git commit -m "fix(scripts): 修正目录 .meta 被误判为孤儿的问题"
git push origin fix/xx
```

然后开 PR。

## 提交信息规范

用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat: 新增 COCOS 4 迁移参考文档
fix: 修正 position 引用语义的示例代码
docs: 补充 dsh 平台安装路径
chore: 更新 CI Node 版本
```

## PR 描述里请写清

- **改了什么** —— 涉及哪些文件
- **为什么** —— 触发的实际问题或依据的官方文档链接
- **怎么验证的** —— 实测方式、引擎版本；纯文档修正可写「对照官方文档 X 页面」

尤其是技术性修正，**没有验证说明的 PR 会先被追问再合并**。

## 已知的真实陷阱

如果你要改 `cocos_doctor.py`，注意这两个已经踩过的坑：

1. **Cocos 中目录也有 `.meta` 文件**。检查孤儿 `.meta` 时必须同时判断文件和目录，否则会大量误报。
2. **Creator 3.x 的版本号在 `package.json` 的 `creator.version`**，不在 `project.json`。`project.json` 是 2.x 的位置。

## 行为准则

- 讨论技术，不针对人
- 指出错误时附上依据
- 接受"这个问题我还不确定，需要验证"作为合理的结论

## 开源协议

贡献的代码与文档按 [MIT License](LICENSE) 授权。
