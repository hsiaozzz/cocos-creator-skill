# Cocos Creator 3.8 专家技能

Cocos Creator 跨平台 2D/3D 游戏引擎开发助手。提供代码示例、架构建议、最佳实践和问题解答。

## 触发场景

当用户提到以下关键词时触发此技能：
- Cocos Creator、Cocos、Creator
- 游戏开发、游戏引擎
- 2D/3D 游戏制作
- 跨平台游戏发布
- 场景、节点、组件、预制体
- TypeScript/JavaScript 游戏脚本
- 动画系统、物理系统、UI系统
- 微信小游戏、抖音小游戏等小游戏平台

## 核心能力

### 1. 脚本开发指导

提供 TypeScript 组件脚本开发支持：

```typescript
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MyComponent')
export class MyComponent extends Component {
    @property(Node)
    targetNode: Node | null = null;
    
    start() {
        // 初始化逻辑
    }
    
    update(deltaTime: number) {
        // 每帧更新
    }
}
```

**常用生命周期回调：**
- `start()` - 组件第一次激活时调用
- `update(dt)` - 每帧调用
- `lateUpdate(dt)` - update 之后调用
- `onEnable()` - 组件启用时
- `onDisable()` - 组件禁用时
- `onDestroy()` - 组件销毁时

### 2. 节点与组件操作

```typescript
// 获取节点
this.node.getChildByName('childName');
this.node.children; // 子节点数组

// 获取组件
this.getComponent(MyComponent);
this.node.getComponent(MyComponent);
this.node.getComponentInChildren(MyComponent);

// 添加/移除节点
const newNode = instantiate(this.prefab);
this.node.addChild(newNode);
newNode.removeFromParent();
newNode.destroy();
```

### 3. 事件系统

```typescript
// 监听事件
this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.on('custom-event', this.onCustomEvent, this);

// 触发事件
this.node.emit('custom-event', data);

// 全局事件
director.getScene()?.on('scene-event', this.onSceneEvent, this);
```

### 4. 动画系统

```typescript
import { Animation, tween, Vec3 } from 'cc';

// 使用 Animation 组件
const anim = this.getComponent(Animation);
anim.play('clipName');
anim.stop();

// 使用 Tween
tween(this.node)
    .to(1, { position: new Vec3(100, 0, 0) })
    .to(0.5, { scale: new Vec3(2, 2, 2) })
    .call(() => console.log('动画完成'))
    .start();
```

### 5. 物理系统

```typescript
import { RigidBody, Collider, ICollisionEvent } from 'cc';

// 刚体
const rigidBody = this.getComponent(RigidBody);
rigidBody.applyForce(new Vec3(0, 10, 0));

// 碰撞检测
const collider = this.getComponent(Collider);
collider.on('onCollisionEnter', (event: ICollisionEvent) => {
    console.log('碰撞发生');
});
```

### 6. UI 系统

```typescript
import { Label, Button, Sprite, Color } from 'cc';

// Label 文字
const label = this.node.getComponent(Label);
label.string = 'Hello Cocos';
label.color = new Color(255, 0, 0);

// Button 按钮
const button = this.node.getComponent(Button);
button.node.on(Node.EventType.TOUCH_END, this.onClick, this);

// Widget 对齐
import { Widget } from 'cc';
const widget = this.node.getComponent(Widget);
widget.isAlignTop = true;
widget.top = 10;
```

### 7. 资源加载

```typescript
import { resources, Prefab, instantiate, AssetManager } from 'cc';

// 加载资源
resources.load('prefabs/enemy', Prefab, (err, prefab) => {
    if (err) return;
    const node = instantiate(prefab);
    this.node.addChild(node);
});

// 动态加载
resources.loadDir('textures', SpriteFrame, (err, spriteFrames) => {
    // 加载目录下所有 SpriteFrame
});
```

### 8. 场景管理

```typescript
import { director, Scene } from 'cc';

// 切换场景
director.loadScene('game-scene');

// 预加载场景
director.preloadScene('game-scene', (err) => {
    console.log('场景预加载完成');
});

// 获取当前场景
const scene = director.getScene();
```

## 发布平台支持

Cocos Creator 3.8 支持以下平台发布：

**原生平台：**
- iOS / Android
- Windows / macOS
- HarmonyOS / HarmonyOS Next

**Web 平台：**
- Web Mobile (H5)
- Web Desktop

**小游戏平台：**
- 微信小游戏
- 抖音小游戏
- 淘宝小程序创意互动
- Facebook Instant Games
- OPPO / vivo / 华为 / 小米快游戏

## 最佳实践

### 项目结构建议

```
assets/
├── scenes/          # 场景文件
├── scripts/         # TypeScript 脚本
│   ├── components/  # 组件脚本
│   ├── managers/    # 管理器类
│   └── utils/       # 工具类
├── prefabs/         # 预制体
├── textures/        # 图片资源
├── audio/           # 音频资源
├── animations/      # 动画资源
└── materials/       # 材质资源
```

### 性能优化建议

1. **DrawCall 优化**
   - 使用图集 (Atlas) 合并图片
   - 减少 Material 数量
   - 合理使用动态合批

2. **内存优化**
   - 及时释放不用的资源
   - 使用对象池复用节点
   - 避免频繁 instantiate/destroy

3. **渲染优化**
   - 合理设置 Camera 的 Visibility
   - 使用遮挡剔除
   - 控制粒子数量

### 代码规范

```typescript
// 推荐：使用 const enum 定义常量
const enum GameConfig {
    PLAYER_SPEED = 100,
    JUMP_FORCE = 200,
}

// 推荐：使用命名空间组织工具函数
namespace MathUtils {
    export function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }
}

// 推荐：单例模式
export class GameManager {
    private static _instance: GameManager;
    public static get instance(): GameManager {
        return this._instance;
    }
}
```

## 常见问题解决

### Q: 组件属性在属性检查器中不显示？
A: 确保：
1. 使用 `@property` 装饰器
2. 属性类型正确（Node, Prefab, SpriteFrame 等）
3. 脚本已编译无错误

### Q: 动态加载资源失败？
A: 检查：
1. 资源路径是否正确（不含扩展名）
2. 资源是否在 resources 目录下
3. 资源类型是否匹配

### Q: 物理碰撞不触发？
A: 确认：
1. 节点有 RigidBody 组件
2. 节点有 Collider 组件
3. Collider 的 onCollisionEnter 事件已监听
4. 物理系统在项目设置中已启用

### Q: UI 在不同分辨率下显示异常？
A: 解决方案：
1. 设置正确的设计分辨率
2. 使用 Widget 组件对齐
3. 配置 Canvas 的适配模式

## 官方资源

- **文档**: https://docs.cocos.com/creator/3.8/manual/zh/
- **API 参考**: https://docs.cocos.com/creator/3.8/api/zh/
- **论坛**: https://forum.cocos.org/
- **示例项目**: https://github.com/cocos/cocos-test-projects
- **Cocos Store**: https://store.cocos.com

## 版本说明

本技能基于 Cocos Creator 3.8 版本，主要特性包括：
- 程序化动画
- 高精度文本
- 可定制渲染管线
- 角色控制器
- Marionette 动画系统

注意：3.x 与 2.x API 不完全兼容，请确认项目版本。
