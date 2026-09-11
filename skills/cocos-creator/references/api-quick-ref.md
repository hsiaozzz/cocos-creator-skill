# Cocos Creator 3.8 API 快速参考

## 常用模块导入

```typescript
import {
    _decorator,
    Component,
    Node,
    Vec2,
    Vec3,
    Vec4,
    Color,
    Quat,
    Mat4,
    tween,
    Tween,
    UITransform,
    Label,
    Sprite,
    SpriteFrame,
    Button,
    ProgressBar,
    Slider,
    EditBox,
    ScrollView,
    Layout,
    Widget,
    Mask,
    Camera,
    Canvas,
    director,
    game,
    input,
    Input,
    EventKeyboard,
    EventTouch,
    KeyCode,
    resources,
    AssetManager,
    Prefab,
    instantiate,
    AudioSource,
    AudioClip,
    Animation,
    AnimationClip,
    SkeletalAnimation,
    RigidBody,
    Collider,
    BoxCollider,
    SphereCollider,
    CapsuleCollider,
    PhysicsSystem,
    find,
    sys,
    view,
    screen,
    settings,
    macro,
    Material,
    MeshRenderer,
    ModelComponent,
    Light,
    DirectionalLight,
    PointLight,
    SpotLight,
    Ambient,
    Skybox,
    Fog,
    Shadow,
    ParticleSystem,
    ParticleSystem2D,
    TiledMap,
    Spine,
    DragonBones,
} from 'cc';
```

## Vec3 常用操作

```typescript
// 创建
const v1 = new Vec3(1, 2, 3);
const v2 = Vec3.ZERO;      // (0, 0, 0)
const v3 = Vec3.ONE;       // (1, 1, 1)
const v4 = Vec3.UP;        // (0, 1, 0)
const v5 = Vec3.DOWN;      // (0, -1, 0)
const v6 = Vec3.FORWARD;   // (0, 0, -1)
const v7 = Vec3.BACK;      // (0, 0, 1)
const v8 = Vec3.RIGHT;     // (1, 0, 0)
const v9 = Vec3.LEFT;      // (-1, 0, 0)

// 运算
Vec3.add(out, a, b);           // 加法
Vec3.sub(out, a, b);           // 减法
Vec3.multiply(out, a, b);      // 乘法
Vec3.divide(out, a, b);        // 除法
Vec3.scale(out, a, s);         // 标量乘法
Vec3.negate(out, a);           // 取反

Vec3.dot(a, b);                // 点积
Vec3.cross(out, a, b);         // 叉积
Vec3.distance(a, b);           // 距离
Vec3.len(a);                   // 长度
Vec3.lenSqr(a);                // 长度平方

Vec3.normalize(out, a);        // 归一化
Vec3.lerp(out, a, b, t);       // 线性插值
Vec3.clone(a);                 // 克隆
Vec3.copy(out, a);             // 复制

// 实例方法
v1.add(v2);
v1.subtract(v2);
v1.multiply(v2);
v1.multiplyScalar(s);
v1.length();
v1.normalize();
v1.clone();
v1.set(x, y, z);
v1.equals(v2);
```

## Node 常用属性和方法

```typescript
// 变换属性
node.position: Vec3;           // 位置
node.rotation: Quat;           // 旋转（四元数）
node.eulerAngles: Vec3;        // 欧拉角
node.scale: Vec3;              // 缩放
node.worldPosition: Vec3;      // 世界位置
node.worldRotation: Quat;      // 世界旋转
node.worldScale: Vec3;         // 世界缩放
node.worldMatrix: Mat4;        // 世界矩阵

// 设置方法
node.setPosition(x, y, z);
node.setPosition(new Vec3(x, y, z));
node.setRotationFromEuler(x, y, z);
node.setRotationFromEuler(new Vec3(x, y, z));
node.setScale(x, y, z);
node.setScale(new Vec3(x, y, z));

// 层级关系
node.parent: Node | null;
node.children: Node[];
node.addChild(child);
node.removeChild(child);
node.removeFromParent();
node.removeAllChildren();
node.getChildByName(name);
node.getChildByPath('path/to/child');
node.getSiblingIndex();
node.setSiblingIndex(index);

// 组件操作
node.getComponent(T);
node.getComponents(T);
node.getComponentInChildren(T);
node.getComponentsInChildren(T);
node.addComponent(T);
node.removeComponent(component);

// 查找节点
find('path/to/node');          // 全局查找
node.find('path/to/node');     // 相对查找

// 激活状态
node.active: boolean;
node.activeInHierarchy: boolean;  // 是否在层级中激活

// 名称和 UUID
node.name: string;
node.uuid: string;

// 销毁
node.destroy();
node.isValid: boolean;
```

## Component 常用生命周期

```typescript
class MyComponent extends Component {
    // 组件加载时（仅一次）
    onLoad() {}
    
    // 组件启用时
    onEnable() {}
    
    // 第一次 update 之前
    start() {}
    
    // 每帧更新
    update(deltaTime: number) {}
    
    // update 之后更新
    lateUpdate(deltaTime: number) {}
    
    // 组件禁用时
    onDisable() {}
    
    // 组件销毁时
    onDestroy() {}
}
```

## 事件系统

```typescript
// Node 事件类型
Node.EventType.TOUCH_START
Node.EventType.TOUCH_MOVE
Node.EventType.TOUCH_END
Node.EventType.TOUCH_CANCEL
Node.EventType.MOUSE_DOWN
Node.EventType.MOUSE_MOVE
Node.EventType.MOUSE_UP
Node.EventType.MOUSE_ENTER
Node.EventType.MOUSE_LEAVE
Node.EventType.MOUSE_WHEEL
Node.EventType.FOCUS_IN
Node.EventType.FOCUS_OUT
Node.EventType.SIZE_CHANGED
Node.EventType.TRANSFORM_CHANGED

// 监听事件
node.on(type, callback, target);
node.once(type, callback, target);  // 只触发一次
node.off(type, callback, target);

// 触发事件
node.emit(type, ...args);
node.dispatchEvent(event);

// Input 系统
input.on(Input.EventType.KEY_DOWN, callback, target);
input.on(Input.EventType.KEY_UP, callback, target);
input.on(Input.EventType.MOUSE_DOWN, callback, target);
input.on(Input.EventType.MOUSE_MOVE, callback, target);
input.on(Input.EventType.MOUSE_UP, callback, target);
input.on(Input.EventType.TOUCH_START, callback, target);
input.on(Input.EventType.TOUCH_MOVE, callback, target);
input.on(Input.EventType.TOUCH_END, callback, target);
```

## Tween 动画

```typescript
// 基础用法
tween(target)
    .to(duration, props, options?)
    .by(duration, props, options?)
    .call(callback)
    .delay(duration)
    .repeat(times, tween)
    .repeatForever(tween)
    .sequence(tween1, tween2, ...)
    .parallel(tween1, tween2, ...)
    .start();

// 示例
tween(node)
    .to(1, { position: new Vec3(100, 0, 0) })
    .to(0.5, { scale: new Vec3(2, 2, 2) }, { easing: 'backOut' })
    .call(() => console.log('完成'))
    .start();

// 缓动函数
easing: 'linear' | 'quadIn' | 'quadOut' | 'quadInOut' | 
        'cubicIn' | 'cubicOut' | 'cubicInOut' |
        'sineIn' | 'sineOut' | 'sineInOut' |
        'expoIn' | 'expoOut' | 'expoInOut' |
        'circIn' | 'circOut' | 'circInOut' |
        'elasticIn' | 'elasticOut' | 'elasticInOut' |
        'backIn' | 'backOut' | 'backInOut' |
        'bounceIn' | 'bounceOut' | 'bounceInOut'

// 停止动画
Tween.stopAll();
Tween.stopAllByTag(tag);
tweenInstance.stop();
```

## 资源加载

```typescript
// 加载单个资源
resources.load(path, type, callback);
resources.load(path, type, onProgress, callback);

// 加载目录
resources.loadDir(path, type, callback);
resources.loadDir(path, type, onProgress, callback);

// 释放资源
resources.release(path, type);
resources.release(asset);
resources.releaseDir(path);

// 异步加载（推荐）
resources.load(path, Prefab, (err, prefab) => {
    if (err) {
        console.error(err);
        return;
    }
    const node = instantiate(prefab);
    this.node.addChild(node);
});

// Promise 封装
function loadAsync<T extends Asset>(path: string, type: new () => T): Promise<T> {
    return new Promise((resolve, reject) => {
        resources.load(path, type, (err, asset) => {
            if (err) reject(err);
            else resolve(asset);
        });
    });
}
```

## 场景管理

```typescript
// 加载场景
director.loadScene(sceneName);
director.loadScene(sceneName, onLoaded);

// 预加载场景
director.preloadScene(sceneName);
director.preloadScene(sceneName, onLoaded);

// 获取场景
director.getScene();

// 场景事件
director.on(Director.EVENT_BEFORE_SCENE_LOADING, callback);
director.on(Director.EVENT_AFTER_SCENE_LAUNCH, callback);

// 游戏暂停/恢复
game.pause();
game.resume();
```

## UI 组件

```typescript
// Label
label.string = '文本内容';
label.fontSize = 24;
label.lineHeight = 30;
label.color = new Color(255, 0, 0);
label.horizontalAlign = TextHorizontalAlign.CENTER;
label.verticalAlign = TextVerticalAlign.CENTER;
label.overflow = Label.Overflow.CLAMP;  // SHRINK/RESIZE_HEIGHT

// Sprite
sprite.spriteFrame = spriteFrame;
sprite.color = new Color(255, 255, 255);
sprite.type = Sprite.Type.SIMPLE;  // SLICED/TILED/FILLED
sprite.sizeMode = Sprite.SizeMode.CUSTOM;  // TRIMMED/RAW

// Button
button.interactable = true;
button.transition = Button.Transition.NONE;  // COLOR/SPRITE/SCALE
button.target = node;
button.normalColor = new Color(255, 255, 255);
button.pressedColor = new Color(200, 200, 200);
button.hoverColor = new Color(230, 230, 230);
button.disabledColor = new Color(120, 120, 120);
button.clickEvents = [];  // EventHandler[]

// Widget
widget.isAlignTop = true;
widget.isAlignBottom = true;
widget.isAlignLeft = true;
widget.isAlignRight = true;
widget.top = 10;
widget.bottom = 10;
widget.left = 10;
widget.right = 10;

// Layout
layout.type = Layout.Type.NONE;  // HORIZONTAL/VERTICAL/GRID
layout.resizeMode = Layout.ResizeMode.NONE;  // CHILDREN/CONTAINER
layout.horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
layout.verticalDirection = Layout.VerticalDirection.TOP_TO_BOTTOM;
layout.startAxis = Layout.AxisDirection.HORIZONTAL;
layout.cellSize = new Size(100, 100);
layout.spacingX = 10;
layout.spacingY = 10;
layout.paddingLeft = 10;
layout.paddingRight = 10;
layout.paddingTop = 10;
layout.paddingBottom = 10;

// ScrollView
scrollView.content = contentNode;
scrollView.horizontal = true;
scrollView.vertical = true;
scrollView.inertia = true;
scrollView.elastic = true;
scrollView.bounceDuration = 0.5;

// EditBox
editBox.string = '初始文本';
editBox.placeholder = '请输入';
editBox.maxLength = 20;
editBox.inputFlag = EditBox.InputFlag.PASSWORD;  // SENSITIVE/INITIAL_CAPS_WORD/INITIAL_CAPS_SENTENCE/LOWERCASE_ALL/UPPERCASE_ALL
editBox.inputMode = EditBox.InputMode.ANY;  // EMAIL_ADDR/NUMERIC/PHONE_NUMBER/URL/DECIMAL/SINGLE_LINE;
editBox.returnType = EditBox.KeyboardReturnType.DONE;  // GO/SEND/SEARCH/GO/NEXT;
```

## 物理系统

```typescript
// RigidBody
rigidBody.type = ERigidBodyType.DYNAMIC;  // STATIC/KINEMATIC
rigidBody.mass = 1;
rigidBody.linearVelocity = new Vec3(0, 0, 0);
rigidBody.angularVelocity = new Vec3(0, 0, 0);
rigidBody.linearDamping = 0;
rigidBody.angularDamping = 0;
rigidBody.useGravity = true;
rigidBody.applyForce(force, worldPoint?);
rigidBody.applyImpulse(impulse, worldPoint?);
rigidBody.applyTorque(torque);
rigidBody.getLinearVelocity(out);
rigidBody.setLinearVelocity(value);
rigidBody.getAngularVelocity(out);
rigidBody.setAngularVelocity(value);

// Collider
collider.isTrigger = false;
collider.material = physicsMaterial;
collider.on('onCollisionEnter', callback, target);
collider.on('onCollisionStay', callback, target);
collider.on('onCollisionExit', callback, target);
collider.on('onTriggerEnter', callback, target);
collider.on('onTriggerStay', callback, target);
collider.on('onTriggerExit', callback, target);

// PhysicsSystem
PhysicsSystem.instance.gravity = new Vec3(0, -10, 0);
PhysicsSystem.instance.allowSleep = true;
PhysicsSystem.instance.fixedTimeStep = 1/60;
PhysicsSystem.instance.maxSubStep = 1;

// 射线检测
const ray = new Ray(origin, direction);
PhysicsSystem.instance.raycastClosest(ray, mask, distance, result);
PhysicsSystem.instance.raycastAll(ray, mask, distance, results);
```

## 数学工具

```typescript
// Math 工具函数
Math.abs(x);
Math.min(a, b);
Math.max(a, b);
Math.clamp(x, min, max);
Math.lerp(a, b, t);
Math.randomRang(min, max);
Math.approx(a, b, epsilon?);
Math.pow2(x);
Math.log2(x);
Math.round(x);
Math.floor(x);
Math.ceil(x);
Math.sign(x);
Math.toRadian(degree);
Math.toDegree(radian);
Math.random();

// Quat 四元数
const q = new Quat();
Quat.fromEuler(out, x, y, z);
Quat.toEuler(out, q);
Quat.multiply(out, a, b);
Quat.rotateX(out, q, angle);
Quat.rotateY(out, q, angle);
Quat.rotateZ(out, q, angle);
Quat.slerp(out, a, b, t);

// Mat4 矩阵
const m = new Mat4();
Mat4.fromTranslation(out, translation);
Mat4.fromRotation(out, rotation);
Mat4.fromScale(out, scale);
Mat4.fromTRS(out, translation, rotation, scale);
Mat4.multiply(out, a, b);
Mat4.invert(out, m);
Mat4.translate(out, m, translation);
Mat4.rotate(out, m, rotation);
Mat4.scale(out, m, scale);
```

## 系统信息

```typescript
// sys 系统信息
sys.platform;  // WINDOWS/MACOS/ANDROID/iOS/...
sys.os;        // Windows/Mac OS X/Android/iOS/...
sys.browser;   // Chrome/Safari/Firefox/...
sys.language;  // zh-CN/en-US/...
sys.isNative;  // 是否原生平台
sys.isMobile;  // 是否移动端
sys.networkType;  // WIFI/CELLULAR/NONE/...

// view 视图信息
view.getVisibleSize();
view.getVisibleOrigin();
view.getDesignResolutionSize();
view.getCanvasSize();
view.getFrameSize();
view.getDevicePixelRatio();
view.setOrientation(orientation);

// screen 屏幕
screen.windowSize;
screen.devicePixelRatio;
screen.supportRender;
screen.requestOrientation(orientation);
```
