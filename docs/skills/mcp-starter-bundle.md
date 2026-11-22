---
title: MCP 入门包
description: 把第三方服务接进 Agent 的入门合集：最小权限、工具 schema 与测试边界。
updated: 2026-11-22
aside: false
pageClass: skill-browse
---

# MCP 入门包

想把第三方服务接进 Agent，第一步不是找现成的连接器，而是先学会怎么接：走官方 MCP 或 API、只给最小权限、把工具 schema 与错误处理写清楚、再用一次无害的读取验证。这个包就是这第一步。

## 包含的技能

- [自定义连接器 / MCP](/skills/custom-connectors-mcp)：用最小权限把第三方服务接入 Agent，并明确工具 schema、错误处理和测试边界。

本包目前只有一个技能。高德、滴滴、瑞幸是 MCP 连接器文档，不是技能文件，站内没有对应的技能可以打包；站内也没有第二个与 MCP 相关的技能，所以没有硬凑第二个成员。

## 下载

[下载 MCP 入门包 ZIP](/skills/zips/mcp-starter-bundle.zip)

包里有自定义连接器技能的完整文件（SKILL.md），根目录附一份 README，说明成员清单与安装方法。

## 适用人群

第一次给 Agent 接第三方服务、想按最小权限把连接器搭起来的人。

## 安装

解压 ZIP，把技能文件夹放进你所用 Agent 的 skills 目录（不同 Agent 的路径不同，以你所用工具的文档为准）。具体用法见 SKILL.md。
