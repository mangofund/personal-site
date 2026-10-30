---
name: impeccable
description: "设计审阅工具链：对已有前端界面做 critique / audit / polish。用于 UX 评审、可访问性与性能审计、上线前打磨；不是从零做视觉方向（那用 frontend-design）。也可在用户说审阅、挑毛病、打磨 UI、a11y 检查时使用。"
version: 4.8.0-store
license: Apache-2.0
---

# Impeccable（设计审阅工具链）

> 定位：**审阅与打磨**已有界面，不是 Anthropic `frontend-design` 的替代品。  
> 上游：[pbakaus/impeccable](https://github.com/pbakaus/impeccable)（Apache-2.0）。本商店包为精简子集。

本包保留三条核心审阅命令与必要地板文档：

| 命令 | 用途 | 参考 |
|---|---|---|
| `critique [target]` | UX 启发式评审与打分 | [reference/critique.md](reference/critique.md) |
| `audit [target]` | 技术质量（a11y / perf / responsive） | [reference/audit.md](reference/audit.md) |
| `polish [target]` | 上线前最终打磨 | [reference/polish.md](reference/polish.md) |

编辑任何 UI 前先读 [reference/craft-floor.md](reference/craft-floor.md)。命令选择犹豫时读 [reference/routing.md](reference/routing.md)。

## 与 frontend-design 的分工

- **frontend-design**：从零定视觉方向、字体、配色，避免 AI 默认审美。
- **impeccable（本包）**：对已有页面做审阅、审计、polish；按启发式与质量地板改，不另起一套品牌世界（除非用户明确要求 redesign）。

## 无 CLI 时的用法

本商店 ZIP **不含** 上游自包含 launcher / binary（体积过大）。没有 `impeccable` CLI 时：

1. 直接阅读对应 `reference/*.md` 并按清单执行。
2. 需要完整 CLI、更多命令（shape / animate / live 等）时，按 [INSTALL.md](INSTALL.md) 安装上游完整版。

## 原则（精简）

- Finish the job：交付完整，除非缺用户必须提供的资产。
- 以渲染结果验收：在真实尺寸上看，再改。
- Brief wins：用户钉死的美学优先于审阅者的个人口味。
- Refinement preserves；redesign replaces — 未获授权不要换世界观。

## 许可与归属

见同目录 `LICENSE`（Apache-2.0）与 `NOTICE.md`（含第三方 platform-design-skills 声明）。Copyright 归上游作者；本商店仅再分发精简子集。
