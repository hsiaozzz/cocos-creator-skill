# Cocos Creator 代码示例集

## 基础组件示例

### 1. 玩家控制器

```typescript
import { _decorator, Component, Node, Vec3, input, Input, EventKeyboard, KeyCode, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    moveSpeed: number = 5;
    
    @property
    jumpForce: number = 10;
    
    private _velocity: Vec3 = new Vec3();
    private _rigidBody: RigidBody | null = null;
    private _isGrounded: boolean = false;
    
    start() {
        this._rigidBody = this.getComponent(RigidBody);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    
    update(deltaTime: number) {
        // 移动逻辑
        this.node.position = this.node.position.add(
            this._velocity.clone().multiplyScalar(deltaTime)
        );
    }
    
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this._velocity.z = -this.moveSpeed;
                break;
            case KeyCode.KEY_S:
                this._velocity.z = this.moveSpeed;
                break;
            case KeyCode.KEY_A:
                this._velocity.x = -this.moveSpeed;
                break;
            case KeyCode.KEY_D:
                this._velocity.x = this.moveSpeed;
                break;
            case KeyCode.SPACE:
                if (this._isGrounded) {
                    this.jump();
                }
                break;
        }
    }
    
    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this._velocity.z = 0;
                break;
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this._velocity.x = 0;
                break;
        }
    }
    
    jump() {
        if (this._rigidBody) {
            this._rigidBody.applyForce(new Vec3(0, this.jumpForce, 0));
            this._isGrounded = false;
        }
    }
    
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
```

### 2. 相机跟随

```typescript
import { _decorator, Component, Node, Vec3, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    target: Node | null = null;
    
    @property
    smoothSpeed: number = 5;
    
    @property
    offset: Vec3 = new Vec3(0, 5, -10);
    
    private _currentVelocity: Vec3 = new Vec3();
    
    lateUpdate(deltaTime: number) {
        if (!this.target) return;
        
        const targetPosition = this.target.position.clone().add(this.offset);
        const currentPosition = this.node.position.clone();
        
        // 平滑插值
        Vec3.lerp(currentPosition, currentPosition, targetPosition, this.smoothSpeed * deltaTime);
        this.node.setPosition(currentPosition);
    }
}
```

### 3. 对象池

```typescript
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
export class ObjectPool extends Component {
    @property(Prefab)
    prefab: Prefab | null = null;
    
    @property
    initialSize: number = 10;
    
    private _pool: Node[] = [];
    
    start() {
        // 预创建对象
        for (let i = 0; i < this.initialSize; i++) {
            this.createNode();
        }
    }
    
    private createNode(): Node {
        if (!this.prefab) return null!;
        const node = instantiate(this.prefab);
        node.active = false;
        node.setParent(this.node);
        this._pool.push(node);
        return node;
    }
    
    public get(): Node {
        let node = this._pool.find(n => !n.active);
        if (!node) {
            node = this.createNode();
        }
        node.active = true;
        return node;
    }
    
    public release(node: Node) {
        node.active = false;
        node.removeFromParent();
        node.setParent(this.node);
    }
}
```

### 4. UI 弹窗管理器

```typescript
import { _decorator, Component, Node, Prefab, instantiate, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property(Prefab)
    dialogPrefab: Prefab | null = null;
    
    @property(Node)
    uiRoot: Node | null = null;
    
    private static _instance: UIManager;
    
    public static get instance(): UIManager {
        return this._instance;
    }
    
    onLoad() {
        UIManager._instance = this;
    }
    
    public showDialog(content: string, onConfirm?: () => void) {
        if (!this.dialogPrefab || !this.uiRoot) return;
        
        const dialog = instantiate(this.dialogPrefab);
        this.uiRoot.addChild(dialog);
        
        // 设置内容
        const label = dialog.getChildByName('Content')?.getComponent(Label);
        if (label) label.string = content;
        
        // 弹出动画
        dialog.scale = new Vec3(0, 0, 0);
        tween(dialog)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
        
        // 绑定按钮事件
        const confirmBtn = dialog.getChildByName('ConfirmBtn');
        confirmBtn?.on(Node.EventType.TOUCH_END, () => {
            onConfirm?.();
            this.closeDialog(dialog);
        });
        
        const cancelBtn = dialog.getChildByName('CancelBtn');
        cancelBtn?.on(Node.EventType.TOUCH_END, () => {
            this.closeDialog(dialog);
        });
    }
    
    private closeDialog(dialog: Node) {
        tween(dialog)
            .to(0.2, { scale: new Vec3(0, 0, 0) })
            .call(() => dialog.destroy())
            .start();
    }
}
```

### 5. 简单状态机

```typescript
import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

interface State {
    onEnter(): void;
    onUpdate(dt: number): void;
    onExit(): void;
}

@ccclass('StateMachine')
export class StateMachine extends Component {
    private _currentState: State | null = null;
    private _states: Map<string, State> = new Map();
    
    public addState(name: string, state: State) {
        this._states.set(name, state);
    }
    
    public changeState(name: string) {
        const newState = this._states.get(name);
        if (!newState) return;
        
        if (this._currentState) {
            this._currentState.onExit();
        }
        
        this._currentState = newState;
        this._currentState.onEnter();
    }
    
    update(deltaTime: number) {
        this._currentState?.onUpdate(deltaTime);
    }
}

// 使用示例
class IdleState implements State {
    constructor(private player: PlayerController) {}
    
    onEnter() {
        console.log('进入空闲状态');
    }
    
    onUpdate(dt: number) {
        // 检测是否开始移动
    }
    
    onExit() {
        console.log('退出空闲状态');
    }
}
```

### 6. 资源管理器

```typescript
import { _decorator, Component, resources, Asset, Prefab, SpriteFrame, JsonAsset } from 'cc';
const { ccclass } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static _instance: ResourceManager;
    private _cache: Map<string, Asset> = new Map();
    
    public static get instance(): ResourceManager {
        return this._instance;
    }
    
    onLoad() {
        ResourceManager._instance = this;
    }
    
    public async loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            const cached = this._cache.get(path);
            if (cached) {
                resolve(cached as Prefab);
                return;
            }
            
            resources.load(path, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._cache.set(path, prefab);
                resolve(prefab);
            });
        });
    }
    
    public async loadSpriteFrame(path: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            const cached = this._cache.get(path);
            if (cached) {
                resolve(cached as SpriteFrame);
                return;
            }
            
            resources.load(path, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._cache.set(path, spriteFrame);
                resolve(spriteFrame);
            });
        });
    }
    
    public async loadJson(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const cached = this._cache.get(path);
            if (cached) {
                resolve((cached as JsonAsset).json);
                return;
            }
            
            resources.load(path, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    reject(err);
                    return;
                }
                this._cache.set(path, jsonAsset);
                resolve(jsonAsset.json);
            });
        });
    }
    
    public release(path: string) {
        const asset = this._cache.get(path);
        if (asset) {
            resources.release(asset);
            this._cache.delete(path);
        }
    }
    
    public releaseAll() {
        this._cache.forEach((asset, path) => {
            resources.release(asset);
        });
        this._cache.clear();
    }
}
```

### 7. 简单计时器

```typescript
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

interface TimerCallback {
    callback: () => void;
    delay: number;
    repeat: number;
    elapsed: number;
    count: number;
}

@ccclass('TimerManager')
export class TimerManager extends Component {
    private static _instance: TimerManager;
    private _timers: Map<number, TimerCallback> = new Map();
    private _nextId: number = 1;
    
    public static get instance(): TimerManager {
        return this._instance;
    }
    
    onLoad() {
        TimerManager._instance = this;
    }
    
    /**
     * 设置定时器
     * @param callback 回调函数
     * @param delay 延迟时间（秒）
     * @param repeat 重复次数，-1 表示无限重复
     */
    public setTimeout(callback: () => void, delay: number, repeat: number = 0): number {
        const id = this._nextId++;
        this._timers.set(id, {
            callback,
            delay,
            repeat,
            elapsed: 0,
            count: 0
        });
        return id;
    }
    
    public clearInterval(id: number) {
        this._timers.delete(id);
    }
    
    update(deltaTime: number) {
        const toRemove: number[] = [];
        
        this._timers.forEach((timer, id) => {
            timer.elapsed += deltaTime;
            
            if (timer.elapsed >= timer.delay) {
                timer.callback();
                timer.elapsed = 0;
                timer.count++;
                
                if (timer.repeat >= 0 && timer.count > timer.repeat) {
                    toRemove.push(id);
                }
            }
        });
        
        toRemove.forEach(id => this._timers.delete(id));
    }
}
```

### 8. 简单音频管理器

```typescript
import { _decorator, Component, AudioSource, AudioClip, resources, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property
    musicVolume: number = 1.0;
    
    @property
    sfxVolume: number = 1.0;
    
    private static _instance: AudioManager;
    private _musicSource: AudioSource | null = null;
    private _sfxSources: AudioSource[] = [];
    private _audioCache: Map<string, AudioClip> = new Map();
    
    public static get instance(): AudioManager {
        return this._instance;
    }
    
    onLoad() {
        AudioManager._instance = this;
        this._musicSource = this.addComponent(AudioSource);
    }
    
    public async playMusic(path: string, loop: boolean = true) {
        const clip = await this.loadClip(path);
        if (clip && this._musicSource) {
            this._musicSource.clip = clip;
            this._musicSource.volume = this.musicVolume;
            this._musicSource.loop = loop;
            this._musicSource.play();
        }
    }
    
    public stopMusic() {
        this._musicSource?.stop();
    }
    
    public async playSFX(path: string) {
        const clip = await this.loadClip(path);
        if (!clip) return;
        
        // 找一个空闲的 AudioSource 或创建新的
        let source = this._sfxSources.find(s => !s.playing);
        if (!source) {
            source = this.addComponent(AudioSource);
            this._sfxSources.push(source);
        }
        
        source.clip = clip;
        source.volume = this.sfxVolume;
        source.loop = false;
        source.playOneShot(clip);
    }
    
    public setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this._musicSource) {
            this._musicSource.volume = this.musicVolume;
        }
    }
    
    public setSFXVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    private async loadClip(path: string): Promise<AudioClip | null> {
        return new Promise((resolve) => {
            const cached = this._audioCache.get(path);
            if (cached) {
                resolve(cached);
                return;
            }
            
            resources.load(path, AudioClip, (err, clip) => {
                if (err) {
                    resolve(null);
                    return;
                }
                this._audioCache.set(path, clip);
                resolve(clip);
            });
        });
    }
}
```
