---
title: "极客时间训练营-AI 工程化项目实战营"
source: "https://u.geekbang.org/subject/10/1010551"
author:
published:
created: 2026-06-11
description: "极客时间训练营希望让优秀的人一起学习，我们的理念是让大家“学会并学有所成”，我们的品牌承诺是“老师好、课程好、服务好”。"
tags:
  - "clippings"
---
企业 AI 应用落地痛难点，逐个击破

![](https://static001.geekbang.org/resource/image/39/ca/39d1f696a441a23250ab54f2cbfceeca.png)

从核心技术栈到工程化开发部署，全面升级 AI 项目研发能力

![](https://static001.geekbang.org/resource/image/c0/a0/c06d491f755f8de998bdbfc1bbc6c4a0.png)

构建“三高”AI工程体系，驱动业务高效稳健增长

![](https://static001.geekbang.org/resource/image/51/f8/51cfaa675cc9d726c601f5e5ede647f8.png)

从 0-1 搭建一个工业级智能 Agent 客服平台

![](https://static001.geekbang.org/resource/image/5c/cb/5c61cd20f315fb5c5b7b524976c79acb.png)

22 个项目案例，夯实企业真实业务场景工程化能力

![](https://static001.geekbang.org/resource/image/0e/8e/0eb79b74ddf7d690687d02409a829e8e.png)

部分案例展示

![](https://static001.geekbang.org/resource/image/2e/4e/2e2642408beff8029e264c469554d14e.png)
- 案例一：设计一个可插拔的意图识别与对话管理模块，支持热更新
- 案例二：开发一个基于 MCP 协议的多 Agent 协作系统
- 案例三：构建一个具备短期+长期记忆、多模态输入、移动端推理、自我反思能力的智能 Agent
- 案例四：将一个大模型服务部署到 K8s 集群，支持自动扩缩容与流量控制
- 案例五：实现一个支持高并发、限流、缓存和日志追踪的聊天代理服务（每秒处理 1000+请求）

- ## 模块一大语言模型技术栈与 Prompt 工程
	- 详细内容：
		- 大语言模型调用方式与函数调用（Function Calling）
			- OpenAI Function Calling 原理与实战：
				- JSON Schema 定义工具参数结构
						- Tool Call + Response Chain 流程
						- 示例场景：天气查询、数据库查询、API 调用
				- HuggingFace Transformers / TGI / vLLM / Ollama 等本地/私有化部署调用方式对比
		- LangChain 核心组件详解
			- LangChain 核心组件
				- LLMChain：Prompt → LLM → Output 的基本流程封装
						- Agents：
					- ZeroShotReactDescriptionAgent（ReAct 框架）
								- Plan-and-Execute Agent（计划+执行模式）
						- Tools：集成自定义工具（如搜索、数据库访问、计算）
						- Memory：短期记忆（ConversationBufferMemory）、长期记忆（Redis/MongoDB 存储）
		- LlamaIndex 全流程实践
			- 文档加载器（Document Loaders）：PDF、网页、SQL、Notion 等格式支持
				- 索引构建（Indexing）：向量化存储、元数据管理
				- 查询引擎（Query Engine）：检索 + 生成一体化
				- 自定义索引结构：扩展 Index 类型以适应特定业务需求
		- Prompt Engineering 高阶技巧
			- 思维链（Chain of Thought, CoT）：引导模型逐步推理
				- 反思机制（Self-Reflection）：让模型自己评估输出质量
				- 提示模板设计（Prompt Templates）：Jinja2、LangChain Template 支持
				- 外部工具调用提示设计（Tool Calling Prompt）
				- 动态 Prompt 生成：根据用户输入动态构造 Prompt
		- AutoGen 多 Agent 协作框架
			- Agent 角色定义（UserProxyAgent、AssistantAgent）
				- Group Chat 模式：多 Agent 轮流发言、达成共识
				- Debate 机制：Agent 间进行辩论以提升决策质量
				- 通信机制：Message Passing、工具调用、反馈循环
		- 微调方法比较（LoRA、P-Tuning v2、Adapter）
			- LoRA（Low-Rank Adaptation）原理与优势
				- P-Tuning v2：基于可学习 prompt 的轻量微调
				- Adapter：插入小型神经网络模块进行增量训练
				- 适用场景分析：何时选择哪种微调方式？
		- Agent 构建与多轮对话逻辑设计
			- 如何设计一个 Agent 的状态机？
				- 多轮对话中如何保持上下文？
				- 如何设计 Agent 之间的消息传递协议？
				- 示例：用户提问 → Agent 分解任务 → 多个子Agent协作 → 汇总结果返回
	- 实践练习：
		- 实践一：基于 LangChain 构建一个多任务问答助手
			- 输入输出定义：
				- 输入：用户自然语言问题（如："帮我查一下今天的天气"、"最近的新闻有哪些？"）
						- 输出：准确答案 + 使用了哪些工具（如天气 API、新闻 API）
						- 扩展项：支持历史对话上下文、缓存结果、错误处理
				- 关键挑战：
				- 如何判断是否需要调用工具？
						- 如何防止无限递归或死循环？
						- 如何记录对话状态？
		- 实践二：构建一个多 Agent 协同客服系统
			- 场景设定：
				- 用户提问："我的订单为什么还没发货？"
						- 系统拆解任务：
					- Agent A：查询订单状态（调用内部系统）
								- Agent B：检查物流信息（调用第三方 API）
								- Agent C：汇总结果并生成回复
				- 技术难点：
				- 如何设计 Agent 之间的通信协议？
						- 如何保证失败重试机制？
						- 如何可视化 Agent 之间的交互过程？
- ## 模块二深度学习与 NLP 基础
	- 详细内容：
		- NLP 核心概念回顾
			- Tokenization：
				- 字符级、词级、子词级（BPE、WordPiece）
						- 分词工具（NLTK、spaCy、HuggingFace Tokenizers）
				- Embedding：
				- Word2Vec、GloVe、FastText
						- Transformer 中的 Positional Encoding
				- Attention 机制：
				- Softmax 注意力、Self-Attention、Cross-Attention
						- 多头注意力（Multi-head Attention）详解
		- Transformer 架构详解
			- Encoder-Decoder 结构
				- Self-Attention 的数学推导与代码实现
				- Positional Encoding 的作用与实现方式
				- Feed Forward 层结构
				- Layer Normalization 与残差连接
				- 编码器 vs 解码器的区别
		- Transformer 变体与扩展
			- BERT：
				- MLM（Masked Language Modeling）
						- NSP（Next Sentence Prediction）
				- GPT 系列（GPT-2/3/3.5/4）：
				- 自回归生成模型
						- 上下文学习（In-context Learning）
				- MoE（Mixture of Experts）：
				- 如何在大规模模型中做专家路由？
				- 多模态模型（CLIP、BLIP、Flamingo）：
				- 图像 + 文本联合建模
						- 跨模态检索与生成
		- 使用 PyTorch / TensorFlow 实现文本分类
			- 数据预处理：
				- 加载数据集（IMDB、AG News、SST-2）
						- Tokenizer 使用与 padding/truncation
				- 模型构建：
				- LSTM、CNN、Transformer-based 模型对比
				- 训练流程：
				- Loss 函数选择（CrossEntropyLoss）
						- Optimizer 配置（AdamW）
						- 学习率调度（LinearWithWarmup）
				- 评估指标：
				- Accuracy、F1-score、AUC-ROC
		- HuggingFace Transformers 库实战
			- 安装与基本用法
				- 预训练模型加载（AutoModelForSequenceClassification）
				- Tokenizer 使用（from\_pretrained）
				- Trainer API 使用：
				- 自定义 Dataset 类
						- TrainingArguments 配置
						- EvaluationCallback 回调函数
		- LoRA 微调实战（使用 PEFT 库）
			- LoRA 原理简述：
				- 在权重矩阵中引入低秩矩阵进行参数调整
						- 显存节省、推理效率高
				- 使用 PEFT（Parameter Efficient Fine-Tuning）库进行微调
				- 微调后模型保存与加载
				- 微调效果对比（LoRA vs 全量微调）
		- 模型评估与 A/B 测试
			- BLEU、ROUGE、METEOR、Perplexity 指标详解
				- 如何设计 A/B 测试实验？
				- 因果推断在 A/B 测试中的应用
				- 统计显著性检验（t-test、bootstrap）
				- 模型迭代策略（持续评估 + 回滚机制）
		- 模型压缩与优化技术
			- 知识蒸馏（Knowledge Distillation）：
				- 小模型模仿大模型输出分布
				- 量化（Quantization）：
				- INT8、FP16、混合精度训练
				- ONNX Runtime 部署：
				- 将模型转换为 ONNX 格式
						- 使用 ONNX Runtime 加速推理
				- 模型剪枝（Pruning）：
				- 移除冗余参数以减小模型体积
		- 超参数自动调优（Optuna / Hyperopt）
			- 参数搜索空间定义
				- 使用 Optuna 进行网格搜索 / 贝叶斯优化
				- 并行训练多个模型版本
				- 最佳超参数组合选取
	- 实践练习：
		- 实践一：训练一个意图识别模型并部署为 API
			- 输入输出定义：
				- 输入：用户自然语言句子（如"我要退票"、"查询余额"）
						- 输出：对应的意图标签（如"ticket\_refund", "account\_balance"）
				- 扩展项：
				- 支持热更新模型
						- 提供 Swagger UI 接口文档
						- 添加日志记录与异常处理
		- 实践二：基于 LoRA 微调一个垂直领域客服问答模型并部署为 API
			- 场景设定：
				- 使用医疗或法律领域的 QA 数据集（如 MedQA、LegalQA）
						- 微调一个 BERT 或 LLaMA 模型，提升特定领域问答准确率
				- 技术难点：
				- 如何准备领域语料？
						- 如何评估模型在领域内的表现？
						- 如何将 LoRA 权重合并进原始模型？
- ## 模块三数据工程与知识增强
	- 详细内容：
		- 数据清洗与预处理
			- 原始数据来源：
				- PDF、Word、HTML、数据库、API
				- 清洗方法：
				- 正则表达式提取关键字段
						- 使用 Pandas 进行缺失值填充、去重、格式标准化
				- 文本规范化：
				- 分词、去除停用词、大小写统一、拼写纠错
				- 编码转换与乱码处理
		- 多源异构知识库构建
			- 多模态数据整合：
				- 结构化数据（数据库表）
						- 半结构化数据（JSON/XML）
						- 非结构化数据（文本、图像描述）
				- 数据归一化与统一接口设计
				- 数据版本控制（DVC / Git LFS）
		- 文档切片策略优化
			- 固定长度切片 vs 语义切片：
				- 固定长度：容易截断语义
						- 语义切片：基于句子/段落边界、标题识别
				- 重叠窗口机制：
				- 解决信息被割裂问题
				- 使用 LangChain / LlamaIndex 内置分块器（RecursiveCharacterTextSplitter）
				- 自定义分块逻辑（基于标点、换行符、标题等级）
		- 向量数据库原理与实战
			- 向量表示基础：
				- 使用 BERT、Sentence-BERT、SBERT-wk 等模型编码文本
				- 相似性搜索算法：
				- FAISS 中的 IndexFlatL2、IVF-PQ、HNSW
				- Milvus 架构介绍：
				- Standalone vs Cluster 模式
						- 存储引擎（MinIO）、注册中心（Etcd）
		- 向量数据库集群部署
			- Milvus Standalone 部署：
				- Docker Compose 安装
				- Milvus Cluster 模式部署：
				- Etcd + MinIO + Milvus standalone 组合
				- FAISS + Redis 缓存加速：
				- 利用 Redis 缓存高频查询结果
						- 设计缓存失效机制（TTL、更新通知）
		- RAG 系统构建
			- RAG 流程详解：
				- Retrieve → Generate
				- 使用 LangChain / LlamaIndex 构建 RAG Pipeline
				- 支持多源检索（混合 BM25 + 向量检索）
				- 评估指标：
				- Recall@K, MRR, BLEU, ROUGE-L
		- 知识图谱基础与 Neo4j 实践
			- 图数据库基础概念：
				- 节点、关系、属性
				- Neo4j 安装与 Cypher 查询语言
				- 构建 FAQ 图谱：
				- 问题节点 ←→ 答案节点
						- 问题之间相似性关系
				- 图谱可视化工具（APOC、Gephi）
		- 图神经网络在知识图谱中的应用
			- PyTorch-Geometric + Neo4j 联合使用
				- GNN 模型用于关系预测、实体分类
				- 多跳问答示例：
				- 用户提问："A 公司的子公司有哪些？"
						- 图谱中路径：A 公司 → 控股 → B公司 → 控股 → C公司
		- RAG + KG 联合推理
			- 如何将 RAG 与图谱结合？
				- 先 RAG 检索候选答案，再图谱验证
						- 或者先图谱查找相关实体，再 RAG 生成回答
				- 多跳问答系统构建：
				- 第一次检索 → 得到中间实体 → 第二次检索 → 最终答案
		- 数据增强策略
			- Back Translation（回译）：
				- 将中文翻译成英文，再翻译回来生成变体
				- EDA（Easy Data Augmentation）：
				- 同义词替换、随机插入、删除、交换
				- 利用大模型生成伪样本（Self-training）
	- 实践练习：
		- 实践一：构建一个基于 FAISS/Milvus 的 FAQ 检索系统
			- 输入输出定义：
				- 输入：用户自然语言问题（如"如何退货？"）
						- 输出：最相关的 FAQ 条目及其答案
				- 扩展项：
				- 支持多轮对话上下文过滤
						- 支持热更新知识库
						- 提供 RESTful API 接口
		- 实践二：构建一个融合文档检索、图谱推理与 LLM 生成的多跳问答系统
			- 场景设定：
				- 用户问："A 公司的最大股东是谁？"
						- 系统流程：
					- 检索 A 公司相关信息
								- 图谱中查找控股关系
								- 生成最终回答
				- 技术难点：
				- 如何将 RAG 与图谱推理融合？
						- 如何设计联合评分机制？
						- 如何防止错误传播？
- ## 模块四智能客服系统架构设计
	- 详细内容：
		- 智能客服系统整体架构解析
			- 整体分层架构：
				- 前端接入层（Web / App / 微信 / 第三方接口）
						- 对话引擎层（意图识别、对话状态管理、Agent 执行）
						- 后台服务层（数据库、API 网关、消息队列）
				- 关键子系统：
				- NLU（自然语言理解）
						- DM（对话管理）
						- NLG（自然语言生成）
						- DST（对话状态追踪）
		- 意图识别与槽位填充
			- Rule-based 方法：
				- 正则匹配、关键词库、有限状态机（FSM）
				- ML-based 方法：
				- 使用 BERT、CRF、BiLSTM 等模型进行分类与序列标注
				- Slot Filling 流程：
				- 提取用户输入中的实体信息（如时间、地点、订单号）
		- 意图识别流水线（Pipeline Design）
			- 多阶段融合策略：
				- 规则引擎兜底
						- 机器学习模型主控
						- Ensemble 投票机制
				- 模型热更新机制：
				- 加载新模型权重而不重启服务
				- 意图识别服务 API 设计（RESTful / gRPC）
		- 上下文理解与状态追踪（Dialogue State Tracking）
			- 状态表示方式：
				- FSM（有限状态机）
						- 基于 Rasa 的 Tracker
						- 使用 RL 或 LSTM 模型进行状态建模
				- Session Context 管理：
				- 存储历史对话状态（Redis / MongoDB）
						- 实现跨轮次的上下文共享
		- 多轮对话设计与管理
			- Slot Filling 机制：
				- 动态缺失槽位提示
						- 回退机制（Fallback）设计
				- 对话流程控制：
				- 条件分支、循环逻辑、跳转指令
				- 错误处理：
				- 非法输入检测
						- 多轮超时机制
		- 工具调用引擎（Tool Calling Pipeline）
			- 工具注册与发现机制：
				- 插件化加载（Python importlib）
						- REST/gRPC 工具封装
				- 工具调度流程：
				- 根据意图和槽位选择对应工具
						- 执行并返回结果
				- 异常处理机制：
				- 工具失败重试
						- 超时中断
						- 结果缓存机制
		- 自定义 Agent 设计
			- Agent 组件设计：
				- 决策引擎（Rule-based / LLM）
						- 工具调用管理器
						- 记忆存储（短期+长期记忆）
				- Agent 行为建模：
				- 基于 LangChain 的 Agent Loop
						- 基于状态机的 Agent 流程控制
				- 示例 Agent 类型：
				- 客服 Agent
						- 订单查询 Agent
						- 售后处理 Agent
		- 插件化架构设计（支持动态加载新功能）
			- 插件结构设计：
				- config.yaml 定义插件元信息
						- plugin.py 定义插件逻辑
				- 动态加载机制：
				- 使用 Python importlib 或 pkg\_resources
				- 插件热更新机制：
				- 不重启服务更新插件代码
				- 插件生命周期管理：
				- 初始化、运行、销毁钩子函数
		- 多模态输入处理
			- 图像输入处理：
				- OCR 提取文字内容
						- CLIP 模型识别图像语义
				- 语音输入处理：
				- ASR（自动语音识别）转文本
						- 使用 Whisper、DeepSpeech 等开源模型
				- 多模态融合策略：
				- 文本 + 图像联合理解
						- 使用多模态模型（如 BLIP、Flamingo）
	- 实践练习：
		- 实践一：设计一个支持多轮对话的订单查询客服流程
			- 输入输出定义：
				- 输入：用户自然语言（如“我要查订单”、“订单号是 1234567890”）
						- 输出：订单状态、物流信息、退款建议等
				- 扩展项：
				- 支持语音输入（ASR）
						- 支持图像上传（OCR 提取订单号）
						- 支持对话记录持久化（MongoDB）
		- 实践二：设计一个可插拔的意图识别与对话管理模块，支持热更新
			- 场景设定：
				- 新增一个“发票开具”意图
						- 系统无需重启即可加载新意图模型和对话流程
				- 技术难点：
				- 如何实现模型热加载？
						- 如何保证热加载过程中的稳定性？
						- 如何测试新增意图的兼容性？
- ## 模块五多 Agent 协作与通信机制
	- 详细内容：
		- 多 Agent 系统基础概念
			- Agent 定义：
				- 具备自主性、反应性、目标导向性的软件实体
				- 合作 vs 竞争：
				- 协同完成任务 vs 在资源有限场景下博弈
				- 通信机制：
				- 同步 vs 异步、本地内存 vs 网络通信
				- Agent 状态管理：
				- 生命周期、状态迁移、上下文共享
		- 主流 Agent 协作框架对比
			- AutoGen（微软开源）
				- 支持 Group Chat、Debate、自定义角色
						- 优势：支持复杂对话流程、可扩展性强
				- CrewAI（社区活跃）
				- 提供 Task + Agent + Tools 分层结构
						- 支持串行/并行执行
				- LangGraph（LangChain 新推出的 Graph-based Agent 框架）
				- 基于状态机和图结构编排 Agent 流程
						- 可视化流程控制
		- MCP 与 A2A 协议详解
			- MCP（Multi-Agent Communication Protocol）
				- 标准化 Agent 之间的通信格式（JSON Schema）
						- 包含字段：sender、receiver、content、tool\_call、status
				- A2A（Agent-to-Agent）协议
				- 规定 Agent 如何在不同平台上进行互操作
						- 支持跨语言调用
		- 构建基于 MCP 的 Client-Server 架构
			- 服务端设计：
				- 接收 Agent 请求（gRPC / REST）
						- 解析 MCP 消息
						- 执行逻辑并返回响应
				- 客户端设计：
				- 封装 MCP 消息发送器
						- 支持异步回调、超时设置
		- 多 Agent 任务调度策略
			- 并行调度：
				- 多个子任务同时执行（如数据采集、分析、生成）
				- 依赖图调度：
				- 任务之间有前后依赖关系（如先检索再总结）
				- 优先级调度：
				- 设置紧急任务高优先级，普通任务低优先级
				- 资源感知调度：
				- 根据 Agent 的负载情况动态分配任务
		- 使用 Ray 实现分布式 Agent 调度
			- Ray 基础知识：
				- Actor 模型、远程函数、任务队列
						- 分布式部署：
					- 多节点集群部署
								- 自动任务分发与负载均衡
		- 多 Agent 系统的异常处理与恢复机制
			- 错误类型：
				- 工具调用失败、网络中断、Agent 崩溃
				- 恢复策略：
				- 重试机制（指数退避）
						- 熔断机制（Hystrix）
						- 降级机制（兜底回复）
				- 日志记录与追踪：
				- 记录每个 Agent 的行为日志
						- 支持回放与调试
	- 实践练习：
		- 实践一：开发一个基于 MCP 协议的多 Agent 协作系统
			- 输入输出定义：
				- 输入：用户问题（如“帮我写一篇关于 AI Agent 的文章”）
						- 输出：多个 Agent 协作完成研究、撰写、审核、润色等任务
				- 扩展项：
				- 支持失败重试机制
						- 支持 gRPC 通信
						- 支持任务队列持久化（Redis）
		- 实践二：支持 gRPC 通信 + 状态同步 + 任务队列持久化（Redis）
			- 场景设定：
				- 用户提交任务后，系统将任务拆解为多个子任务
						- 每个 Agent 从 Redis 获取任务并执行
						- 执行结果通过 gRPC 回传并更新状态
				- 技术难点：
				- 如何保证任务不丢失？
						- 如何避免重复执行？
						- 如何实现跨服务的状态同步？
- ## 模块六DSL 语言设计与执行引擎
	- 详细内容：
		- DSL 设计原则与应用场景
			- DSL 的定义：
				- 针对特定领域的轻量级语言，用于描述业务逻辑
				- 优势对比传统硬编码：
				- 更易理解（业务人员可参与）
						- 更易修改（无需重新编译/部署）
						- 更易测试（可视化流程 + 单元测试）
				- 应用场景：
				- 客服流程编排（意图识别 → 分支判断 → 工具调用）
						- 风控审批流程（输入 → 条件判断 → 决策输出）
						- 多 Agent 协作调度（任务分配 → 并行执行 → 汇总结果）
		- 使用 ANTLR / Lark 解析 DSL 语法
			- ANTLR（推荐用于复杂语法规则）
				- 定义.g4 语法文件
						- 自动生成词法分析器与语法分析器
						- 支持多种语言（Python、Java、C++）
				- Lark（适合轻量级 DSL）
				- 简洁的 EBNF 语法
						- Python 原生支持
						- 更适合快速原型开发
		- 构建 DSL 解释器与执行引擎
			- 抽象语法树（AST）遍历：
				- 使用 Visitor 模式或 Transformer 模式
				- 执行引擎核心组件：
				- 流程控制器（状态跳转）
						- 表达式求值器（条件判断）
						- 工具调用器（绑定函数）
				- 上下文管理器（保存变量状态）
		- 将 DSL 集成到 Agent 框架中（LangChain / CrewAI）
			- 在 LangChain 中集成：
				- 自定义 Agent 类
						- 注册 Tool 到 ToolManager
						- 使用 PromptTemplate 渲染 DSL 模板
				- 在 CrewAI 中集成：
				- 定义 agent + task + tool 的 YAML 描述
						- 支持流程编排与依赖关系
				- 在 AutoGen 中集成：
				- 使用 UserProxyAgent 发起 DSL 流程
						- AssistantAgent 根据 DSL 执行步骤
		- 支持 DSL 动态生成与运行时参数注入
			- 动态生成 DSL
				- 参数注入机制
				- 热更新机制
				- 版本控制
	- 实践练习：
		- 实践一：设计并实现一套面向 Agent 任务规划的 DSL 语言
			- 输入输出定义：
				- 输入：DSL 脚本文件（YAML 或 JSON）
						- 输出：执行流程日志、最终结果
				- 示例 DSL 功能要求：
				- 包含任务节点（start、step1、step2）
						- 支持条件判断（if...then...else）
						- 支持工具调用（call\_tool）
						- 支持跳转逻辑（goto next\_state）
		- 实践二：开发对应的解析器与执行引擎，支持动态加载与运行
			- 场景设定：
				- 用户上传一个 DSL 文件，系统自动解析并执行流程
						- 支持运行时注入参数（如订单号、用户 ID）
						- 支持热更新 DSL 文件而不重启服务
				- 技术难点：
				- 如何实现高效的 DSL 加载与缓存？
						- 如何防止非法 DSL 引发安全风险？
						- 如何记录执行日志供后续调试？
- ## 模块七智能 Agent 高级能力构建
	- 详细内容：
		- 记忆管理系统设计
			- LangMem / Zep / MemGPT 的使用与扩展
				- 短期记忆：
				- 基于 Session Context 存储最近对话历史
				- 长期记忆：
				- 使用向量数据库（FAISS/Milvus）存储关键事实
		- Agent 可观测性系统构建
			- 集成 LangSmith、Langfuse、Arize
				- 日志追踪结构设计：
				- 支持行为回放与调试
				- 集成 Prometheus + Grafana 实时监控指标（成功率、响应时间、错误率）
		- 多模态 Agent 开发
			- 图像理解 + LLM 推理结合
				- 使用 CLIP 或 BLIP 提取图像语义
						- 将图像描述送入 LLM 生成推理结果
				- GUI Agent（屏幕识别 + 自动操作）
				- 使用 PyAutoGUI + OCR + LLM 构建自动化助手
		- 移动端大模型部署
			- NPU 调度原理与优化（Qualcomm Hexagon、Apple Neural Engine）
				- ONNX Runtime Mobile 部署实战：
				- 模型转换（PyTorch → ONNX）
						- 加载模型并执行推理
				- CoreML（iOS）与 TFLite（Android）部署实践
				- 模型量化、剪枝、蒸馏优化策略
				- 性能优化技巧：
				- 使用 INT8 量化降低内存占用
						- 利用 NPU 加速矩阵运算
						- 缓存高频词嵌入向量
		- 自主学习 Agent
			- 基于 RL 的 Agent 探索与环境交互
				- 强化学习基础（Q-Learning、PPO）
						- 设计 Reward 函数引导 Agent 学习
				- 自我反思机制（Self-Reflection）
				- 使用 Prompt 引导模型评估自身输出质量
				- Agent 自动生成（AutoAgent）
				- 基于用户需求自动组合工具与角色
						- 动态生成 DSL 流程并执行
	- 实践练习：
		- 项目一：构建一个具备短期+长期记忆、多模态输入、移动端推理、自我反思能力的智能 Agent
			- 输入输出定义：
				- 输入：文本、图像、语音、GUI 截图
						- 输出：自然语言回答、执行动作、可视化日志
				- 核心功能：
				- 支持图像上传并识别内容
						- 支持语音转文字并理解意图
						- 支持移动端本地推理
						- 支持记忆读写与自我反思
		- 项目二：支持图像识别、语音输入、本地部署、远程监控与调试
			- 场景设定：
				- 用户上传发票图片，Agent 识别金额、日期、公司名称
						- 用户语音提问：“这张发票金额是多少？”
						- Agent 返回解析结果并记录到长期记忆库
						- 支持远程查看日志、下载模型、更新配置
				- 技术难点：
				- 如何实现跨平台一致性？
						- 如何保证隐私安全（不上传原始数据）？
						- 如何远程管理多个设备上的 Agent？
- ## 模块八模型部署与服务化
	- 详细内容：
		- Docker 入门与镜像构建
		- Kubernetes 编排基础（Pod、Deployment、Service）
		- Kubernetes 高级配置（HPA、滚动更新、金丝雀发布）
		- 模型服务化部署（FastAPI + Uvicorn + Gunicorn）
		- 模型压缩与量化（OpenVINO、TensorRT、ONNX）
		- 分布式推理服务设计（Ray Serve、Triton Inference Server）
		- Prometheus + Grafana 监控系统搭建
		- 日志收集与异常检测（ELK Stack + Fluentd）
		- A/B 测试与灰度发布（Traefik + Istio）
	- 实践练习：
		- 实践一：将意图识别模型打包成容器并在 K8s 中部署
		- 实践二：将一个大模型服务部署到 K8s 集群，支持自动扩缩容与流量控制
			- 场景设定：
				- 部署 LLaMA 或 ChatGLM 模型
						- 使用 Ray Serve/Triton 加速推理
						- 配置 Istio 实现 A/B 测试和灰度发布
				- 技术难点：
				- 如何降低模型延迟？
						- 如何防止资源耗尽？
						- 如何实现无缝升级？
- ## 模块九Python 高性能编程与并发工程
	- 详细内容：
		- 异步 I/O 底层原理（event loop、async/await）
		- 异步编程（asyncio、aiohttp）
		- 多线程与多进程（concurrent.futures、multiprocessing）
		- 多进程通信与共享内存（multiprocessing.Value, Manager）
		- 使用 Pydantic 进行数据校验
		- GIL 影响分析与规避策略
		- 线程池与协程池性能对比
		- 使用 Py-Spy / cProfile 定位性能瓶颈
		- FastAPI 性能调优（连接池、限流、缓存中间件）
		- RESTful API 开发（FastAPI / Flask）
		- WebSocket 与 gRPC 实战
		- 单元测试与自动化测试（pytest）
		- 性能分析与优化技巧
		- 底层性能优化 （CUDA 编程基础、TensorRT 加速原理）
	- 实践练习：
		- 项目一：实现一个支持并发的 HTTP+WebSocket 混合通信服务
			- 输入输出定义：
				- HTTP 接口：接收用户输入并返回结果
						- WebSocket 接口：实时推送状态更新
				- 技术难点：
				- 如何协调 HTTP 与 WebSocket 的消息传递？
						- 如何防止并发冲突？
						- 如何实现异步事件通知？
		- 项目二：实现一个支持高并发、限流、缓存和日志追踪的聊天代理服务（每秒处理 1000+请求）
			- 场景设定：
				- 用户通过 HTTP 或 WebSocket 提问
						- 服务调用 LLM 并缓存结果
						- 支持限流、错误重试、日志追踪
				- 技术难点：
				- 如何设计缓存结构？
						- 如何保证高并发下稳定性？
						- 如何实现请求追踪 ID？
		- 项目三：“基于 CUDA 加速的向量相似度计算优化”，提升 RAG 检索速度
			- 场景设定：
				- 在 FAISS 中使用 GPU 加速近似最近邻搜索
						- 对比 CPU 与 GPU 的性能差异
				- 技术难点：
				- 如何配置 FAISS 的 GPU 环境？
						- 如何评估加速效果？
						- 如何封装为可复用的组件？
- ## 模块十项目实战 —— 工程化企业级智能客服平台
	- 详细内容：
		- 支持多租户架构（不同客户/品牌）
		- 高并发接入（Web、微信、App、第三方接口）
		- 插件化设计（支持快速扩展新业务）
		- 可扩展的对话引擎（支持意图识别 + RAG + Agent）
		- 支持多模型切换（GPT、LLaMA、ChatGLM 等）
		- 支持知识库热更新、模型热加载
		- 高可用后台服务（Docker、Kubernetes）
		- 提供可视化后台（知识库管理、对话记录、监控面板）
		- 支持灰度发布、A/B 测试、异常报警机制
		- 支持自定义知识库更新和模型迭代
	- 项目：
		- 提交一份完整的 Agent 平台源码包（含 Web 后台 + 移动 App + 多 Agent 系统 + DSL 引擎）
		- 文档：
			- 架构设计
				- 部署说明
				- API 文档
				- DSL 规范
				- 性能报告
		- 演示视频：
			- 展示多 Agent 协作
				- 任务编排
				- 移动端推理等核心功能
- ## 模块十一行业场景与产品设计
	- 详细内容：
		- AI 产品设计方法论
			- 需求分析阶段
				- 如何发现用户痛点？
						- 如何从业务流程中识别 AI 可介入环节？
						- 用户画像构建与场景建模
				- 原型设计阶段
				- 使用 Figma / Axure 制作产品原型图
						- 构建最小可行产品（MVP）思路
						- 设计 AI 对话流程图（DSL 或状态机）
				- 用户反馈迭代
				- A/B 测试设计
						- 用户满意度调查
						- 日志回放 + 人工审核机制
		- 垂直领域经验积累
			- 医疗领域
				- 医疗文本 NER（命名实体识别）：
					- 提取疾病名、药品名、症状、检查项等
						- 医疗问答系统：
					- 基于 RAG 的常见病解答 Agent
						- 医疗术语标准化（ICD 编码映射）
				- 金融领域
				- 风控指标解析：
					- 用户信用评分、逾期率、负债比等
						- 自动报告生成：
					- 基于财报内容自动生成摘要
						- 合规性生成：
					- 自动生成合同条款、风险提示语句
				- 法律领域
				- 法条检索与匹配：
					- 用户输入问题 → 匹配相关法律条文
						- 合同审查辅助：
					- 标记合同中的高风险条款
						- 案例推荐：
					- 相似案例推荐 + 判决结果预测
		- AI 伦理与法规合规
			- 数据隐私保护
				- GDPR、CCPA、《个人信息保护法》解读
						- 数据脱敏与匿名化技术（k-匿名、差分隐私）
						- 敏感信息过滤（PII Detection）
				- AI 偏见与公平性
				- 检测算法偏见的方法（Fairness Indicators）
						- 公平性评估指标（Demographic Parity、Equal Opportunity）
						- 模型去偏策略（Reweighting、Adversarial Debiasing）
	- 实践练习 ：
		- 项目一：在工程化企业级智能客服平台基础上增加“法律咨询 Agent 开发”
			- 场景设定：
				- 用户输入法律问题（如“离婚财产如何分割？”）
						- 系统自动检索相关法条、类案、司法解释
						- LLM 生成解释性回答并提供参考建议
				- 技术难点：
				- 如何构建法律知识库？
						- 如何实现法条+案例+生成一体化？
						- 如何保证输出的合规性？
		- 项目二：阿里云百炼平台实践案例
			- 场景设定：
				- 在阿里云百炼平台上部署一个客服 Agent
						- 配置 RAG 知识库、多轮对话流程、意图识别引擎
						- 实现日志追踪、A/B 测试、灰度发布
				- 技术难点：
				- 如何接入百炼 API？
						- 如何配置模型参数与 Prompt？
						- 如何进行性能调优与成本控制？
		- 项目三：HuggingFace 平台实践
			- 场景设定：
				- 使用 HuggingFace Spaces 部署一个聊天机器人
						- 使用 Transformers Pipeline 快速部署推理服务
						- 使用 Gradio 构建可视化界面
				- 技术难点：
				- 如何上传模型到 Model Hub？
						- 如何使用 Inference API？
						- 如何优化加载速度与响应时间？

领取完整课程安排

讲师介绍

![](https://static001.geekbang.org/resource/image/28/aa/28e3050bb4b5cdf93f608be834df32aa.png)

口碑讲师，学员认证

![](https://static001.geekbang.org/resource/image/e2/da/e2bb5ec862a86fe42df4a2c0f340aeda.png)

适合人群

![](https://static001.geekbang.org/resource/image/90/b0/90482e75f9bfaef445b1a9d01ee241b0.png)

全方位学习服务，让你学会并学有所成

![](https://static001.geekbang.org/resource/image/1d/9d/1dcbc5fddb0c2e9244166b55471ec99d.png)

AI 大模型全套学习资料免费领

![](https://static001.geekbang.org/resource/image/f1/f0/f12242361yy115807yy6323d7fa127f0.png)

戳此领取

帮助与常见问题

Q：是否有基础要求？

需要有 Python 后端开发基础以及大模型基础知识储备。

Q：课程学完后能达到什么水平？

认真学完本课程之后，可以掌握主流大模型开发框架的使用方法，高级 Agent 开发进阶技能，以及具备面向生产 RAG 系统以及多Agent协同平台开发能力，并且掌握企业内部落地大模型项目所需要面临的工程化相关的技术，比如高并发、异步编程、云原生部署、监控、运维、数据清洗和预处理、架构设计等等周边技能，能够进行企业 AI 工程化项目的开发。

Q：是否有详细的课程表？

有的哦，可以通过点击页面按钮，添加学习顾问进行详细了解。

Q：上课形式和课时量是怎样的呢？

课程是 16 周的录播课程。

Q：直播是否有回看？

直播的录播视频会上传到学习平台方便大家回看，但为了更好的学习互动效果，建议各位学员提前预留好时间，准备好问题，准时参加直播。

Q：课程视频的观看期限是多久？

本期课程视频永久有效，其中包含“学期”和“观看期”。 学期：指我们为大家提供学习服务的时间，也就是开课之日起 16 周的时间。在此期间，学员可以观看课程视频，并享受相应的学习服务，比如助教答疑等。 观看期：是指服务期结束之后的时间。观看期，课程视频永久有效。在此期间，学员可随时观看课程视频，但不再享受学习服务。

Q：可以跟老师互动交流吗?

当然啦，我们会建立班级社群，群内可以互动交流。同时，大家还可以通过直播向老师提问。

Q：报名缴费后可以退款吗？

开课后 7 个自然日内，如果觉得课程不适合自己，可无条件申请退款，超出 7 个自然日，就不再办理退款啦。退款流程预计为 10-15 个工作日。

Q：可以分期付款吗？

我们支持花呗分期付款。

Q: 如何开发票，签合同？

我们可以为学员开具正规的发票和合同。开发票相关事宜，请联系带班班主任。合同相关事宜，请联系报名老师。

Q：这个训练营是由哪个培训机构来运营的？机构性质是什么？

极客时间训练营的运营机构为极客邦控股（北京）有限公司，机构性质为营利法人（有限责任公司）。

Q：价格说明

划线价为商品或服务的参考价，并非原价，该价格仅供参考。未划线价格为商品或服务的实时标价，具体成交价格根据商品或服务参加优惠活动，或使用优惠券、礼券、赠币等不同情形发生变化，最终实际成交价格以订单结算页价格为准。

收起

** 微信咨询

![](https://static001.geekbang.org/resource/image/06/c1/06b701d2bd124c458728c0f778abbfc1.png)

** 在线咨询

** 电话咨询

##### 联系电话：13372878317

** 微信联系我们 ![](https://static001.geekbang.org/resource/image/06/c1/06b701d2bd124c458728c0f778abbfc1.png)