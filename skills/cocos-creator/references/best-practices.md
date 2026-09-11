# Cocos Creator 最佳实践

## 项目架构

### 目录结构

```
project/
├── assets/
│   ├── scenes/              # 场景文件
│   │   ├── Launch.scene     # 启动场景
│   │   ├── Main.scene       # 主场景
│   │   └── UI/              # UI 场景
│   │
│   ├── scripts/             # 脚本文件
│   │   ├── components/      # 通用组件
│   │   ├── ui/              # UI 组件
│   │   ├── managers/        # 管理器
│   │   ├── data/            # 数据模型
│   │   ├── utils/           # 工具类
│   │   └── constants/       # 常量定义
│   │
│   ├── prefabs/             # 预制体
│   │   ├── characters/      # 角色
│   │   ├── enemies/         # 敌人
│   │   ├── items/           # 道具
│   │   └── ui/              # UI 预制体
│   │
│   ├── textures/            # 图片资源
│   │   ├── ui/              # UI 图片
│   │   ├── characters/      # 角色图片
│   │   └── effects/         # 特效图片
│   │
│   ├── atlases/             # 图集
│   │
│   ├── audio/               # 音频
│   │   ├── bgm/             # 背景音乐
│   │   └── sfx/             # 音效
│   │
│   ├── animations/          # 动画剪辑
│   │
│   ├── materials/           # 材质
│   │
│   ├── models/              # 3D 模型
│   │
│   ├── fonts/               # 字体
│   │
│   ├── resources/           # 动态加载资源
│   │
│   └── configs/             # 配置文件（JSON）
│
├── settings/                # 项目设置
└── native/                  # 原生工程
```

### 命名规范

```
文件命名：
- 小写字母 + 连字符：player-controller.ts
- 预制体：Player.prefab（首字母大写）
- 场景：MainMenu.scene（首字母大写）
- 图片：btn_start.png（功能_描述）

类命名：
- 组件类：大驼峰 PlayerController
- 管理器：GameManager AudioManager
- 工具类：MathUtils ArrayUtils

变量命名：
- 私有属性：_playerSpeed（下划线前缀）
- 公共属性：playerSpeed（小驼峰）
- 常量：MAX_SPEED（全大写下划线）
- 枚举：GameState.Playing（大驼峰）
```

## 代码规范

### 组件脚本模板

```typescript
import { _decorator, Component, Node } from 'cc';
const { ccclass, property, menu, executeInEditMode } = _decorator;

/**
 * 组件说明
 */
@ccclass('MyComponent')
@menu('MyGame/MyComponent')  // 在编辑器菜单中的路径
export class MyComponent extends Component {
    // ===== 属性 =====
    
    @property({
        tooltip: '移动速度'
    })
    moveSpeed: number = 100;
    
    @property(Node)
    targetNode: Node | null = null;
    
    // ===== 私有属性 =====
    
    private _isRunning: boolean = false;
    
    // ===== 生命周期 =====
    
    onLoad() {
        this.init();
    }
    
    start() {
        this.bindEvents();
    }
    
    update(deltaTime: number) {
        if (!this._isRunning) return;
        this.updateLogic(deltaTime);
    }
    
    lateUpdate(deltaTime: number) {
        // 后期更新逻辑
    }
    
    onEnable() {
        // 启用时的处理
    }
    
    onDisable() {
        // 禁用时的处理
    }
    
    onDestroy() {
        this.unbindEvents();
        this.cleanup();
    }
    
    // ===== 公共方法 =====
    
    public startRunning() {
        this._isRunning = true;
    }
    
    public stopRunning() {
        this._isRunning = false;
    }
    
    // ===== 私有方法 =====
    
    private init() {
        // 初始化
    }
    
    private bindEvents() {
        // 绑定事件
    }
    
    private unbindEvents() {
        // 解绑事件
    }
    
    private updateLogic(dt: number) {
        // 更新逻辑
    }
    
    private cleanup() {
        // 清理资源
    }
}
```

### 单例模式

```typescript
/**
 * 游戏管理器单例
 */
export class GameManager {
    private static _instance: GameManager;
    
    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }
    
    private constructor() {
        // 私有构造函数
    }
    
    // ... 其他属性和方法
}

// 使用
GameManager.instance.doSomething();
```

### 事件系统封装

```typescript
/**
 * 全局事件管理器
 */
export class EventManager {
    private static _instance: EventManager;
    private _events: Map<string, Set<Function>> = new Map();
    
    public static get instance(): EventManager {
        if (!this._instance) {
            this._instance = new EventManager();
        }
        return this._instance;
    }
    
    /**
     * 监听事件
     */
    public on(event: string, callback: Function, target?: any) {
        if (!this._events.has(event)) {
            this._events.set(event, new Set());
        }
        this._events.get(event)!.add(callback.bind(target || this));
    }
    
    /**
     * 取消监听
     */
    public off(event: string, callback: Function) {
        const callbacks = this._events.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }
    
    /**
     * 触发事件
     */
    public emit(event: string, ...args: any[]) {
        const callbacks = this._events.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(...args));
        }
    }
    
    /**
     * 清除所有事件
     */
    public clear() {
        this._events.clear();
    }
}

// 使用
EventManager.instance.on('player-die', this.onPlayerDie, this);
EventManager.instance.emit('player-die', playerData);
```

## 性能优化

### 1. 减少 DrawCall

```typescript
// 使用图集
// 将多个小图合并到一个大图，减少渲染批次

// 避免频繁切换材质
// 相同材质的物体应该连续渲染

// 使用动态合批
// 项目设置 -> 引擎模块 -> 渲染 -> 动态合批
```

### 2. 对象池

```typescript
/**
 * 通用对象池
 */
export class ObjectPool<T> {
    private _pool: T[] = [];
    private _createFn: () => T;
    private _resetFn: (obj: T) => void;
    
    constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 0) {
        this._createFn = createFn;
        this._resetFn = resetFn;
        
        for (let i = 0; i < initialSize; i++) {
            this._pool.push(this._createFn());
        }
    }
    
    /**
     * 获取对象
     */
    public get(): T {
        if (this._pool.length > 0) {
            return this._pool.pop()!;
        }
        return this._createFn();
    }
    
    /**
     * 释放对象
     */
    public release(obj: T) {
        this._resetFn(obj);
        this._pool.push(obj);
    }
    
    /**
     * 清空池
     */
    public clear() {
        this._pool.length = 0;
    }
    
    /**
     * 获取池大小
     */
    public get size(): number {
        return this._pool.length;
    }
}

// 使用示例
const bulletPool = new ObjectPool(
    () => instantiate(bulletPrefab),
    (bullet) => {
        bullet.active = false;
        bullet.removeFromParent();
    },
    50  // 初始大小
);

const bullet = bulletPool.get();
// 使用 bullet...
bulletPool.release(bullet);
```

### 3. 延迟加载

```typescript
/**
 * 分帧加载管理器
 */
export class LazyLoader {
    private static _instance: LazyLoader;
    private _queue: Array<() => Promise<void>> = [];
    private _isProcessing: boolean = false;
    
    public static get instance(): LazyLoader {
        if (!this._instance) {
            this._instance = new LazyLoader();
        }
        return this._instance;
    }
    
    /**
     * 添加加载任务
     */
    public add(task: () => Promise<void>) {
        this._queue.push(task);
        if (!this._isProcessing) {
            this.process();
        }
    }
    
    /**
     * 处理队列
     */
    private async process() {
        this._isProcessing = true;
        
        while (this._queue.length > 0) {
            const task = this._queue.shift()!;
            await task();
            // 每帧只处理一个任务
            await this.waitFrame();
        }
        
        this._isProcessing = false;
    }
    
    private waitFrame(): Promise<void> {
        return new Promise(resolve => {
            requestAnimationFrame(() => resolve());
        });
    }
}

// 使用
LazyLoader.instance.add(async () => {
    const prefab = await loadPrefab('prefabs/enemy');
    // 处理加载的资源
});
```

### 4. 资源管理

```typescript
/**
 * 资源管理器
 */
export class ResourceManager {
    private static _instance: ResourceManager;
    private _loadedAssets: Map<string, Asset> = new Map();
    private _refCounts: Map<string, number> = new Map();
    
    public static get instance(): ResourceManager {
        if (!this._instance) {
            this._instance = new ResourceManager();
        }
        return this._instance;
    }
    
    /**
     * 加载资源
     */
    public async load<T extends Asset>(path: string, type: new () => T): Promise<T> {
        const cached = this._loadedAssets.get(path);
        if (cached) {
            this.addRef(path);
            return cached as T;
        }
        
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, asset) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._loadedAssets.set(path, asset);
                this._refCounts.set(path, 1);
                resolve(asset);
            });
        });
    }
    
    /**
     * 释放资源
     */
    public release(path: string) {
        const count = this._refCounts.get(path) || 0;
        if (count <= 1) {
            const asset = this._loadedAssets.get(path);
            if (asset) {
                resources.release(asset);
                this._loadedAssets.delete(path);
                this._refCounts.delete(path);
            }
        } else {
            this._refCounts.set(path, count - 1);
        }
    }
    
    private addRef(path: string) {
        const count = this._refCounts.get(path) || 0;
        this._refCounts.set(path, count + 1);
    }
}
```

## UI 最佳实践

### 1. 多分辨率适配

```typescript
/**
 * UI 适配管理器
 */
@ccclass('UIAdapter')
export class UIAdapter extends Component {
    @property(Canvas)
    canvas: Canvas | null = null;
    
    onLoad() {
        this.adaptToScreen();
        view.on('canvas-resize', this.adaptToScreen, this);
    }
    
    private adaptToScreen() {
        const visibleSize = view.getVisibleSize();
        const designSize = view.getDesignResolutionSize();
        
        // 根据宽高比调整 UI
        const ratio = visibleSize.width / visibleSize.height;
        const designRatio = designSize.width / designSize.height;
        
        if (ratio > designRatio) {
            // 宽屏：左右有黑边
            this.adjustForWideScreen(ratio / designRatio);
        } else {
            // 窄屏：上下有黑边
            this.adjustForNarrowScreen(designRatio / ratio);
        }
    }
    
    private adjustForWideScreen(scale: number) {
        // 宽屏适配逻辑
    }
    
    private adjustForNarrowScreen(scale: number) {
        // 窄屏适配逻辑
    }
    
    onDestroy() {
        view.off('canvas-resize', this.adaptToScreen, this);
    }
}
```

### 2. 虚拟列表

```typescript
/**
 * 虚拟列表组件（优化大量数据渲染）
 */
@ccclass('VirtualList')
export class VirtualList extends Component {
    @property(Node)
    content: Node | null = null;
    
    @property(Prefab)
    itemTemplate: Prefab | null = null;
    
    @property
    itemHeight: number = 100;
    
    @property
    bufferCount: number = 2;  // 缓冲项数量
    
    private _data: any[] = [];
    private _items: Node[] = [];
    private _scrollView: ScrollView | null = null;
    private _visibleCount: number = 0;
    
    onLoad() {
        this._scrollView = this.getComponent(ScrollView);
        this.calculateVisibleCount();
        this.createItems();
    }
    
    /**
     * 设置数据
     */
    public setData(data: any[]) {
        this._data = data;
        if (this.content) {
            this.content.getComponent(UITransform)!.height = data.length * this.itemHeight;
        }
        this.updateVisibleItems();
    }
    
    /**
     * 更新可见项
     */
    private updateVisibleItems() {
        if (!this._scrollView || !this.content) return;
        
        const scrollOffset = this._scrollView.getScrollOffset();
        const startIndex = Math.max(0, Math.floor(scrollOffset.y / this.itemHeight) - this.bufferCount);
        const endIndex = Math.min(
            this._data.length - 1,
            startIndex + this._visibleCount + this.bufferCount * 2
        );
        
        for (let i = 0; i < this._items.length; i++) {
            const dataIndex = startIndex + i;
            const item = this._items[i];
            
            if (dataIndex >= 0 && dataIndex <= endIndex) {
                item.active = true;
                item.setPosition(0, -dataIndex * this.itemHeight, 0);
                this.updateItem(item, this._data[dataIndex], dataIndex);
            } else {
                item.active = false;
            }
        }
    }
    
    private calculateVisibleCount() {
        const height = this.node.getComponent(UITransform)!.height;
        this._visibleCount = Math.ceil(height / this.itemHeight);
    }
    
    private createItems() {
        const count = this._visibleCount + this.bufferCount * 2;
        for (let i = 0; i < count; i++) {
            const item = instantiate(this.itemTemplate!);
            this.content!.addChild(item);
            this._items.push(item);
        }
    }
    
    private updateItem(item: Node, data: any, index: number) {
        // 更新项显示
    }
}
```

## 数据持久化

### 1. 本地存储封装

```typescript
/**
 * 本地存储管理器
 */
export class StorageManager {
    private static _instance: StorageManager;
    
    public static get instance(): StorageManager {
        if (!this._instance) {
            this._instance = new StorageManager();
        }
        return this._instance;
    }
    
    /**
     * 保存数据
     */
    public set<T>(key: string, value: T): void {
        try {
            const json = JSON.stringify(value);
            sys.localStorage.setItem(key, json);
        } catch (e) {
            console.error('Storage set error:', e);
        }
    }
    
    /**
     * 读取数据
     */
    public get<T>(key: string, defaultValue?: T): T | undefined {
        try {
            const json = sys.localStorage.getItem(key);
            if (json === null || json === '') {
                return defaultValue;
            }
            return JSON.parse(json) as T;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }
    
    /**
     * 删除数据
     */
    public remove(key: string): void {
        sys.localStorage.removeItem(key);
    }
    
    /**
     * 清空所有数据
     */
    public clear(): void {
        sys.localStorage.clear();
    }
    
    /**
     * 检查是否存在
     */
    public has(key: string): boolean {
        return sys.localStorage.getItem(key) !== null;
    }
}

// 使用
StorageManager.instance.set('player-data', { level: 1, score: 0 });
const data = StorageManager.instance.get<PlayerData>('player-data');
```

### 2. 配置管理

```typescript
/**
 * 配置管理器
 */
export class ConfigManager {
    private static _instance: ConfigManager;
    private _configs: Map<string, any> = new Map();
    
    public static get instance(): ConfigManager {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }
    
    /**
     * 加载配置
     */
    public async load(path: string): Promise<any> {
        if (this._configs.has(path)) {
            return this._configs.get(path);
        }
        
        return new Promise((resolve, reject) => {
            resources.load(path, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    reject(err);
                    return;
                }
                const config = jsonAsset.json;
                this._configs.set(path, config);
                resolve(config);
            });
        });
    }
    
    /**
     * 获取配置项
     */
    public get<T>(path: string, key: string): T | undefined {
        const config = this._configs.get(path);
        if (!config) return undefined;
        return config[key] as T;
    }
}
```

## 网络通信

### 1. HTTP 请求封装

```typescript
/**
 * HTTP 请求管理器
 */
export class HttpManager {
    private static _instance: HttpManager;
    private _baseUrl: string = '';
    
    public static get instance(): HttpManager {
        if (!this._instance) {
            this._instance = new HttpManager();
        }
        return this._instance;
    }
    
    public setBaseUrl(url: string) {
        this._baseUrl = url;
    }
    
    /**
     * GET 请求
     */
    public async get<T>(path: string, params?: Record<string, any>): Promise<T> {
        const url = this.buildUrl(path, params);
        return this.request<T>(url, 'GET');
    }
    
    /**
     * POST 请求
     */
    public async post<T>(path: string, data?: any): Promise<T> {
        const url = this._baseUrl + path;
        return this.request<T>(url, 'POST', data);
    }
    
    private buildUrl(path: string, params?: Record<string, any>): string {
        let url = this._baseUrl + path;
        if (params) {
            const query = Object.entries(params)
                .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                .join('&');
            url += `?${query}`;
        }
        return url;
    }
    
    private async request<T>(url: string, method: string, data?: any): Promise<T> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () => reject(new Error('Request timeout'));
            
            xhr.send(data ? JSON.stringify(data) : null);
        });
    }
}
```

### 2. WebSocket 封装

```typescript
/**
 * WebSocket 管理器
 */
export class WebSocketManager {
    private static _instance: WebSocketManager;
    private _ws: WebSocket | null = null;
    private _isConnected: boolean = false;
    private _messageHandlers: Map<string, Function[]> = new Map();
    
    public static get instance(): WebSocketManager {
        if (!this._instance) {
            this._instance = new WebSocketManager();
        }
        return this._instance;
    }
    
    /**
     * 连接
     */
    public connect(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._ws = new WebSocket(url);
            
            this._ws.onopen = () => {
                this._isConnected = true;
                resolve();
            };
            
            this._ws.onerror = (error) => {
                reject(error);
            };
            
            this._ws.onmessage = (event) => {
                this.onMessage(event.data);
            };
            
            this._ws.onclose = () => {
                this._isConnected = false;
                this.onClose();
            };
        });
    }
    
    /**
     * 发送消息
     */
    public send(type: string, data: any) {
        if (!this._isConnected || !this._ws) return;
        
        const message = JSON.stringify({ type, data });
        this._ws.send(message);
    }
    
    /**
     * 监听消息
     */
    public on(type: string, handler: Function) {
        if (!this._messageHandlers.has(type)) {
            this._messageHandlers.set(type, []);
        }
        this._messageHandlers.get(type)!.push(handler);
    }
    
    /**
     * 取消监听
     */
    public off(type: string, handler: Function) {
        const handlers = this._messageHandlers.get(type);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        }
    }
    
    /**
     * 关闭连接
     */
    public close() {
        if (this._ws) {
            this._ws.close();
            this._ws = null;
        }
    }
    
    private onMessage(data: string) {
        try {
            const message = JSON.parse(data);
            const handlers = this._messageHandlers.get(message.type);
            if (handlers) {
                handlers.forEach(handler => handler(message.data));
            }
        } catch (e) {
            console.error('Parse message error:', e);
        }
    }
    
    private onClose() {
        // 重连逻辑
    }
}
```
