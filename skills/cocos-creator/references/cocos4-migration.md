# Cocos Creator 3.8 → COCOS 4 迁移参考

> **版本事实**：COCOS 4 于 2026 年 1 月宣布以 **MIT 许可完全开源**，引擎仓库 `cocos/cocos4`，CLI 仓库 `cocos/cocos-cli`，原 Cocos Creator 的商业条款被移除。
>
> 本文件记录迁移时的关注点。**当官方迁移文档与本文冲突时，以官方文档为准。**
> 引擎仓库：https://github.com/cocos/cocos4 · CLI 仓库：https://github.com/cocos/cocos-cli

## 一、定位关系：COCOS 4 是 3.x 的演进，不是重写

官方明确 COCOS 4 **是 Cocos Creator 3.x 的演进版**，长期承诺前向兼容，遵循 SemVer 边界，弃用项到移除项之间保留不少于 6 个月的过渡期。

这意味着：

- **大部分 3.8 代码可以直接运行**，不需要全量重写
- 迁移的主要工作是：处理弃用警告、适配构建方式（GUI → CLI）、以及采用新的 AI-Native 能力
- 2.x → 3.x 那种"API 全换"的情况**不会**在 3.8 → COCOS 4 上重演

## 二、迁移执行流程

### 第 1 步：先做兼容性基线

```bash
# 1) 记录当前版本
cat project.json | grep -i version

# 2) 全量类型检查，把现有问题摸清
npx tsc --noEmit -p tsconfig.json

# 3) 搜索已知高风险 API（见下表）
grep -rn "cc\.Class\|cc\.Node\|cc\.director" assets/scripts/ || echo "无 2.x 老 API"
```

**关键**：先确认现有代码在 3.8 下是干净的。如果当前已经有一堆弃用警告，升级后无法区分"新引入"和"旧遗留"。

### 第 2 步：在新分支上升级

```bash
git checkout -b upgrade/cocos4
```

用 COCOS 4 打开项目副本（**不要直接动主分支的工作目录**），让引擎做自动脚本迁移与资源重导入。

### 第 3 步：逐项验证

按这个顺序验证，出问题最容易定位：

1. 项目能打开、无导入报错
2. `tsc --noEmit` 通过
3. 每个场景能独立预览
4. 核心玩法可跑通
5. 各目标平台构建通过

## 三、需要重点检查的 API 与行为

以下是 3.x 系列中容易被弃用或行为调整的区域，升级后逐一排查（**具体以官方 changelog 为准**）：

| 区域 | 关注点 |
|---|---|
| 装饰器 | `@property` 的复杂类型声明、`@executeInEditMode`、`@menu` 的用法是否有调整 |
| 节点变换 | `Node.position` / `rotation` / `scale` 的 getter 返回语义（3.8.5 曾调整 setter 行为，注意版本间差异） |
| 资源管理 | `assetManager` 的 Bundle 加载与会话释放逻辑 |
| 渲染管线 | 自定义渲染管线的默认资源与 pass 合并行为（3.8.8 起有优化） |
| Spine | `skeletonData` 的骨骼缓存、动画间骨骼数据一致性（历史 bug 多发区） |
| 2D 物理 | `RigidBody2D` 类型变更后 `PhysicWorld` 的 `_animatedBodies` 同步 |
| 富文本 / 列表 | 官方将这两块列为持续优化重点，行为可能有变化 |

### 代码迁移示例：老 API → 新 API

```typescript
// ❌ 2.x 风格（3.x 及以后不适用）
cc.Class({
    extends: cc.Component,
    properties: { speed: 100 },
    update(dt) { this.node.x += this.speed * dt; }
});

// ✅ 3.x / COCOS 4 风格
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Mover')
export class Mover extends Component {
    @property
    speed = 100;

    update(dt: number) {
        const p = this.node.position;
        this.node.setPosition(p.x + this.speed * dt, p.y, p.z);
    }
}
```

## 四、构建方式：从 GUI 到 Headless CLI

这是迁移中最实际的变化。COCOS 4 把编辑器能力逐步迁到 **Headless 模式**，通过 CLI 调用。

对团队的实际影响：

- **CI/CD 变得可行**：不需要人工打开编辑器点"构建"，构建可以进流水线
- **需要重新写构建脚本**：原来在构建面板里配的东西，要迁到命令行参数或配置文件
- **本地开发流程不变**：日常还是可以用编辑器

> 具体命令、参数、平台标识符请查阅 `cocos-cli` 官方文档，不要按记忆拼参数。

## 五、AI-Native 方向的变化（对使用 AI 编码工具的人尤其重要）

官方公布的长期迭代方向里，对我们用 AI 写游戏影响最大的两条：

1. **"AI Native" 优先**
   - JS/TS 仍是主语言，但所有迭代以 **AI 友好**为优先
   - 新功能交付形式偏向 **MCP / Agent**，而不是传统库或框架
   - 官方原话大意：UI 组件不再只以"可调用的库"形式提供，而会以**可直接交付的 Agent** 形式提供

   实际含义：未来可能存在官方 MCP Server，让 AI 直接操作引擎，而不是靠人写代码。**使用时先查官方是否已提供 MCP，不要自己造轮子。**

2. **轻量化与跨平台补齐**
   - 引擎更小更快、高度模块化
   - 原生平台持续补齐（如 Steam 等此前不支持的平台）
   - 各小游戏平台逐步统一

## 六、迁移检查清单

- [ ] 已确认目标版本号（不靠"最新版"这种模糊说法）
- [ ] 已在独立分支操作，主分支保留可回滚点
- [ ] 迁移前的 `tsc --noEmit` 基线已记录
- [ ] 无 `cc.Class` / `cc.Node` 等 2.x 老 API 残留
- [ ] 每个场景单独预览通过
- [ ] `.meta` 文件全部随资源一起提交，无断链
- [ ] 构建脚本已从 GUI 配置迁到 CLI 或明确的配置方式
- [ ] 至少一个目标平台构建成功并真机验证
- [ ] 弃用警告已处理或明确记录为已知遗留
- [ ] 第三方插件（Spine / DragonBones / 龙骨 / 商城资源）确认有 COCOS 4 兼容版本

## 七、什么时候不该升级

升级不是默认正确的选择。以下情况建议留在 3.8.x：

- 项目临近上线或正处于大版本发版期
- 依赖的第三方插件 / 中间件明确不支持 COCOS 4
- 团队没有余量做全平台回归测试
- 当前版本没有阻塞性问题

**3.8.x 仍是长期主力稳定版（3.8.9 为 2026 年最新补丁），留在 3.8 是完全合理的工程决策。**

## 八、参考

- COCOS 4 引擎仓库：https://github.com/cocos/cocos4
- COCOS CLI 仓库：https://github.com/cocos/cocos-cli
- Cocos Creator 3.8 文档：https://docs.cocos.com/creator/3.8/manual/zh/
- 中文社区（迁移相关问题的高质量来源）：https://forum.cocos.org/
