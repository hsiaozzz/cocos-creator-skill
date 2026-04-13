# Cocos Creator 常见问题排查指南

## 编辑器问题

### 1. 编辑器启动失败

**症状**：编辑器无法启动或闪退

**排查步骤**：
1. 检查系统环境：Windows 10+ / macOS 10.15+
2. 检查 Node.js 版本：需要 16.x 或以上
3. 清除缓存：删除 `~/.CocosCreator` 或 `%USERPROFILE%\.CocosCreator`
4. 重新安装编辑器

### 2. 项目打开失败

**症状**：项目无法打开或显示空白

**排查步骤**：
1. 检查项目路径是否包含中文或特殊字符
2. 检查项目版本是否与编辑器版本匹配
3. 删除项目下的 `temp` 和 `library` 目录
4. 尝试新建项目测试是否正常

### 3. 预览无法运行

**症状**：点击预览按钮无响应或报错

**排查步骤**：
1. 检查浏览器控制台错误信息
2. 检查脚本是否有语法错误
3. 清除浏览器缓存
4. 尝试使用模拟器预览

## 脚本问题

### 1. 组件属性不显示

**症状**：属性检查器中看不到脚本属性

**原因**：
- 未使用 `@property` 装饰器
- 属性类型不支持
- 脚本编译错误

**解决方案**：
```typescript
// ❌ 错误
export class MyComponent extends Component {
    speed = 100;  // 不会显示
}

// ✅ 正确
@ccclass('MyComponent')
export class MyComponent extends Component {
    @property
    speed: number = 100;  // 会显示
    
    @property(Node)
    targetNode: Node | null = null;  // 引用类型需要声明
}
```

### 2. 组件获取失败

**症状**：`getComponent()` 返回 null

**排查步骤**：
1. 确认节点上已添加该组件
2. 确认组件类型参数正确
3. 检查脚本是否已编译

```typescript
// ❌ 错误
const comp = this.getComponent('MyComponent');  // 字符串方式不可靠

// ✅ 正确
const comp = this.getComponent(MyComponent);  // 使用类引用
```

### 3. 生命周期不执行

**症状**：start/update 等回调不执行

**原因**：
- 组件未激活
- 节点未激活
- 方法名拼写错误
- 脚本继承错误

**解决方案**：
```typescript
// ❌ 错误
class MyComponent extends Component {
    Start() {}  // 大写 S，不会执行
    update() {}  // 缺少 deltaTime 参数
}

// ✅ 正确
class MyComponent extends Component {
    start() {}  // 小写 s
    update(deltaTime: number) {}  // 必须有参数
}
```

### 4. this 指向问题

**症状**：回调函数中 this 为 undefined

**解决方案**：
```typescript
// ❌ 错误
setTimeout(function() {
    this.doSomething();  // this 丢失
}, 1000);

// ✅ 正确方式1：箭头函数
setTimeout(() => {
    this.doSomething();
}, 1000);

// ✅ 正确方式2：bind
setTimeout(this.doSomething.bind(this), 1000);

// ✅ 正确方式3：事件监听时指定 target
node.on('touchstart', this.onTouch, this);
```

## 资源问题

### 1. 资源加载失败

**症状**：resources.load 回调返回错误

**排查步骤**：
1. 确认资源路径正确（不含扩展名）
2. 确认资源在 `resources` 目录下
3. 确认资源类型匹配
4. 检查资源是否损坏

```typescript
// ❌ 错误
resources.load('textures/hero.png', SpriteFrame, callback);  // 不需要扩展名

// ✅ 正确
resources.load('textures/hero/spriteFrame', SpriteFrame, callback);
```

### 2. 图片显示异常

**症状**：图片不显示或显示错误

**排查步骤**：
1. 检查图片格式：支持 png/jpg/webp/bmp/tga
2. 检查图片是否被正确导入
3. 检查 Sprite 组件的 SpriteFrame 属性
4. 检查图片尺寸（2的幂次方最佳）

### 3. 预制体实例化失败

**症状**：instantiate 返回 null 或报错

**解决方案**：
```typescript
// ❌ 错误
const node = instantiate('prefabs/enemy');  // 不能直接用路径

// ✅ 正确：先加载再实例化
resources.load('prefabs/enemy', Prefab, (err, prefab) => {
    if (err) return;
    const node = instantiate(prefab);
    this.node.addChild(node);
});
```

## 渲染问题

### 1. 模型不显示

**症状**：3D 模型看不到

**排查步骤**：
1. 检查 Camera 是否存在且激活
2. 检查模型的 layer 和 Camera 的 Visibility
3. 检查模型材质是否正确
4. 检查模型位置是否在 Camera 视野内
5. 检查光照设置

### 2. UI 不显示

**症状**：UI 元素看不到

**排查步骤**：
1. 确认 UI 节点在 Canvas 下
2. 检查 Canvas 关联的 Camera
3. 检查 UI 节点的 layer
4. 检查 UITransform 组件
5. 检查节点的 active 状态

### 3. 渲染顺序错误

**症状**：渲染层级不符合预期

**解决方案**：
- 2D/UI：调整节点在 Canvas 下的顺序
- 3D：调整 Camera 的 priority 或节点的渲染队列

## 物理问题

### 1. 碰撞不触发

**症状**：碰撞事件不执行

**排查步骤**：
1. 确认物理系统已启用（项目设置 -> 功能裁剪）
2. 确认节点有 RigidBody 组件
3. 确认节点有 Collider 组件
4. 确认 Collider 的 isTrigger 设置正确
5. 确认事件监听正确

```typescript
// ❌ 错误：忘记指定 target
collider.on('onCollisionEnter', this.onCollision);

// ✅ 正确
collider.on('onCollisionEnter', this.onCollision, this);
```

### 2. 刚体穿透

**症状**：快速移动的物体穿透碰撞体

**解决方案**：
1. 使用连续碰撞检测（CCD）
2. 降低物理步长
3. 限制刚体最大速度
4. 增加碰撞体厚度

### 3. 物理性能问题

**症状**：物理计算卡顿

**解决方案**：
1. 减少物理对象数量
2. 使用静态碰撞体替代动态刚体
3. 合并碰撞体
4. 调整物理步长

## 动画问题

### 1. 动画不播放

**症状**：Animation.play 无效果

**排查步骤**：
1. 确认 Animation 组件已添加
2. 确认 AnimationClip 已赋值
3. 确认动画名称正确
4. 检查动画组件的 enable 状态

### 2. 骨骼动画异常

**症状**：骨骼动画显示错误

**排查步骤**：
1. 检查模型导入设置
2. 检查骨骼绑定
3. 检查动画剪辑配置
4. 尝试重新导入模型

### 3. Tween 动画卡顿

**症状**：Tween 动画不流畅

**解决方案**：
1. 避免在 update 中创建 Tween
2. 使用对象池复用 Tween
3. 减少同时运行的 Tween 数量
4. 使用 Animation 组件替代复杂 Tween

## UI 问题

### 1. 多分辨率适配异常

**症状**：不同设备显示不一致

**解决方案**：
1. 设置正确的设计分辨率
2. 使用 Widget 组件对齐
3. 配置 Canvas 适配模式
4. 测试多种分辨率

### 2. 点击事件不响应

**症状**：按钮点击无效

**排查步骤**：
1. 检查节点是否有 UITransform 组件
2. 检查节点 active 状态
3. 检查是否有遮挡节点
4. 检查 Button 的 interactable 属性
5. 检查事件监听代码

### 3. 列表滚动卡顿

**症状**：ScrollView 滚动不流畅

**解决方案**：
1. 使用虚拟列表（只渲染可见项）
2. 优化列表项复杂度
3. 使用对象池复用列表项
4. 减少每帧的布局计算

## 发布问题

### 1. 构建失败

**症状**：构建过程报错

**排查步骤**：
1. 检查构建选项配置
2. 检查原生环境配置（Android/iOS）
3. 查看构建日志定位错误
4. 尝试清理构建缓存

### 2. 原生平台运行异常

**症状**：原生包崩溃或黑屏

**排查步骤**：
1. 检查原生依赖是否完整
2. 检查权限配置
3. 查看原生日志（adb logcat / Xcode）
4. 检查资源路径

### 3. 小游戏发布失败

**症状**：小游戏构建或上传失败

**排查步骤**：
1. 检查小游戏开发者工具
2. 检查小游戏配置（appid 等）
3. 检查资源大小限制
4. 检查 API 兼容性

## 性能问题

### 1. 卡顿/掉帧

**排查步骤**：
1. 使用编辑器性能面板分析
2. 检查 DrawCall 数量
3. 检查三角形面数
4. 检查脚本逻辑耗时

**优化方案**：
- 合并图集减少 DrawCall
- 使用 LOD 降低远处模型面数
- 优化物理计算
- 使用对象池减少 GC

### 2. 内存占用过高

**排查步骤**：
1. 检查资源加载策略
2. 检查是否有内存泄漏
3. 检查对象池使用

**优化方案**：
- 及时释放不用的资源
- 使用延迟加载
- 优化纹理大小
- 使用压缩纹理格式

### 3. 包体过大

**优化方案**：
- 压缩纹理资源
- 使用资源远程加载
- 移除未使用的资源
- 使用引擎裁剪

## 调试技巧

### 1. 日志输出

```typescript
// 普通日志
console.log('信息');
console.warn('警告');
console.error('错误');

// 带标签的日志
console.log('[MyComponent]', '信息');

// 条件日志
if (DEBUG) {
    console.log('调试信息');
}
```

### 2. 断点调试

1. 在编辑器预览时打开浏览器开发者工具
2. 在 Sources 面板找到编译后的脚本
3. 设置断点进行调试

### 3. 性能分析

```typescript
// 计时
console.time('operation');
// ... 操作
console.timeEnd('operation');

// 性能标记
performance.mark('start');
// ... 操作
performance.mark('end');
performance.measure('operation', 'start', 'end');
```

## 获取帮助

1. **官方文档**: https://docs.cocos.com/creator/3.8/manual/zh/
2. **API 参考**: https://docs.cocos.com/creator/3.8/api/zh/
3. **官方论坛**: https://forum.cocos.org/
4. **GitHub Issues**: https://github.com/cocos/cocos-engine/issues
5. **社区教程**: 搜索 Cocos Creator 教程
