# 🎮 Cocos Creator 3.8 OpenClaw Skill

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cocos Creator](https://img.shields.io/badge/Cocos%20Creator-3.8-blue.svg)](https://www.cocos.com/)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Skill-orange.svg)](https://www.openclaw.ai/)

*A powerful AI assistant skill for Cocos Creator 3.8 game development*

[English](#english) · [中文](#中文) · [日本語](#日本語) · [한국어](#한국어)

</div>

---

## 📖 English

### Overview

This is an OpenClaw skill designed specifically for **Cocos Creator 3.8** game development. It provides comprehensive guidance covering everything from beginner to advanced topics, including scripting, animation, physics, UI systems, and cross-platform publishing.

### Features

- **Script Development** - TypeScript component system, lifecycle management, property decorators
- **Node Operations** - Transform, hierarchy, component management
- **Event System** - Event listening, emission, input handling
- **Animation System** - Animation components, Tween animations
- **Physics System** - Rigid bodies, collisions, raycasting
- **UI System** - Labels, sprites, buttons, layouts
- **Resource Management** - Loading, releasing, caching
- **Scene Management** - Loading, switching, preloading

### Installation

#### Method 1: Install via SkillHub (Recommended)

```bash
skillhub install cocos-creator
```

#### Method 2: Manual Installation

1. Clone this repository:
```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
```

2. Copy the `cocos-creator` folder to your OpenClaw skills directory:
```bash
# Windows
copy cocos-creator-skill\cocos-creator %USERPROFILE%\.qclaw\skills\

# macOS/Linux
cp -r cocos-creator-skill/cocos-creator ~/.qclaw/skills/
```

3. Restart OpenClaw

### Usage

Once installed, you can ask OpenClaw any questions about Cocos Creator:

```
How do I create a player controller in Cocos Creator?
How to implement jumping mechanics with physics?
How to load resources dynamically?
How to publish my game to iOS/Android/Web?
```

### Documentation Structure

```
cocos-creator/
├── SKILL.md              # Main skill file
├── README.md             # This file
├── examples.md           # Code examples
├── api-quick-ref.md      # API quick reference
├── best-practices.md     # Best practices & patterns
└── troubleshooting.md     # Common issues & solutions
```

### Quick Examples

#### Create a Simple Player Controller

```typescript
import { _decorator, Component, Node, Input, EventKeyboard, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    moveSpeed: number = 100;

    private _direction: Vec3 = new Vec3();

    onLoad() {
        // Register keyboard events
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
        // Move player
        this.node.setPosition(this.node.position.add(this._direction.multiplyScalar(this.moveSpeed * dt)));
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode) {
            case Input.KeyCode.ARROW_LEFT:
            case Input.KeyCode.KEY_A:
                this._direction.x = -1;
                break;
            case Input.KeyCode.ARROW_RIGHT:
            case Input.KeyCode.KEY_D:
                this._direction.x = 1;
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        this._direction.x = 0;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
```

### Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🀄 中文

### 概述

这是一个专为 **Cocos Creator 3.8** 游戏开发设计的 OpenClaw 技能。它提供从入门到高级的全面指导，涵盖脚本开发、动画系统、物理引擎、UI 系统和跨平台发布等各个方面。

### 功能特点

- **脚本开发** - TypeScript 组件系统、生命周期管理、属性装饰器
- **节点操作** - 变换、层级、组件管理
- **事件系统** - 事件监听、发射、输入处理
- **动画系统** - Animation 组件、Tween 补间动画
- **物理系统** - 刚体、碰撞、射线检测
- **UI 系统** - 文本、精灵、按钮、布局
- **资源管理** - 加载、释放、缓存策略
- **场景管理** - 加载、切换、预加载

### 安装方法

#### 方法一：通过 SkillHub 安装（推荐）

```bash
skillhub install cocos-creator
```

#### 方法二：手动安装

1. 克隆本仓库：
```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
```

2. 复制到 OpenClaw skills 目录：
```bash
# Windows
copy cocos-creator-skill\cocos-creator %USERPROFILE%\.qclaw\skills\

# macOS/Linux
cp -r cocos-creator-skill/cocos-creator ~/.qclaw/skills/
```

3. 重启 OpenClaw

### 使用示例

安装后，你可以直接问 OpenClaw 关于 Cocos Creator 的任何问题：

```
如何在 Cocos Creator 中创建玩家控制器？
如何实现带物理效果的跳跃？
如何动态加载资源？
如何发布游戏到 iOS/Android/Web 平台？
```

### 文档结构

```
cocos-creator/
├── SKILL.md              # 主技能文件
├── README.md             # 本文档
├── examples.md           # 代码示例
├── api-quick-ref.md      # API 快速参考
├── best-practices.md     # 最佳实践与模式
└── troubleshooting.md     # 常见问题与解决方案
```

### 代码示例

#### 创建玩家控制器

```typescript
import { _decorator, Component, Node, Input, EventKeyboard, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    moveSpeed: number = 100;  // 移动速度

    private _direction: Vec3 = new Vec3();  // 移动方向

    onLoad() {
        // 注册键盘事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
        // 移动玩家
        const offset = this._direction.clone().multiplyScalar(this.moveSpeed * dt);
        this.node.setPosition(this.node.position.add(offset));
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode) {
            case Input.KeyCode.ARROW_LEFT:
            case Input.KeyCode.KEY_A:
                this._direction.x = -1;  // 向左
                break;
            case Input.KeyCode.ARROW_RIGHT:
            case Input.KeyCode.KEY_D:
                this._direction.x = 1;   // 向右
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        this._direction.x = 0;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
```

### 官方资源

- [官方文档](https://docs.cocos.com/creator/3.8/manual/zh/)
- [API 参考](https://docs.cocos.com/creator/3.8/api/zh/)
- [社区论坛](https://forum.cocos.org/)
- [Cocos Store](https://store.cocos.com/)

### 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开源协议

MIT License - 详见 [LICENSE](LICENSE)

---

## 🇯🇵 日本語

### 概要

これは **Cocos Creator 3.8** ゲーム開発用に設計された OpenClaw スキルです。スクリプト開発、アニメーション、物理エンジン、UI システム、クロスプラットフォームパブリッシングなど、入門から上級まで幅広いトピックをカバーしています。

### 機能

- **スクリプト開発** - TypeScript コンポーネントシステム、ライフサイクル管理、プロパティデコレータ
- **ノード操作** - トランスフォーム、階層構造、コンポーネント管理
- **イベントシステム** - イベントリスニング、エミット、入力処理
- **アニメーションシステム** - Animation コンポーネント、Tween アニメーション
- **物理システム** - リジッドボディ、衝突、レイキャスティング
- **UI システム** - ラベル、スプライトボタン、レイアウト
- **リソース管理** - ロード、リリース、キャッシング
- **シーン管理** - ロード、切り替え、プリロード

### インストール

#### 方法1: SkillHub でインストール（推奨）

```bash
skillhub install cocos-creator
```

#### 方法2: 手動インストール

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cp -r cocos-creator-skill/cocos-creator ~/.qclaw/skills/
```

### 使用例

```
Cocos Creator でプレイヤ-controllerを作成方法は？
物理を使ったジャンプの実装方法は？
リソースを動的にロードする方法は？
ゲームをiOS/Android/Webにパブリッシュする方法は？
```

### ドキュメント構造

```
cocos-creator/
├── SKILL.md              # メインスキルファイル
├── README.md             # このファイル
├── examples.md           # コード例
├── api-quick-ref.md      # API クイックリファレンス
├── best-practices.md     # ベストプラクティス
└── troubleshooting.md     # トラブルシューティング
```

### コード例

#### プレイヤーコントローラーの作成

```typescript
import { _decorator, Component, Node, Input, EventKeyboard, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    moveSpeed: number = 100;

    private _direction: Vec3 = new Vec3();

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
        const offset = this._direction.clone().multiplyScalar(this.moveSpeed * dt);
        this.node.setPosition(this.node.position.add(offset));
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === Input.KeyCode.ARROW_LEFT || event.keyCode === Input.KeyCode.KEY_A) {
            this._direction.x = -1;
        } else if (event.keyCode === Input.KeyCode.ARROW_RIGHT || event.keyCode === Input.KeyCode.KEY_D) {
            this._direction.x = 1;
        }
    }

    onKeyUp(event: EventKeyboard) {
        this._direction.x = 0;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
```

### 貢献

Issue や Pull Request をお待ちしています！

### ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください

---

## 🇰🇷 한국어

### 개요

이것은 **Cocos Creator 3.8** 게임 개발을 위해 설계된 OpenClaw 스킬입니다. 스크립트 개발, 애니메이션, 물리 엔진, UI 시스템, 크로스 플랫폼 퍼블리싱 등 입문부터 고급 주제까지 광범위하게 다룹니다.

### 기능

- **스크립트 개발** - TypeScript 컴포넌트 시스템, 라이프사이클 관리, 프로퍼티 데코레이터
- **노드 조작** - 트랜스폼, 계층 구조, 컴포넌트 관리
- **이벤트 시스템** - 이벤트 리스닝, 방출, 입력 처리
- **애니메이션 시스템** - Animation 컴포넌트, Tween 애니메이션
- **물리 시스템** - 리지드바디, 충돌, 레이가asting
- **UI 시스템** - 레이블, 스프라이트, 버튼, 레이아웃
- **리소스 관리** - 로딩, 해제, 캐싱
- **씬 관리** - 로딩, 전환, 프리로딩

### 설치

#### 방법 1: SkillHub으로 설치 (권장)

```bash
skillhub install cocos-creator
```

#### 방법 2: 수동 설치

```bash
git clone https://github.com/hsiaozzz/cocos-creator-skill.git
cp -r cocos-creator-skill/cocos-creator ~/.qclaw/skills/
```

### 사용 예시

```
Cocos Creator에서 플레이어 컨트롤러 만드는 방법은?
물리를이용한 점프 구현 방법은?
리소스를 동적으로 로딩하는 방법은?
게임을 iOS/Android/Web에 퍼블리싱하는 방법은?
```

### 문서 구조

```
cocos-creator/
├── SKILL.md              # 메인 스킬 파일
├── README.md             # 이 파일
├── examples.md           # 코드 예시
├── api-quick-ref.md      # API 빠른 참조
├── best-practices.md     # 모범 사례
└── troubleshooting.md     # 문제 해결
```

### 코드 예시

#### 플레이어 컨트롤러 생성

```typescript
import { _decorator, Component, Node, Input, EventKeyboard, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    moveSpeed: number = 100;

    private _direction: Vec3 = new Vec3();

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
        const offset = this._direction.clone().multiplyScalar(this.moveSpeed * dt);
        this.node.setPosition(this.node.position.add(offset));
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === Input.KeyCode.ARROW_LEFT || event.keyCode === Input.KeyCode.KEY_A) {
            this._direction.x = -1;
        } else if (event.keyCode === Input.KeyCode.ARROW_RIGHT || event.keyCode === Input.KeyCode.KEY_D) {
            this._direction.x = 1;
        }
    }

    onKeyUp(event: EventKeyboard) {
        this._direction.x = 0;
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
```

### 기여

Issue 및 Pull Request를 환영합니다!

### 라이선스

MIT 라이선스 - 자세한 내용은 [LICENSE](LICENSE)를 참조하세요

---

## 📝 License

MIT License

Copyright (c) 2024 hsiaozzz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
