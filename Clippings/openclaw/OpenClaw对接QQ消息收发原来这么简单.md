
**简介：讲解OpenClaw对接QQ消息收**

- 进入QQ开放平台，扫码登录
    
    - [https://q.qq.com/qqbot/openclaw/index.html](https://q.qq.com/qqbot/openclaw/index.html)
- 点击创建机器人，立即分配对应ID
![[Pasted image 20260609001139.png]]
同时QQ客户端可收到机器人的消息
![[Pasted image 20260609001224.png]]
根据官方原生接入流程操作

- 安装OpenClaw开源社区QQBot插件
    
    openclaw plugins install @tencent-connect/openclaw-qqbot@latest
    
- 配置绑定当前QQ机器人信息
    
    openclaw channels add --channel qqbot --token "1903575858:dGk7LRJyPcgkcHiv"
    
- 重启本地OpenClaw服务
    
    openclaw gateway restart
![[Pasted image 20260609001612.png]]

![[Pasted image 20260609001732.png]]

![[Pasted image 20260609002237.png]]