# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

纯静态 HTML 博客，托管于 GitHub Pages（thomasliu319.github.io）。内容主题为 Claude Code 工程化实战课程笔记。所有内容使用中文。

## 分支与部署

- `develop` 分支用于开发
- `master` 分支为生产部署分支（GitHub Pages 直接从 master 提供服务）
- 无 CI/CD，无构建步骤，直接提交 HTML 文件即可部署

## Git 提交规范

```
git:add <描述>     # 新增内容
git:fix <描述>     # 修复问题
```

## 架构：两种文章渲染模式

### 模式 A — Hexo 标准渲染（旧文章，如 2026/05/07 下的文章）

- 由 Hexo 5.4.0 生成的完整 HTML，内容直接嵌入 `<div class="article-entry">` 中
- DOM 结构：`#container > #wrap > #header + #main + #footer`
- 站点名称：`Thomasliu319 HOME`
- 依赖：`/css/style.css`、jQuery、FancyBox

### 模式 B — Markdown 动态加载（新文章，如 2026/05/08 及之后）

- `index.html` 为空壳模板，通过 `fetch()` + `marked.js` 从 `/Clippings/` 目录加载 Markdown 并客户端渲染
- 代码高亮使用 Prism.js（支持 bash/js/python/json/yaml/css/markdown/ts）
- DOM 结构：`#layout > #header + #main + #footer`
- 站点名称：`Thomas Liu`
- 样式部分内联在 `<style>` 标签中

**新文章一律使用模式 B。**

## 内容管理工作流

1. 在 Obsidian 中编写/剪藏 Markdown 到 `/Clippings/Claude Code 工程化实战/` 目录
2. 在日期路径下创建 `index.html` 外壳（如 `2026/05/09/<slug>/index.html`）
3. HTML 外壳中通过 `fetch()` 引用对应的 Markdown 文件路径
4. 提交到 `develop`，合并到 `master` 发布

## 关键目录

- `/Clippings/` — Markdown 源文件（被新文章 HTML 通过 fetch 加载）
- `/2026/MM/DD/<slug>/` — 文章页面（index.html）
- `/css/style.css` — 全局样式（Hexo landscape 主题）
- `/js/script.js` — jQuery 脚本（搜索/分享/移动导航）
- `/widgets/dashboard.html` — 所有页面异步加载的 Dashboard 组件（天气/时钟/待办）
- `/archives/` — 归档页
- `/tags/` — 标签分类页

## 新文章模板要点（模式 B）

创建新文章时需要：
- 日期路径：`/2026/MM/DD/<slug>/index.html`
- 在 `<script>` 中用 `fetch()` 加载对应 `/Clippings/` 下的 Markdown 文件
- 使用 `marked.parse()` 渲染 + `Prism.highlightAllUnder()` 高亮代码
- 加载 `/widgets/dashboard.html` 到侧边栏
- 同步更新 `/archives/` 和 `/tags/` 页面
