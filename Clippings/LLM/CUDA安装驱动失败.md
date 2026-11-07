---
title: "CUDA安装驱动失败"
source: "https://chatgpt.com/c/6a058743-a508-83ea-95ef-f64bfffec456"
author:
  - "thomas"
published:
created: 2026-05-14
description: "ChatGPT conversation with 8 messages"
tags:
  - "llm"
---
(base) thomas@thomas-liu:~/Downloads$ sudo sh cuda\_13.2.0\_595.45.04\_linux.run -m=kernel-open \[sudo: authenticate\] Password: Installation failed. See log at /var/log/cuda-installer.log for details. (base) thomas@thomas-liu:~/Downloads$ cat /var/log/cuda-installer.log \[INFO\]: Adding driver option -m=kernel-open \[INFO\]: Driver not installed. \[INFO\]: Checking compiler version... \[INFO\]: gcc location: /usr/bin/gcc \[INFO\]: gcc version: gcc version 15.2.0 (Ubuntu 15.2.0-4ubuntu4) \[INFO\]: Initializing menu \[INFO\]: nvidia-fs.setKOVersion(2.28.2) \[INFO\]: Setup complete \[INFO\]: Installing: Driver \[INFO\]: Installing: 595.45.04 \[INFO\]: Executing NVIDIA-Linux-x86\_64-595.45.04.run --ui=none --no-questions --accept-license --disable-nouveau --no-cc-version-check --install-libglvnd --kernel-module-type=open 2>&1 \[INFO\]: Finished with code: 256 \[ERROR\]: Install of driver component failed. Consult the driver log at /var/log/nvidia-installer.log for more details. \[ERROR\]: Install of 595.45.04 failed, quitting

---

从日志看，真正失败的是 NVIDIA 驱动安装阶段，而不是 CUDA Toolkit 本身：

```bash
[ERROR]: Install of driver component failed.
Consult the driver log at /var/log/nvidia-installer.log
```

你现在需要先看：

```bash
cat /var/log/nvidia-installer.log
```

不过根据你当前环境，我已经能看出一个高概率问题：

你系统是：

```bash
gcc version 15.2.0
```

而 NVIDIA 595 系列驱动（包括 CUDA 13.2 自带驱动）目前通常还不兼容 GCC 15。

这类情况会在 `nvidia-installer.log` 里出现类似：

- unsupported gcc version
- compilation failed
- kernel module build failed
- implicit declaration
- incompatible pointer type

之类的编译错误。

---

建议你按下面流程处理。

---

执行：

```bash
uname -r
```

以及：

```bash
ubuntu-drivers devices
```

再看：

```bash
nvidia-smi
```

如果已经装过旧驱动，也可能冲突。

---

## 二、Ubuntu 上不要优先用.run

你现在用的是：

```bash
cuda_13.2.0_595.45.04_linux.run
```

这种 runfile 安装方式：

- 容易和 apt 驱动冲突
- DKMS 管理差
- 内核升级后容易炸
- Ubuntu 24.10/25.xx + gcc15 更容易失败

Ubuntu 最稳定的方法通常是：

- 用 apt 装 NVIDIA Driver
- 再单独装 CUDA Toolkit

---

## 三、最可能的解决方案（推荐）

## 方案 A：只安装 CUDA Toolkit，不装驱动

如果系统已经有驱动：

```bash
nvidia-smi
```

能正常输出。

那么直接：

```bash
sudo sh cuda_13.2.0_595.45.04_linux.run --toolkit --no-drm
```

不要安装 bundled driver。

---

## 四、如果必须装 595 驱动

你需要降 gcc。

## 安装 gcc-13

Ubuntu：

```bash
sudo apt update

sudo apt install gcc-13 g++-13
```

然后：

```bash
export CC=/usr/bin/gcc-13
export CXX=/usr/bin/g++-13
```

再安装：

```bash
sudo sh cuda_13.2.0_595.45.04_linux.run -m=kernel-open
```

---

## 五、更推荐的方式（非常建议）

直接用 Ubuntu 官方驱动：

```bash
sudo ubuntu-drivers autoinstall
```

或者：

```bash
sudo apt install nvidia-driver-570
```

然后验证：

```bash
nvidia-smi
```

之后再安装 toolkit：

```bash
sudo sh cuda_13.2.0_595.45.04_linux.run --toolkit
```

这样稳定很多。

---

## 六、还要检查 kernel headers

很多驱动安装失败是因为缺：

```bash
sudo apt install build-essential dkms linux-headers-$(uname -r)
```

---

## 七、Secure Boot 也可能导致失败

检查：

```bash
mokutil --sb-state
```

如果是：

```
SecureBoot enabled
```

那么：

- 要么 BIOS 关闭 Secure Boot
- 要么给 NVIDIA module 签名

否则模块会编译成功但加载失败。

---

## 八、-m=kernel-open 不一定适合所有卡

open kernel module 主要针对较新的 GPU：

- Turing+
- Ampere
- Ada
- Hopper

老卡可能不稳定。

可以先不用：

```bash
sudo sh cuda_13.2.0_595.45.04_linux.run
```

---

你下一步最好直接发：

```bash
cat /var/log/nvidia-installer.log | tail -100
```

我可以直接帮你定位具体报错。

---

你的环境其实已经很明确了：

GPU 是：NVIDIA GeForce RTX 2080 Ti

Ubuntu 推荐驱动是：

```
nvidia-driver-595-open   (recommended)
```

说明：

- 你的卡支持 open kernel module
- 不需要用 `.run` 安装
- 直接 apt 安装最稳

你现在的问题大概率不是 GPU 不支持，而是：

- `.run` 安装方式
- GCC 15
- Secure Boot
- DKMS 编译环境

其中之一。

---

建议你彻底换成 Ubuntu 官方方式。

## 推荐安装方案（稳定）

## 1\. 清理 runfile 安装残留

先卸载：

```bash
sudo /usr/bin/nvidia-uninstall
```

如果没有：

```bash
sudo sh cuda_13.2.0_595.45.04_linux.run --uninstall
```

然后清理：

```bash
sudo apt purge 'nvidia*'
sudo apt autoremove --purge
```

重启：

```bash
sudo reboot
```

---

## 2\. 安装依赖

```bash
sudo apt update

sudo apt install -y \
    build-essential \
    dkms \
    linux-headers-$(uname -r)
```

---

## 3\. 检查 Secure Boot（非常重要）

执行：

```bash
mokutil --sb-state
```

如果输出：

```
SecureBoot enabled
```

你需要：

- BIOS 关闭 Secure Boot

否则 NVIDIA 模块经常装完不能加载。

2080Ti + Ubuntu 上这是高频坑。

---

## 4\. 安装官方驱动（推荐）

直接：

```bash
sudo apt install nvidia-driver-595-open
```

或者：

```bash
sudo ubuntu-drivers autoinstall
```

然后：

```bash
sudo reboot
```

---

## 5\. 验证驱动

重启后：

```bash
nvidia-smi
```

正常应该看到：

- Driver Version: 595.xx
- RTX 2080 Ti

如果这里正常，说明驱动已经 OK。

---

## 6\. 再装 CUDA Toolkit（不要装驱动）

这一步很关键。

不要再装 bundled driver：

```bash
sudo sh cuda_13.2.0_595.45.04_linux.run --toolkit
```

只安装 toolkit。

---

## 为什么我不建议.run

你当前是：

- Ubuntu 新版
- GCC 15
- 新 DKMS
- open kernel module

这些和 NVIDIA runfile 兼容性一直一般。

而 apt 包：

- Canonical 已经处理过 DKMS
- 自动适配 gcc
- 自动处理 initramfs
- 自动处理 kernel updates

稳定性高很多。

---

如果你愿意，我还可以继续帮你：

- 判断你是不是 Ubuntu 25.xx（gcc15 很像）
- 给你最稳 CUDA 13.2 安装方案
- 配置 cuDNN
- 配置 PyTorch/TensorFlow CUDA
- 避免 apt 和 runfile 冲突
- 解决 `nvidia-smi` / `nvcc` 不一致问题
- 配置多 CUDA 版本共存（12.x + 13.x）

---

驱动已经安装成功，我希望不用run文件安装CUDA Toolkit

---

既然驱动已经正常安装成功，那就不要再用 `.run` 文件了，直接用 NVIDIA 官方 apt 仓库安装 CUDA Toolkit，这是 Ubuntu 上最稳的方案。

你现在可以这样做。

---

## 1\. 先确认驱动正常

执行：

```bash
nvidia-smi
```

如果能看到：

- RTX 2080 Ti
- Driver 595.xx

说明驱动已经没问题。

---

## 2\. 删除之前下载的 runfile（可选）

避免以后误装：

```bash
rm ~/Downloads/cuda_13.2.0_595.45.04_linux.run
```

---

## 3\. 添加 CUDA 官方仓库

先安装 keyring。

Ubuntu x86\_64：

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
```

然后：

```bash
sudo dpkg -i cuda-keyring_1.1-1_all.deb
```

更新源：

```bash
sudo apt update
```

---

## 4\. 安装 CUDA Toolkit（不安装驱动）

只装 toolkit：

```bash
sudo apt install cuda-toolkit-13-2
```

这个不会覆盖你当前驱动。

---

## 5\. 配置环境变量

编辑：

```bash
nano ~/.bashrc
```

追加：

```bash
export PATH=/usr/local/cuda-13.2/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-13.2/lib64:$LD_LIBRARY_PATH
```

生效：

```bash
source ~/.bashrc
```

---

## 6\. 验证 CUDA

查看 nvcc：

```bash
nvcc -V
```

应该看到：

```
Cuda compilation tools, release 13.2
```

再验证：

```bash
nvidia-smi
```

---

## 7\. 验证 CUDA Runtime

执行：

```bash
/usr/local/cuda-13.2/extras/demo_suite/deviceQuery
```

如果输出：

```
Result = PASS
```

说明 CUDA 完全正常。

---

## Ubuntu 24.04 / 25.xx 注意事项

你现在 GCC 是 15：

```
gcc 15.2
```

CUDA 13.2 对 GCC 15 支持还不完全稳定。

建议额外装：

```bash
sudo apt install gcc-13 g++-13
```

然后给 CUDA 编译时指定：

```bash
export CC=gcc-13
export CXX=g++-13
```

否则后面编译 PyTorch CUDA Extension、xformers、flash-attn 时容易炸。

---

## 推荐版本搭配（你这张 2080Ti）

你的 NVIDIA GeForce RTX 2080 Ti 最稳组合通常是：

| 组件 | 推荐 |
| --- | --- |
| Driver | 595-open |
| CUDA | 12.8 / 13.2 |
| GCC | 13 |
| Ubuntu | 24.04 |

---

## 额外建议

如果你主要跑：

- PyTorch
- TensorFlow
- vLLM
- Ollama
- llama.cpp

其实很多时候：

CUDA 12.8 会比 13.2 兼容性更好。

因为目前很多 AI 框架还没完全适配 CUDA 13.x。

---

(base) thomas@thomas-liu:~/Downloads$ sudo apt install gcc-13 g++-13 Installing: g++-13 gcc-13 Installing dependencies: cpp-13 cpp-13-x86-64-linux-gnu g++-13-x86-64-linux-gnu gcc-13-base gcc-13-x86-64-linux-gnu libgcc-13-dev libstdc++-13-dev Suggested packages: gcc-13-locales cpp-13-doc g++-13-multilib gcc-13-doc gcc-13-multilib libstdc++-13-doc Summary: Upgrading: 0, Installing: 9, Removing: 0, Not Upgrading: 15 Download size: 50.0 MB Space needed: 171 MB / 887 GB available Continue? \[Y/n\] y Get:1 http://mirrors.tuna.tsinghua.edu.cn/ubuntu questing/universe amd64 gcc-13-base amd64 13.4.0-4ubuntu1 \[54.7 kB\] Get:2 http://mirrors.tuna.tsinghua.edu.cn/ubuntu questing/universe amd64 cpp-13-x86-64-linux-gnu amd64 13.4.0-4ubuntu1 \[10.7 MB\] Get:3 http://mirrors.tuna.tsinghua.edu.cn/ubuntu questing/universe amd64 cpp-13 amd64 13.4.0-4ubuntu1 \[1,028 B\] Get:4 http://mirrors.tuna.tsinghua.edu.cn/ubuntu questing/universe amd64 libgcc-13-dev amd64 13.4.0-4ubuntu1 \[2,669 kB\] Get:5 http://mirrors.tuna.tsinghua.edu.cn/ubuntu questing/universe amd64 gcc-13-x86-64-linux-gnu amd64 13.4.0-4ubuntu1 \[21.1 MB\] Get:6 http://cn.archive.ubuntu.com/ubuntu questing/universe amd64 libstdc++-13-dev amd64 13.4.0-4ubuntu1 \[2,749 kB\] Get:7 http://cn.archive.ubuntu.com/ubuntu questing/universe amd64 g++-13-x86-64-linux-gnu amd64 13.4.0-4ubuntu1 \[12.2 MB\] Get:8 http://mirrors.tuna.tsinghua.edu.cn/ubuntu questing/universe amd64 gcc-13 amd64 13.4.0-4ubuntu1 \[512 kB\] Get:9 http://cn.archive.ubuntu.com/ubuntu questing/universe amd64 g++-13 amd64 13.4.0-4ubuntu1 \[19.5 kB\] Fetched 50.0 MB in 6s (8,312 kB/s) Selecting previously unselected package gcc-13-base:amd64. (Reading database... 227743 files and directories currently installed.) Preparing to unpack.../0-gcc-13-base\_13.4.0-4ubuntu1\_amd64.deb... Unpacking gcc-13-base:amd64 (13.4.0-4ubuntu1)... Selecting previously unselected package cpp-13-x86-64-linux-gnu. Preparing to unpack.../1-cpp-13-x86-64-linux-gnu\_13.4.0-4ubuntu1\_amd64.deb... Unpacking cpp-13-x86-64-linux-gnu (13.4.0-4ubuntu1)... Selecting previously unselected package cpp-13. Preparing to unpack.../2-cpp-13\_13.4.0-4ubuntu1\_amd64.deb... Unpacking cpp-13 (13.4.0-4ubuntu1)... Selecting previously unselected package libgcc-13-dev:amd64. Preparing to unpack.../3-libgcc-13-dev\_13.4.0-4ubuntu1\_amd64.deb... Unpacking libgcc-13-dev:amd64 (13.4.0-4ubuntu1)... Selecting previously unselected package gcc-13-x86-64-linux-gnu. Preparing to unpack.../4-gcc-13-x86-64-linux-gnu\_13.4.0-4ubuntu1\_amd64.deb... Unpacking gcc-13-x86-64-linux-gnu (13.4.0-4ubuntu1)... Selecting previously unselected package libstdc++-13-dev:amd64. Preparing to unpack.../5-libstdc++-13-dev\_13.4.0-4ubuntu1\_amd64.deb... Unpacking libstdc++-13-dev:amd64 (13.4.0-4ubuntu1)... Selecting previously unselected package g++-13-x86-64-linux-gnu. Preparing to unpack.../6-g++-13-x86-64-linux-gnu\_13.4.0-4ubuntu1\_amd64.deb... Unpacking g++-13-x86-64-linux-gnu (13.4.0-4ubuntu1)... Selecting previously unselected package gcc-13. Preparing to unpack.../7-gcc-13\_13.4.0-4ubuntu1\_amd64.deb... Unpacking gcc-13 (13.4.0-4ubuntu1)... Selecting previously unselected package g++-13. Preparing to unpack.../8-g++-13\_13.4.0-4ubuntu1\_amd64.deb... Unpacking g++-13 (13.4.0-4ubuntu1)... Setting up gcc-13-base:amd64 (13.4.0-4ubuntu1)... Setting up libgcc-13-dev:amd64 (13.4.0-4ubuntu1)... Setting up libstdc++-13-dev:amd64 (13.4.0-4ubuntu1)... Setting up cpp-13-x86-64-linux-gnu (13.4.0-4ubuntu1)... Setting up gcc-13-x86-64-linux-gnu (13.4.0-4ubuntu1)... Setting up g++-13-x86-64-linux-gnu (13.4.0-4ubuntu1)... Setting up cpp-13 (13.4.0-4ubuntu1)... Setting up gcc-13 (13.4.0-4ubuntu1)... Setting up g++-13 (13.4.0-4ubuntu1)... Processing triggers for man-db (2.13.1-1)... (base) thomas@thomas-liu:~/Downloads$ export CC=gcc-13 (base) thomas@thomas-liu:~/Downloads$ export CXX=g++-13 (base) thomas@thomas-liu:~/Downloads$ (base) thomas@thomas-liu:~/Downloads$ (base) thomas@thomas-liu:~/Downloads$ gcc --version gcc (Ubuntu 15.2.0-4ubuntu4) 15.2.0 Copyright (C) 2025 Free Software Foundation, Inc. This is free software; see the source for copying conditions. There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. (base) thomas@thomas-liu:~/Downloads$ CC --version CC: command not found 现在的gcc 版本为15.2 希望降级为13

---

你这里有一个常见误区：

```bash
export CC=gcc-13
export CXX=g++-13
```

这只是：

- 给编译系统指定默认 C/C++ 编译器
- 对 `make` / `cmake` / CUDA 编译生效

并不会修改系统默认 `gcc` 。

所以：

```bash
gcc --version
```

还是会显示：

```
gcc 15.2.0
```

这是正常的。

---

## 你现在有两种方案

## 方案 1（推荐）

保持系统 gcc15 不动。

只让 CUDA 编译使用 gcc13：

```bash
export CC=/usr/bin/gcc-13
export CXX=/usr/bin/g++-13
```

然后：

```bash
nvcc --version
```

或者编译 CUDA 项目时：

```bash
make
```

它会自动使用 gcc13。

这是最安全方案。

Ubuntu 25.xx 本身很多组件依赖 gcc15，  
强行降默认 gcc 可能导致系统包编译异常。

---

## 方案 2（你现在想要的）

真正把系统默认 gcc 切换到 13。

用 `update-alternatives` 。

---

## 1\. 注册 gcc-13

执行：

```bash
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-13 130
```

注册 g++：

```bash
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-13 130
```

---

## 2\. 选择默认版本

执行：

```bash
sudo update-alternatives --config gcc
```

你会看到：

```
There are 2 choices for the alternative gcc

Selection    Path
-----------------------------------------------
0            /usr/bin/gcc-15
1            /usr/bin/gcc-13
2            /usr/bin/gcc-15
```

输入：

```
1
```

然后：

```bash
sudo update-alternatives --config g++
```

也选 gcc-13 对应项。

---

## 3\. 验证

现在：

```bash
gcc --version
```

应该就是：

```
gcc (Ubuntu 13.4.0)
```

---

## 额外建议（重要）

你是 Ubuntu Questing（25.xx）：

```
questing
```

这是非常新的发行版。

很多 CUDA / PyTorch / TensorRT 生态还没完全适配：

所以：

## 最稳方案是：

- 系统默认保持 gcc15
- CUDA 编译使用 gcc13

即：

```bash
export CC=/usr/bin/gcc-13
export CXX=/usr/bin/g++-13
```

这是 NVIDIA 官方也常用的方法。

---

## 你刚才那个命令为什么报错

你输入：

```bash
CC --version
```

但：

```bash
CC
```

不是命令。

它只是环境变量名。

正确查看：

```bash
echo $CC
```

会输出：

```
/usr/bin/gcc-13
```

同理：

```bash
echo $CXX
```

---

## CUDA 编译时如何确认用的是 gcc13

执行：

```bash
nvcc -V
```

再：

```bash
which gcc
```

或者编译一个 sample：

```bash
nvcc test.cu -v
```

日志里会看到：

```
gcc-13
```

即可。