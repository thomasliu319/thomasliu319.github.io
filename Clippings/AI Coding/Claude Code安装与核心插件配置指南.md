---
title: Claude Code安装与核心插件配置指南
source: https://www.notion.so/Claude-Code-3271cdc36e928063906df043fb56dbd2
author:
  - thomas
published:
created: 2026-05-11
description: A collaborative AI workspace, built on your company context. Build and orchestrate agents right alongside your team's projects, meetings, and connected apps.
tags:
  - AICoding
---

> 本文档基于 Claude Code 最新版本（2026年3月），帮助你快速完成安装和主流 MCP 插件的配置。

### 前置条件

在安装 Claude Code 前，请确认以下条件：

### 一、安装 Claude Code

方式一：命令行安装(可能需要科学上网)

打开终端，执行以下命令：

\# 全局安装 Claude Code CLI npm install -g @anthropic-ai/claude-code # 验证安装是否成功 claude --version

方式二：使用AI帮你安装

[https://qoder.com/，通过qoder来安装](https://qoder.com/%EF%BC%8C%E9%80%9A%E8%BF%87qoder%E6%9D%A5%E5%AE%89%E8%A3%85)

![](https://www.notion.so/image/attachment%3Aa70cdc18-b2ea-4221-83b1-1c0bd874e520%3Aimage.png?table=block&id=3271cdc3-6e92-8038-8bf4-db1f4a0ad80e&spaceId=d985ef59-2228-4362-a877-6fee55e76f38&width=1410&userId=c9ca8ccc-de21-4503-89b5-120fff550794&cache=v2) ![](https://www.notion.so/image/attachment%3Acf5bf687-f1bb-4f50-8700-fed39cb732e1%3Aimage.png?table=block&id=3271cdc3-6e92-80e8-831f-db8814cf6ba9&spaceId=d985ef59-2228-4362-a877-6fee55e76f38&width=1410&userId=c9ca8ccc-de21-4503-89b5-120fff550794&cache=v2)

\# 全局安装 Claude Code CLI npm install -g @anthropic-ai/claude-code # 验证安装是否成功 claude --version 请你帮我安装claude code，以上是安装命令，如果本机已安装，请输出当前的claude 版本

#### 二、认证与登录

这里推荐使用cc助手，可以配置多api源

https://www.npmjs.com/package/@wcldyx/claude-code-switcher

![](https://www.notion.so/image/attachment%3A3708599d-1fa1-4ffa-8ea3-f0fcb02f1497%3Aimage.png?table=block&id=32a1cdc3-6e92-809c-8682-cb124b6b03ed&spaceId=d985ef59-2228-4362-a877-6fee55e76f38&width=1410&userId=c9ca8ccc-de21-4503-89b5-120fff550794&cache=v2)

供应商名称 │ apiwork 显示名称 │ apiwork 认证模式 │ API密钥模式 基础URL │ https://aipg.work 认证令牌 │ sk-x 主模型 │ 未设置 快速模型 │ 未设置

供应商名称 │ glm 显示名称 │ glm 认证模式 │ API密钥模式 基础URL │ https://open.bigmodel.cn/api/anthropic 认证令牌 │ bb-x

#### 三、核心插件安装 https://github.com/gsd-build/get-shit-done 1、官方仓库 •https://github.com/anthropics/claude-code/tree/main/plugins •安装方式：npm install -g @anthropic-ai/claude-code

#### 工具功能对照表 标红的是最常用

| 名称 | 说明 | 功能内容 |
| --- | --- | --- |
| agent-sdk-dev | Claude Agent SDK 开发工具包 | 命令：/new-sdk-app —— 交互式创建新的 Agent SDK 项目<br>智能体： agent-sdk-verifier-py、 agent-sdk-verifier-ts —— 按最佳实践检验 SDK 应用 |
| claude-opus-4-5-migration | 将代码与提示词从 Sonnet 4.x、Opus 4.1 迁移到 Opus 4.5 | 技能：  claude-opus-4-5-migration  —— 自动迁移模型名称、测试版请求头与提示词适配 |
| code-review | 基于多专业智能体的自动化 PR 代码评审，带置信度评分过滤误报 | 命令：/code-review —— 自动化 PR 评审流程<br>智能体：5 个并行 Sonnet 智能体，负责 [CLAUDE.md](http://claude.md/) 规范、Bug 检测、历史上下文、PR 记录、代码注释 |
| commit-commands | Git 工作流自动化：提交、推送与创建 Pull Request | 命令：/commit、/commit-push-pr、/clean\_gone —— 简化 Git 操作 |
| explanatory-output-style | 补充关于实现思路与代码架构模式的讲解说明（复刻已废弃的讲解式输出风格） | 钩子： SessionStart —— 每次会话开始时注入讲解性上下文 |
| feature-dev | 完整的功能开发工作流，采用结构化 7 阶段流程 | 命令：/feature-dev —— 引导式功能开发流程<br>智能体：code-explorer （代码浏览）、code-architect（架构设计）、code-reviewer（质量评审） |
| frontend-design | 创建有辨识度、生产级前端界面，避免通用 AI 风格 | 技能： frontend-design —— 前端工作时自动启用，提供设计、排版、动画、 视觉细节等指导 |
| hookify | 通过分析对话模式或显式指令，快速创建自定义钩子以避免不期望行为 | 命令：/hookify 、 /hookify:list 、 /hookify:configure 、 /hookify:hel p <br>智能体： conversation-analyzer —— 分析对话中的异常行为<br>技 能： writing-rules —— 钩子规则语法编写指南 |
| learning-output-style | 交互式学习模式，在关键决策点要求用户编写有意义的代码（复制未上线的学习式输出风格） | 钩子：SessionStart —— 鼓励在决策点编写有效代码（5-10 行）并同步讲解 |
| plugin-dev | Claude 代码插件开发完整工具包，含 7 项专家技能与 AI 辅助创建 | 命令：/plugin-dev:create-plugin —— 8 阶段引导式插件构建流程<br>智能 体：agent-creator、plugin-validator、skill-reviewer<br>技能： 钩子开发、MCP 集成、插件结构、配置、命令、智能体与技能开发 |
| pr-review-toolkit | 专业 PR 评审工具集，专注注释、测试、错误处理、类型设计、代码质量、简化 | 命令：/pr-review-toolkit:review-pr ——可指定评审维度（注释、测试、 错误、类型、代码、简化、全部）<br>智能体：comment-analyzer、pr- test-analyzer、silent-failure-hunter、type-design-analyzer、code-reviewer、code-simplifier |
| ralph-wiggum | 交互式自循环 AI 迭代开发，Claude 重复执行同一任务直至完成 | 命令： /ralph-loop 、 /cancel-ralph —— 启动/停止自主迭代循环<br>钩 子： Stop —— 拦截退出操作以继续迭代 |
| security-guidance | 安全提醒钩子，编辑文件时对潜在安全风险发出警告 | 钩子：PreToolUse —— 监控 9 类安全模式，包括命令注入、XSS、eval 使用、 危险 HTML、pickle 反序列化、os.system 调用等 |

需要我帮你把这份内容整理成简洁版清单方便快速查阅吗？

/feature-dev:feature-dev is running… @agent-service/src/main/java/com/agent/ service/consumer/QwMessageHandler.java#L106-120 1、先分析理解这段代码，项目中有多处类似逻辑需要一起修改 2、将这行代码(CollectionUtils.isNotEmpty(sandBoxUser) && sandBoxUser.contains(qwUserInfo.getUserId())修改成CollectionUtils.isNotEmpty(sandBoxUser) && sandBoxUser.contains(qwUserInfo.getWid()) 3、相关的注释和日志也许要同步修改

#### 2、superpower Github：https://github.com/obra/superpowers 安装方式

/plugin marketplace add obra/superpowers-marketplace /plugin install superpowers@superpowers-marketplace

#### 工具功能对照表

| 技能 | 何时使用 | 产出 |
| --- | --- | --- |
| using-superpowers | 对话开始 | 加载正确技能 |
| brainstorming | 创建功能/修改行为 | 设计文档 |
| systematic-debugging | Bug/测试失败 | 根因分析 + 修复 |
| test-driven-development | 实现功能/bugfix | 测试 + 实现 |
| writing-plans | 多步骤任务 | 实现计划 |
| executing-plans | 执行计划（独立会话） | 完成的实现 |
| subagent-driven-development | 执行计划（同会话） | 完成的实现 |
| verification-before-completion | 声称完成前 | 验证证据 |
| requesting-code-review | 任务/功能完成 | 审查反馈 |
| receiving-code-review | 收到审查反馈 | 技术评估 |
| finishing-a-development-branch | 所有任务完成 | 合并/PR/清理 |
| using-git-worktrees | 需要隔离环境 | worktree |
| dispatching-parallel-agents | 多个独立问题 | 并行解决 |
| writing-skills | 创建/编辑技能 | [SKILL.md](http://skill.md/) |

#### 3、GSD GSD 是一个元提示词和上下文工程系统，它彻底改变了你与 AI 编码助手（如 Claude Code、OpenCode、Gemini CLI 和 Codex）的协作方式。它通过智能编排、XML 格式的提示词以及原子任务执行，解决了上下文腐烂这一关键问题——即 AI 模型因累积过多上下文而导致的性能下降。

#### 4、写作助手 🚀 专注公众号/自媒体文章创作的 AI 智能写作助手 在 Claude、Cursor、Gemini 等 AI 助手中直接使用斜杠命令，系统化创作高质量文章 •Github：https://github.com/wordflowlab/article-writer

#### 3、Context7 MCP（实时文档） 安装

claude mcp add --transport http context7 https://mcp.context7.com/mcp

![](https://www.notion.so/image/attachment%3Add1a81b7-59ca-49c4-b3ac-9db6bf710e21%3Aimage.png?table=block&id=32c1cdc3-6e92-802e-b67b-c33063c7b425&spaceId=d985ef59-2228-4362-a877-6fee55e76f38&width=1410&userId=c9ca8ccc-de21-4503-89b5-120fff550794&cache=v2)

#### 4、draw(绘制架构图) 可以安装三方的draw.io的插件仓库，也可以自己让claude code https://www.claudepluginhub.com/plugins/henkisdabro-mcp-excalidraw-plugins-mcp-excalidraw

![](https://www.notion.so/image/attachment%3A00b87cba-db8e-4e0e-912a-17ce59d158f4%3Aimage.png?table=block&id=32c1cdc3-6e92-80b0-9fe8-e030317a78b4&spaceId=d985ef59-2228-4362-a877-6fee55e76f38&width=1410&userId=c9ca8ccc-de21-4503-89b5-120fff550794&cache=v2)

#### 四、核心 MCP 插件

MCP（Model Context Protocol）是开放标准协议，让 Claude Code 能连接外部工具、数据库和 API。安装插件后，Claude 可以直接操作 GitHub 仓库、查询数据库、搜索网络等。 ⚠️ 请仅安装来源可信的 MCP 服务。第三方服务器可能带来提示注入风险，安装前确认信任来源。

##### 1.Context7 MCP（实时文档）

为 Claude 提供各主流框架和库的最新实时文档，解决训练数据过时问题。

claude mcp add --transport http context7 https://mcp.context7.com/mcp

安装后，Claude 会在需要时自动拉取对应库的最新文档，提升代码建议的准确性。

##### 2.PostgreSQL MCP

让 Claude 以自然语言查询 PostgreSQL 数据库，自动生成并执行 SQL。

claude mcp add-json postgres '{ "command": "npx", "args": \[ "-y", "@modelcontextprotocol/server-postgres", "postgresql://username:password@localhost:5432/dbname" \] }'

将连接字符串替换为你的数据库信息。 示例用法：

查询上个月消费金额最高的 10 个用户

Claude 会自动检查表结构，生成并执行对应 SQL。

##### 3\. Github

claude mcp add --transport http github https://api.githubcopilot.com/mcp/

#### 五、核心配置

•hook机制：结束完内容之后会自动更新知识库

{ "hooks": { "Stop": \[ { "hooks": \[ { "type": "prompt", "prompt": "你正在评估当前对话上下文中的信息是否需要更新到知识库中。背景信息：$ARGUMENTS\\n\\n分析对话内容并判断是否应该更新到知识库中。\\n\\n## 评估标准\\n\\n### 需要更新知识库的情况（任一满足即可）：\\n\\n\*\*1. 技术发现与解决方案\*\*\\n- 发现新的技术方案、工具使用方法或最佳实践\\n- 解决了复杂的技术问题，有参考价值的排查经验\\n- 发现了框架/库的特定用法或陷阱\\n\\n\*\*2. 架构与设计变更\*\*\\n- 项目架构调整、模块职责变化\\n- 新的设计模式应用或重构经验\\n- 接口定义、调用关系的重要变更\\n\\n\*\*3. 代码规范与约定\*\*\\n- 新的编码规范或命名约定\\n- 特殊的代码组织方式或项目结构调整\\n- 重要的代码风格要求\\n\\n\*\*4. 业务逻辑知识\*\*\\n- 新的业务概念、领域知识\\n- 业务流程变更、状态流转规则\\n- 新的业务场景或用例\\n\\n\*\*5. 配置与环境\*\*\\n- 新的配置项、环境变量\\n- 依赖版本升级及兼容性说明\\n- 部署方式、启动参数变更\\n\\n\*\*6. API与服务集成\*\*\\n- 外部服务的调用方式、接口说明\\n- API使用经验、限流、重试等配置\\n- 集成问题的解决方案\\n\\n### 不需要更新的情况：\\n- 简单的代码修改、bug修复\\n- 临时性的调试信息\\n- 重复已有知识的内容\\n- 缺乏通用价值的临时方案\\n- 无法验证的正确性\\n- 仅提交代码\\n\\n## 回复格式\\n\\n以JSON格式回复：\\n\\n如果无需更新知识库，直接返回：\\n{\\"ok\\": true}\\n\\n如果需要更新知识库，返回：\\n{\\"ok\\": false, \\"decision\\": \\"block\\", \\"reason\\": \\"详细说明应该更新什么内容，属于哪个评估类别，并要求更新到知识库\\"}" } \] } \] } }

#### 六、一些玩法 6.1、安装claude code

\# 官方命令 curl -fsSL https://openclaw.ai/install.sh | bash # 备用命令（如果上面的不行） curl -fsSL https://molt.bot/install.sh | bash curl -fsSL https://clawd.bot/install.sh | bash 我想要安装openclaw，以上是安装命令，请你帮我操作

参考资源 • [https://skills.sh/anthropics/skills](https://skills.sh/anthropics/skills%E2%80%8B) [https://skills.sh/anthropics/skills](https://skills.sh/anthropics/skills) • [https://skillsmp.com/](https://skillsmp.com/%E2%80%8B) [https://skillsmp.com/](https://skillsmp.com/) •Claude Code 官方文档 [https://code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview) •MCP 协议文档 [https://code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp) •MCP 插件目录 [https://claudelog.com/claude-code-mcps/](https://claudelog.com/claude-code-mcps/) •GitHub MCP Server [github-mcp-server](https://github.com/github/github-mcp-server)