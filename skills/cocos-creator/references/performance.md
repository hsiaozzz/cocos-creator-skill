# Cocos Creator 性能优化量化指南

> 优化必须基于数据。**先测量，再改，再测量。** 没有前后对比的"优化"不成立。

## 第 0 步：建立基线

在动手之前，先拿到四个数字：

| 指标 | 获取方式 | 健康参考 |
|---|---|---|
| 帧时间 | 编辑器预览的 Profiler 面板 / `director.getTotalFrames()` 配时间戳 | 目标 16.6ms（60FPS）以内，留 20% 余量 |
| DrawCall | Profiler 面板 Renderer 分类；代码里读 `director.root.device` 相关统计或引擎调试面板 | 移动端 UI 场景 < 50，3D 场景 < 100 |
| 内存 | Profiler 面板 Memory；原生平台用 Xcode / Android Studio 看实际占用 | 小游戏包体 + 运行时内存都要盯 |
| 包体 | 构建产物 `build/` 下资源总体积 | 微信小游戏主包 4MB 上限（超了必须分包） |

**记录方式**：把优化前的数字写下来贴进 PR 或 Issue。优化后同样记录。差值就是这次改动的收益。

## 一、DrawCall 优化（收益最大，优先级最高）

DrawCall = 一次 GPU 绘制指令。合批（batching）的本质是"把多个绘制请求塞进同一条指令"。

### 合批的三个必要条件

同一批次内的 Sprite / 模型必须同时满足：

1. **同一个材质（Material）**
2. **同一张图集（Atlas / Texture）**
3. **渲染顺序连续**（中间不能被其他材质的节点打断）

### 具体手段

**1. 用自动图集（Auto Atlas）**

编辑器内 `资源管理器 → 右键 → 创建 → 自动图集配置`，把同屏出现的碎图丢进去。这是收益最高的一步。

**2. 处理层级穿插**

这是最常见的合批杀手。UI 层级形如：

```
Canvas
├── Label_A        (图集1)
├── Sprite_B       (图集2)   ← 打断
└── Sprite_C       (图集1)   ← 又回到图集1，但批次已断
```

`Sprite_C` 无法与 `Label_A` 合批。解法：

- 把同图集的节点在层级上收拢到一起
- 用多个 `Canvas` 分层（背景层 / 内容层 / 弹窗层），各层内部各自合批
- 静态背景改用一张整图（合并成一张大图，1 个 DrawCall）

**3. 减少 Mask**

`Mask` 组件会打断合批并额外产生 Stencil 操作。能用 `Sprite` 的九宫格 + 裁切代替就不要用圆形 Mask。

**4. 文字合批**

`Label` 的 `CacheMode` 设为 `CHAR`（字符图集）或 `BITMAP`，避免每次重排产生新贴图打断合批。系统字体每个字号 + 每种颜色都可能产生新图集，**同一界面尽量统一字号与颜色**。

**5. 3D 部分**

- 开启 GPU Instancing：材质里勾选对应选项，配合 `MeshRenderer` 的 `setInstancedAttribute`
- 静态物体设为 `Static`，让引擎做静态合批
- 减少 `SkinnedMeshRenderer` 数量（骨骼动画天然不合批）

## 二、内存优化

### 资源释放的正确姿势

```typescript
import { assetManager, resources, SpriteFrame, isValid } from 'cc';

// 引用计数：load 会增加引用计数，release 减少
resources.load('textures/hero', SpriteFrame, (err, sf) => {
    if (err) return;
    // 用完必须配对释放，否则资源常驻内存
    // 注意：只在确实不再需要时释放
});

// 释放整个目录 / Bundle
assetManager.releaseAsset(spriteFrame);

// 场景切换时主动清空未使用资源
assetManager.releaseUnusedAssets();
```

**关键点**：Cocos 使用引用计数。`node.destroy()` **不会**自动释放它用到的纹理 / 图集 / 音频。必须显式 `release`，或在切场景后用 `releaseUnusedAssets()` 兜底。

### 防止泄漏的检查点

- `onDestroy` 里反注册所有 `on` / `schedule` / `setTimeout` / 网络回调
- 事件总线（EventTarget）上的监听必须在组件销毁时移除，否则持有整个组件实例
- 定时器用 `this.schedule` 而不是裸 `setInterval`，前者随组件销毁自动清理

### 对象池

频繁创建销毁的节点（子弹、飘字、列表项）必须池化：

```typescript
import { NodePool, Prefab, instantiate, Node } from 'cc';

class BulletPool {
    private _pool = new NodePool();

    constructor(private _prefab: Prefab) {}

    get(): Node {
        return this._pool.size() > 0 ? this._pool.get()! : instantiate(this._prefab);
    }

    put(node: Node) {
        node.removeFromParent();
        this._pool.put(node);   // 内部会调用 node.destroy 之外的回收逻辑
    }

    clear() {
        this._pool.clear();     // 注意：clear 会真正销毁池内节点
    }
}
```

**坑**：`NodePool.put` 默认会调用 `node.removeFromParent()`，但如果你池化的节点上挂了带 `update` 的组件，回收后仍可能执行。建议在 `put` 前手动 `active = false`，取出后 `active = true`。

## 三、CPU / 主线程

### 每帧逻辑的代价

`update` 里做这些事会直接吃掉帧时间：

- `getChildByName` / `getComponent` 等查找操作 → **在 `onLoad` 里缓存结果**
- 字符串拼接、`JSON.parse` → 移到加载阶段
- 大量 `Vec3` 临时对象创建 → 复用一个字段变量
- 遍历大数组 → 分帧处理（时间切片）

### 分帧处理大任务

```typescript
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

const BATCH_SIZE = 200;   // 每帧最多处理 200 个

@ccclass('LevelLoader')
export class LevelLoader extends Component {
    private _data: number[] = [];
    private _cursor = 0;
    private _busy = false;

    update() {
        if (!this._busy) return;
        const end = Math.min(this._cursor + BATCH_SIZE, this._data.length);
        for (let i = this._cursor; i < end; i++) {
            // 处理 this._data[i]
        }
        this._cursor = end;
        if (this._cursor >= this._data.length) {
            this._busy = false;   // 本轮处理完毕
        }
    }
}
```

## 四、包体与首屏加载

### 小游戏包体限制

| 平台 | 主包限制 | 备注 |
|---|---|---|
| 微信小游戏 | 4MB（单包）/ 20MB（含分包总计，具体以官方最新为准） | 必须用分包 |
| 抖音小游戏 | 参考微信策略，通常同级 | 分包机制类似 |

### 减小包体的手段

1. **纹理压缩**：编辑器构建面板里为目标平台启用压缩纹理（Android 用 ETC2，iOS 用 ASTC/PVRTC）
2. **图片降分辨率**：UI 图不超过实际显示尺寸的 2 倍
3. **分离首屏与后续资源**：用 AssetBundle + 小游戏分包，把非首屏资源移出主包
4. **剔除未使用资源**：构建时勾选剔除选项，但要先确认无动态加载路径
5. **音频格式**：BGM 用 mp3，短音效用 mp3/ogg，避免 wav

### 分包配置（微信小游戏）

1. 编辑器 `项目设置 → 构建发布 → 微信小游戏`，开启分包
2. 把资源目录划入对应分包
3. 代码里用 `assetManager.loadBundle('sub')` 按需加载

```typescript
import { assetManager } from 'cc';

assetManager.loadBundle('level2', (err, bundle) => {
    if (err) { console.error(err); return; }
    bundle.load('prefabs/boss', Prefab, (e, prefab) => { /* ... */ });
});
```

## 五、渲染设置

- **Camera `visibility`**：UI 相机只看 UI 层，主相机剔除 UI 层，避免重复渲染
- **关闭不需要的特效**：后处理、阴影、抗锯齿在小游戏平台代价很高
- **粒子系统**：控制最大粒子数，`capacity` 不要超需
- **动态合批**：小物体太多时开启，但顶点数超标会自动失效

## 优化优先级速查

按投入产出比排序，从上往下做：

1. **先测基线** — 不知道问题在哪就没法优化
2. **图集 + 层级收拢** — DrawCall 通常能砍掉一半以上
3. **缓存在 `onLoad`** — 消除每帧查找
4. **对象池** — 消灭 GC 抖动
5. **资源释放配对** — 内存曲线压平
6. **分包 + 压缩纹理** — 包体达标
7. **分帧处理** — 消除卡顿尖刺
8. **渲染设置微调** — 最后收尾

## 反模式

- ❌ 在 `update` 里 `getComponent` / `getChildByName`
- ❌ 认为 `destroy()` 会自动释放纹理和音效
- ❌ 每个界面单独一套字号和颜色，导致 Label 无法合批
- ❌ 未测基线就"优化"，改完也不知道有没有效果
- ❌ 把所有资源都放进 `resources/`，导致首屏加载巨慢
