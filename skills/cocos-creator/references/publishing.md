# 构建与多平台发布指南

目标平台差异很大，**先确认目标平台再套用清单**。同一份工程发到微信小游戏和发到 Android 原生，配置项几乎完全不同。

## 一、构建前的统一准备

无论发到哪个平台，先做这三件事：

1. **构建面板基础设置**：`项目 → 构建发布`
   - 起始场景（Start Scene）必须正确，且只勾选必要的首屏场景
   - 设计分辨率与适配策略（见下）
   - 目标平台对应的压缩纹理格式

2. **屏幕适配**：在 `Canvas` 节点上设置
   - `Design Resolution`：常见 960×640 / 1280×720 / 750×1334
   - `Fit Height`：竖屏游戏（如 750×1334）
   - `Fit Width`：横屏游戏（如 1280×720）
   - `Widget` 组件处理边缘对齐（顶 / 底 / 左 / 右）

3. **清理未使用资源**：构建面板勾选资源剔除。勾选前**必须确认没有动态加载路径**（`resources.load` 的字符串路径引擎无法静态分析），否则会误删。

## 二、微信小游戏

### 发布清单

- [ ] `项目设置 → 构建发布 → 微信小游戏`，填入正确的 **AppID**
- [ ] 开启 **分包**，主包控制在 4MB 以内
- [ ] 首屏资源放主包，关卡资源放分包
- [ ] 关闭开发调试选项（`debug`、`sourceMaps`）
- [ ] 构建后用**微信开发者工具**打开 `build/wechatgame` 目录，真机预览
- [ ] 上传代码 → 提交审核（需先在小程序后台配置类目与服务器域名）

### 常见构建报错

| 报错 | 原因 | 解法 |
|---|---|---|
| `主包体积超过 4MB` | 首屏资源过多 | 开分包，把大图/音频移出主包 |
| `wx is not defined` | 在非小游戏环境跑了小游戏专用 API | 用 `sys.platform === sys.Platform.WECHAT_GAME` 做条件判断 |
| `子包加载失败` | 分包名与 `loadBundle` 参数不一致 | 核对 `项目设置` 里的分包名 |
| `request 域名不合法` | 未在后台配置服务器域名 | 小程序后台 → 开发 → 服务器域名 |
| 音频不播放 | 缺少用户手势触发 | 首次点击后再播放 BGM |

```typescript
import { sys } from 'cc';

if (sys.platform === sys.Platform.WECHAT_GAME) {
    // @ts-ignore 微信小游戏全局对象
    wx.onShow(() => { /* 回到前台，恢复音频 */ });
}
```

## 三、抖音小游戏

与微信高度相似，差异点：

- 构建时选择 `抖音小游戏` 平台，产物目录 `build/bytedance-mini-game`
- 用**抖音开发者工具**打开与预览
- 平台 API 对象是 `tt` 而非 `wx`
- 分包与体积限制参考微信策略，但审核规则不同

```typescript
if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
    // @ts-ignore
    tt.onShow(() => { /* ... */ });
}
```

**建议**：把平台相关逻辑抽成一个 `Platform.ts` 适配层，通过 `sys.platform` 分发，避免业务代码里散落 `wx` / `tt` 判断。

## 四、其他小游戏平台

| 平台 | 构建目标 | 备注 |
|---|---|---|
| 支付宝小游戏 | `支付宝小游戏` | 全局对象 `my` |
| 小米 / OPPO / vivo 快游戏 | 对应平台目标 | 各平台有独立审核与包体限制 |
| 华为快游戏 | `华为快游戏` | 与 HarmonyOS 生态打通 |
| Facebook Instant Games | `Facebook Instant Games` | 需 HTTPS 与 `FBInstant` 初始化 |

## 五、Web / H5

- 构建目标：`Web Mobile`（移动端 H5）/ `Web Desktop`（桌面浏览器）
- **部署必须有 HTTPS**（微信内打开尤其要求）
- 服务器需正确配置 `.wasm` / `.bin` 等二进制资源的 MIME 类型，否则加载失败
- 开启 gzip / brotli 压缩静态资源，首屏体积可降 60%+
- 若用 CDN，注意 `设置 → 构建 → 资源服务器地址` 配成 CDN 域名

本地验证 H5 产物：

```bash
# 在 build/web-mobile 目录起一个静态服务器
npx serve build/web-mobile
# 或
python -m http.server 8080 --directory build/web-mobile
```

## 六、iOS / Android 原生

### 通用流程

1. 构建目标选 `iOS` 或 `Android`，产物是原生工程（Xcode 工程 / Android Studio 工程）
2. 用对应 IDE 打开 `build/ios` 或 `build/android`
3. 配置签名后编译到真机

### Android

- 需要 Android Studio + 对应 SDK / NDK
- 压缩纹理选 **ETC2**（覆盖面最广）
- 包体优化：开启 ABI 分包（`armeabi-v7a` / `arm64-v8a`）或 AAB 格式
- 16KB Page Size 支持在 3.8.8+ 已处理，老版本需确认

### iOS

- 需要 Xcode + 开发者账号
- 压缩纹理选 **ASTC**（A 系列芯片）；老设备可退化到 PVRTC
- 注意 `Info.plist` 的权限描述（麦克风 / 相册 / 网络）
- 上架前用 **TestFlight** 验证

### 原生平台排查要点

- 原生模拟器日志：编辑器 `预览 → 模拟器`，或直接看 Xcode / Android Studio 的 Logcat
- 白屏多数是资源加载失败，先看控制台第一条 error
- 崩溃看符号化的堆栈，`jsb` 层错误会带 JS 堆栈

## 七、HarmonyOS Next（3.8.5+）

- 构建目标：`HarmonyOS Next`（需 Creator 3.8.5 或更高）
- 用 **DevEco Studio** 打开产物工程
- 需配置 HarmonyOS 应用签名与证书
- 3.8.8 起补充了游戏手柄支持、`device type` 属性、横竖屏切换等问题修复
- 已知坑：音频播放、wasm 初始化、全屏切换后触摸坐标偏移 —— 优先升级到 3.8.8+ 规避

## 八、COCOS 4 的构建方式变化

COCOS 4 把编辑器能力逐步迁到 **Headless CLI**（`cocos-cli`），构建可以用命令行完成，天然适合 CI：

> 具体命令与参数以 `cocos-cli` 官方文档为准：https://github.com/cocos/cocos-cli

这带来的实际收益：构建可以进 CI 流水线，不需要人工打开编辑器点按钮。

## 九、CI 自动化构建思路

```yaml
# 思路示意（真实命令以官方 CLI 文档为准）
- name: Build WeChat Mini Game
  run: |
    cocos-cli build --platform wechatgame --project ./my-game
```

老版本 Creator（3.8.x）主要依赖编辑器 GUI 构建。若必须自动化，可考虑：
- 编辑器内置的命令行模式（`CocosCreator.exe --project <path> --build "platform=web-mobile"`，平台相关，需按官方文档确认参数）
- 或者在 CI 中只做 `tsc --noEmit` + 资源体检，构建由人工在本地完成

## 十、上线前最终检查

- [ ] 起始场景正确，无测试用场景被打进去
- [ ] 所有 `console.log` 调试输出已清理或降级
- [ ] 首屏加载时间实测可接受（弱网模拟）
- [ ] 目标平台包体在限制以内
- [ ] 真机验证：至少一台低端机 + 一台主流机型
- [ ] 平台后台配置完成（域名、类目、签名、支付）
- [ ] 有回滚方案（保留上一个可发布版本）
