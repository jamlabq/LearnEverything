# WLAN 视频与文字选读清单

整理日期：2026-11-20。共 18 组视频与 21 篇文字选读。系列按组收录，子标题写在观看重点中。中文导读由本项目整理，不是原作者的逐字引文。

## 怎么用

先按网页的五阶段路线学习，再按问题补充。每份材料都有重点、停止位置和检查问题；无需通读 IEEE 标准或整本 PySDR。时间是建议安排，不是经过计时的视频长度。

## 搜索和核验方式

- 从 Bootlin 站内 Wi-Fi 搜索定位 ELCE 2025 官方回顾文章，核对讲者、视频嵌入地址与 PDF 讲义，并下载提取讲义确认选读页。
- 从 openwifi 官方 README 进入 `doc/videos.md`，确认 FOSDEM 2020/2021 与 LibrePlanet 2021 的报告入口。
- 使用 YouTube 主题检索，核对 Wireless Explained 两集、Moving Parts 同名动画、Waveform Academy 两集和 Direct Conversion 单集的标题/频道。搜索结果核验不等于完整观看或保证各地区播放可用。
- 从 Linux Wireless 开发者文档目录、PySDR 中文目录、ShareTechnote 和项目 README 按主题查找文字材料，访问落地页并核对正文/章节。下方表格记录状态和实际页面标题；同页不同选读范围分别列为资料。
- Google 返回跳转页、DuckDuckGo 返回验证页，部分 Bing 查询没有结果，因此改用站内搜索、官方目录和平台结果。B站检索触发验证码，未确认 ID 的条目使用清楚标注的 B站搜索入口。

## 对原清单的修正

1. `OFDM Tutorial Series: Direct Conversion` 的同名 YouTube 结果来自 **Silicon DSP Corporation**，并非原清单所写的 R&S。页面保留 R&S 相关主题搜索作为补充。
2. `How Wi-Fi Actually Works (Animated)` 的同名结果来自 **Moving Parts**。不沿用未经核实的约 5 分钟时长。
3. Branch Education 的两个原标题尚未确认准确对应，保留为搜索条目；部分中文视频标题、作者来自用户原清单，页面明确标识来源待核实。
4. PySDR 的中文入口是 `zh/index-zh.html`，中文章节位于 `zh/content-zh/`。若使用某些旧路径，会返回 HTTP 200 的英文首页，不能据状态码判断章节有效。
5. 中文选读到具体小节；同步章节使用英文版。字幕、整段视频内容和当前可播放性没有统一核验。

## 视频（18 组）

### 1. 一次把 WiFi 原理、WiFi 芯片和开源芯片 openwifi 说透！

来源：知乎纸飞机 · 原清单推荐 · 中文 · 核心推荐

把 Linux 驱动、MAC、FPGA 基带和射频前端放到同一张地图上。适合作为整条学习路线的主线。

- [B站搜索](https://search.bilibili.com/all?keyword=%E7%9F%A5%E4%B9%8E%E7%BA%B8%E9%A3%9E%E6%9C%BA%20%E4%B8%80%E6%AC%A1%E6%8A%8AWiFi%E5%8E%9F%E7%90%86%20WiFi%E8%8A%AF%E7%89%87%20openwifi%20%E8%AF%B4%E9%80%8F)（搜索入口，非视频直达）
- [项目视频目录](https://github.com/open-sdr/openwifi/blob/master/doc/videos.md)

重点：先找软硬件架构图，分清 mac80211、Low-MAC、OFDM PHY 和射频芯片各自接收什么、输出什么。

停止位置：第一遍能复述四个模块的分工即可；队列、退避和调制细节留到相应阶段回看。

检查理解：为什么有了 Linux 驱动，还需要 FPGA 基带和射频芯片？

来源说明：保留原清单标题；尚未确认该标题对应的 B站视频 ID。项目目录已核验。

### 2. openwifi 在 LibrePlanet 2021 的报告

来源：openwifi · 焦先军 · 英文

从开放硬件的角度认识一颗 Wi-Fi 芯片。搭配项目架构图，建立软件、FPGA 与射频的边界感。

- [项目收录的报告入口](https://www.zhihu.com/zvideo/1373649688906883072)
- [B站搜索](https://search.bilibili.com/all?keyword=%E6%83%B3%E7%9F%A5%E9%81%93WiFi%E5%92%8CWiFi%E8%8A%AF%E7%89%87%E5%8E%9F%E7%90%86%20%E9%80%9F%E7%9C%8Bopenwifi%20libreplanet2021)（搜索入口，非视频直达）

重点：关注为什么开放基带，以及项目如何兼容现有 Linux 无线工具。

停止位置：先看系统介绍；开源生态与项目历史可按兴趣跳过。

检查理解：openwifi 开放了商用网卡中哪些通常不可见的部分？

来源说明：报告入口来自项目官方视频目录；B站字幕版本使用搜索入口，字幕情况未核验。

### 3. Introducing openwifi / Open-source Wi-Fi chip design

来源：openwifi · FOSDEM 2020 / 2021 · 英文 · 核心推荐

会议演讲把 Linux 网络接口、FPGA Low-MAC、OFDM 与 SDR 硬件连接起来，是贯通软硬件的具体案例。

- [YouTube 直达](https://www.youtube.com/watch?v=Mq48cGthk7M)
- [FOSDEM 2021 录像](https://video.fosdem.org/2021/D.radio/fsr_openwifi_opensource_wifi_chip.webm)
- [官方视频目录](https://github.com/open-sdr/openwifi/blob/master/doc/videos.md)

重点：从系统框图跟踪数据的形态变化；观察普通 Wi-Fi 设备如何与 openwifi 互通。

停止位置：第一轮只追踪发送链路；第二轮再看硬件实现和实时性。

检查理解：微秒级 ACK 响应适合交给普通用户态程序吗？

来源说明：两个录像链接均由 openwifi 官方项目目录提供。

### 4. Unpacking the Linux WiFi Stack

来源：Alexis Lothoré · Bootlin · ELCE 2025 · 英文 · 核心推荐

拆开 nl80211、cfg80211、mac80211 和驱动的关系，理解设备注册、收发、用户态工具及调试。

- [YouTube 直达](https://www.youtube.com/watch?v=8j25k4iH0oM)
- [Bootlin 官方介绍](https://bootlin.com/blog/back-from-open-source-summit-europe-2025-talks-from-bootlin/)

重点：先看 802.11 basics 和 Linux wireless stack，再看发送流程。配合讲义对照控制路径与数据路径。

停止位置：初学可先跳过驱动结构体字段、法规回调和调试实现细节。

检查理解：FullMAC 和 SoftMAC 驱动为什么接入内核的位置不同？

来源说明：标题、讲者、录像与配套讲义已通过 Bootlin 官方文章确认。

### 5. OFDM Explained Visually in a New Perspective!

来源：Wireless Explained · 英文 · 核心推荐

用视觉模型理解子载波、相位与正交性，先建立频域和时域之间的直觉。

- [YouTube 直达](https://www.youtube.com/watch?v=87VaKVnVDsc)

重点：抓住子载波间隔与有效符号时长的关系 Δf = 1/Tu，以及“频谱重叠仍能分离”的条件。

停止位置：先理解正交性的画面，不必一次推完所有公式。

检查理解：为什么 OFDM 子载波频谱重叠，却可以在理想条件下分离？

来源说明：已核对 YouTube 搜索结果中的标题与频道。

### 6. OFDM Implementation Explained Visually!

来源：Wireless Explained · 英文 · 核心推荐

从星座符号进入子载波开始，理解 IFFT、时域采样与接收端 FFT 的实现关系。

- [YouTube 直达](https://www.youtube.com/watch?v=VwnUuBshXGw)

重点：画出 QAM → 子载波映射 → IFFT → 循环前缀；在接收端画出相应处理。

停止位置：能区分一个 QAM 符号、一个 OFDM 符号和一个 Wi-Fi 包即可。

检查理解：IFFT 的输入是比特、星座符号，还是天线电压？

来源说明：已核对 YouTube 搜索结果中的标题与频道。

### 7. How Wi-Fi Actually Works (Animated)

来源：Moving Parts · 英文 · 核心推荐

用一段动画建立 Wi-Fi 通信的整体画面，再用文章补齐发现、连接和传输的具体步骤。

- [YouTube 直达](https://www.youtube.com/watch?v=SiEVruxQqlI)

重点：只记住发现网络、建立连接、共享信道、传送数据这几个阶段。

停止位置：把术语记成待查问题即可；动画类比需要与后续技术资料交叉理解。

检查理解：“连上 Wi-Fi”和“已经能访问互联网”为什么不是同一件事？

来源说明：已核对 YouTube 搜索结果中的同名视频与频道；不沿用原清单未核实的时长。

### 8. How Radio Works

来源：Branch Education · 原清单条目待核对 · 英文

从电磁波、天线与载波建立射频直觉，辅助理解数字基带之后发生了什么。

- [YouTube 搜索](https://www.youtube.com/results?search_query=Branch%20Education%20How%20Radio%20Works)（搜索入口，非视频直达）
- [B站搜索](https://search.bilibili.com/all?keyword=Branch%20Education%20%E6%97%A0%E7%BA%BF%E7%94%B5%20%E5%8E%9F%E7%90%86)（搜索入口，非视频直达）

重点：关注载波、调制、天线与电磁波的关系，配合 I/Q 文章区分信号表示和物理发射。

停止位置：电磁场推导可先略过，先说明电路信号如何耦合到空间。

检查理解：数字 I/Q 采样与天线上的射频信号有何区别？

来源说明：未确认该标题与频道的准确对应关系，保留原推荐为搜索入口。

### 9. Every Wireless Technology Explained in Detail

来源：Branch Education · 原清单条目待核对 · 英文

作为无线技术的拓展入口，比较不同无线系统如何使用频谱、调制和天线。

- [YouTube 搜索](https://www.youtube.com/results?search_query=Branch%20Education%20Every%20Wireless%20Technology%20Explained%20in%20Detail)（搜索入口，非视频直达）

重点：优先找 Wi-Fi、无线传播和多天线相关部分。

停止位置：蜂窝网络和卫星通信可暂时跳过，避免主线发散。

检查理解：频率、带宽与传输速率分别描述什么？

来源说明：未确认同名视频，保留原清单标题与频道检索词。

### 10. Iain Explains · 星座图与 OFDM 系列

来源：Iain Explains Signals, Systems, and Digital Comms · 英文

逐个拆解星座图、DFT 与循环前缀，适合看完直观动画后补数学与工程含义。

- [YouTube 搜索](https://www.youtube.com/results?search_query=Iain%20Explains%20OFDM%20constellation%20DFT%20cyclic%20prefix)（搜索入口，非视频直达）
- [B站搜索](https://search.bilibili.com/all?keyword=Iain%20%E6%AD%A3%E4%BA%A4%E9%A2%91%E5%88%86%E5%A4%8D%E7%94%A8%20OFDM%20%E4%B8%AD%E5%AD%97)（搜索入口，非视频直达）

重点：依次找 What is a Constellation Diagram?、What is OFDM?、OFDM and the DFT、What is a Cyclic Prefix in OFDM?。

停止位置：按当前疑问挑单集，不必从头刷完整频道。

检查理解：循环前缀为什么要复制符号尾部，而不只是补零？

来源说明：系列使用频道与主题搜索入口；B站译制版本及字幕质量未逐一核验。

### 11. Waveform Academy · OFDM 与 MATLAB 系列

来源：Waveform Academy · 英文

把资源网格、IFFT 与循环前缀落实到可观察的数值和波形，连接概念与仿真。

- [YouTube 直达](https://www.youtube.com/watch?v=XY8c-Az4M6U)
- [Grid & IFFT 直达](https://www.youtube.com/watch?v=kJk7hHrC4Fk)
- [YouTube 搜索](https://www.youtube.com/results?search_query=Waveform%20Academy%20OFDM%20Cyclic%20Prefix%20ISI%20Mitigation)（搜索入口，非视频直达）

重点：OFDM Explained → OFDM Grid & IFFT Explained → OFDM Cyclic Prefix and ISI Mitigation。

停止位置：先跟踪数组代表什么；没有 MATLAB 也能先看图与处理顺序。

检查理解：导频、空子载波和数据子载波为什么要放在不同位置？

来源说明：前两集标题与频道已核对；循环前缀单集使用搜索入口。

### 12. OFDM Tutorial Series: Direct Conversion

来源：Silicon DSP Corporation · 英文

围绕直接变频接收架构认识基带与射频的连接，作为接收机工程细节的补充。

- [YouTube 直达](https://www.youtube.com/watch?v=okGd-TQJ-u8)
- [YouTube 搜索](https://www.youtube.com/results?search_query=Rohde%20Schwarz%20OFDM%20packet%20detection%20synchronization%20channel%20estimation)（搜索入口，非视频直达）

重点：结合 I/Q 图辨认下变频和接收链路；同步、均衡部分可继续在同系列中查找。

停止位置：先理解信号路径，器件非理想特性与校准可之后再读。

检查理解：接收端为什么必须先同步，再做可靠的符号判决？

来源说明：原清单将此片归为 R&S；本次同名视频搜索结果的频道是 Silicon DSP Corporation，已更正，并保留 R&S 主题搜索。

### 13. WLAN (Wi-Fi) Explained 系列

来源：MathWorks · 原清单推荐 · 英文

用于串联 WLAN 代际演进、标准波形、MIMO 与测量分析，按主题补充理解。

- [YouTube 搜索](https://www.youtube.com/results?search_query=MathWorks%20WLAN%20Wi-Fi%20Explained%20series)（搜索入口，非视频直达）

重点：先选 WLAN 基础、OFDM 和 MIMO；Wi-Fi 6/7、OFDMA、EVM 放到基础链路之后。

停止位置：工具箱安装与代码接口不作为第一轮学习要求。

检查理解：OFDMA 相比 OFDM 多解决了哪一种资源分配问题？

来源说明：系列名称来自原清单，使用 MathWorks 频道主题搜索入口。

### 14. 瀚海方舟 · OFDM 系列

来源：瀚海方舟 · B站 · 中文

中文概念补充，围绕基本概念、正交、保护间隔和导频逐个学习。

- [B站搜索](https://search.bilibili.com/all?keyword=%E7%80%9A%E6%B5%B7%E6%96%B9%E8%88%9F%20OFDM)（搜索入口，非视频直达）

重点：按 OFDM-01.基本概念、何为正交、保护间隔、导频初步的顺序检索。

停止位置：先完成这四个主题；公式推导有需要再回看。

检查理解：保护间隔和导频分别应对哪类问题？

来源说明：原清单系列；B站检索触发验证，使用明确标注的搜索入口。

### 15. MIMO-OFDM 教程系列

来源：Silicon DSP Corporation · B站搬运检索 · 英文

进一步认识多径、信道矩阵、信道估计和 802.11n 接收机，适合第二轮深入。

- [B站搜索](https://search.bilibili.com/all?keyword=MIMO%20OFDM%20%E6%95%99%E7%A8%8B%20Silicon%20DSP%20Corporation)（搜索入口，非视频直达）
- [YouTube 搜索](https://www.youtube.com/results?search_query=Silicon%20DSP%20Corporation%20MIMO%20OFDM%20802.11n%20receiver)（搜索入口，非视频直达）

重点：先找 MIMO 信道矩阵和 802.11n receiver architecture 相关单集。

停止位置：先理解 y = Hx + n 各项的物理含义；矩阵求解细节可后读。

检查理解：多根天线为什么并不自动等于多个可用空间流？

来源说明：系列与搬运版本使用搜索入口，未承诺中文字幕。

### 16. 正交频分复用从原理到应用，揭秘现代通信的核心技术

来源：技术Flow · 原清单推荐 · 中文

作为中文快速概览，帮助建立 OFDM 的用途和基本思路，再回到分步骤资料巩固。

- [B站搜索](https://search.bilibili.com/all?keyword=%E6%8A%80%E6%9C%AFFlow%20%E6%AD%A3%E4%BA%A4%E9%A2%91%E5%88%86%E5%A4%8D%E7%94%A8%E4%BB%8E%E5%8E%9F%E7%90%86%E5%88%B0%E5%BA%94%E7%94%A8%20%E6%8F%AD%E7%A7%98%E7%8E%B0%E4%BB%A3%E9%80%9A%E4%BF%A1%E7%9A%84%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF)（搜索入口，非视频直达）

重点：记住多载波、正交和抵抗多径三个关键词。

停止位置：先记下不理解的词，在概念速查和文字列表里逐个补齐。

检查理解：OFDM 为什么在宽带无线系统中常见？

来源说明：原清单标题，尚未核实准确的视频 ID。

### 17. Demo: GNU Radio IEEE 802.11a/g/p OFDM Receiver

来源：Bastian Bloessl · gr-ieee802-11 · 英文

跟踪软件无线电的接收处理块，从采样和星座图一路走到恢复出的 Wi-Fi 帧。

- [YouTube 搜索](https://www.youtube.com/results?search_query=Bastian%20Bloessl%20Demo%20GNU%20Radio%20IEEE%20802.11a%20g%20p%20OFDM%20Receiver)（搜索入口，非视频直达）
- [项目入口](https://github.com/bastibl/gr-ieee802-11)

重点：对照项目流程图寻找同步、FFT、均衡、解映射和译码模块。

停止位置：第一遍只理解处理块的输入输出，不需要先购买 USRP 或安装全部依赖。

检查理解：GNU Radio 的 I/Q 流与 Wireshark 捕获的帧之间差了哪些步骤？

来源说明：项目功能已核验；该演示的视频 ID 尚未确认。

### 18. 愿天堂没有 OFDM：硬核拆解 B210 文件传输，从物理层到应用层

来源：btfzzzz · 原清单推荐 · 中文

通过文件传输案例，把应用数据、GNU Radio 处理流程和 SDR 硬件联系起来。

- [B站搜索](https://search.bilibili.com/all?keyword=btfzzzz%20%E6%84%BF%E5%A4%A9%E5%A0%82%E6%B2%A1%E6%9C%89OFDM%20B210%20%E6%96%87%E4%BB%B6%E4%BC%A0%E8%BE%93)（搜索入口，非视频直达）

重点：观察文件分块、调制、发射、接收和重组之间的接口。

停止位置：先跟踪数据；通用 OFDM 文件传输并不必然实现标准 802.11 的全部 MAC 行为。

检查理解：“OFDM 文件传输成功”和“实现兼容手机的 Wi-Fi”之间还差什么？

来源说明：原清单标题，使用 B站搜索入口；未核实其是否为标准 WLAN 波形。

## 文字（21 篇选读）

### 1. WLAN 全景：AP、协议栈与网络边界

来源：ShareTechnote · WiFi Overview · 英文 · 核心推荐

先理解 Wi-Fi 在整个网络中的位置：无线链路连接到哪里，AP 和路由器分别承担什么角色。

- [阅读文章](https://www.sharetechnote.com/html/WLAN_Overview.html)

重点：只读 Overall Network Architecture 与 Protocol Stack，约安排 15 分钟。再按需读 Roaming 和 QoS。

停止位置：看到安全机制与代际细节时先停；能画出 STA → AP → 局域网/上游网络就够了。

检查理解：同一个 SSID 下的多个 AP 为什么仍有不同 BSSID？

来源说明：已访问并核对章节；站内知识导读应结合具体标准代际理解。

### 2. 一次连接的过程：扫描、认证、关联与密钥握手

来源：ShareTechnote · WiFi Protocol · 英文 · 核心推荐

沿着真实帧交换理解“找到 AP”到“可以发受保护的数据”，区分关联、密钥建立和 IP 地址配置。

- [阅读连接流程](https://www.sharetechnote.com/html/WLAN_Protocol.html#Detailed_Sequence_of_Initial_Attach)

重点：读 Overall Procedure 与 Detailed Sequence of Initial Attach；先以 WPA2-Personal 为例，安排 20–30 分钟。

停止位置：跳过旧 WEP Shared Key 的挑战流程；现代 WPA3-SAE 的认证过程不同，不能照搬 WPA2。

检查理解：802.11 Open System Authentication 与 WPA2 四次握手各自做什么？

来源说明：已核对连接、EAPOL 与 ACK 的流程说明。

### 3. 发送前为什么要等：退避、SIFS、ACK 与重传

来源：ShareTechnote · Data Transmission in Detail · 英文 · 核心推荐

理解共享无线信道上的一次发送周期。争用等待、帧间间隔和 ACK 都会消耗时间。

- [阅读空口时序](https://www.sharetechnote.com/html/WLAN_Protocol.html#Data_Transmission_Detail)

重点：读 Data Transmission in Detail，画出争用 → Data → SIFS → ACK；再找失败后的退避与重试，安排 20 分钟。

停止位置：先掌握基本 DCF；EDCA 的不同优先级和 TXOP 作为下一步。具体时长随 PHY 而变。

检查理解：为什么 PHY 速率为 300 Mbps，文件下载却远不到 300 Mbps？

来源说明：已核对原文数据交换与帧间间隔章节。MAC ACK 与 TCP ACK 属于不同层次。

### 4. 看懂 Wi-Fi 帧：MAC 帧与 PHY 包的边界

来源：ShareTechnote · WiFi Frame Structure · 英文

把管理帧、控制帧、数据帧与外层 PHY 前导码区分开，认识地址、序列号、FCS 和 Duration。

- [阅读帧结构](https://www.sharetechnote.com/html/WLAN_FrameStructure.html)

重点：看 PHY/MAC Frame、MAC Header Structure、Frame Type Table 和 ACK Frame，安排 20 分钟。

停止位置：不背所有字段与 bit 位；原文旧式长度和 DSSS 前导码参数不代表所有 Wi-Fi 代际。

检查理解：Beacon、ACK 和携带 IP 数据的帧分别属于哪类？

来源说明：已访问正文；选读结构图，避免把早期 802.11 参数泛化。

### 5. Linux Wi-Fi 栈图解讲义 · 精选页

来源：Alexis Lothoré · Bootlin · 2025 · 英文 · 核心推荐

与视频一一对应的简洁幻灯片。先把用户态、配置接口、mac80211 和两类驱动摆到正确的位置。

- [阅读 PDF 讲义](https://bootlin.com/pub/conferences/2025/elce/lothore-80211.pdf)
- [官方出处](https://bootlin.com/blog/back-from-open-source-summit-europe-2025-talks-from-bootlin/)

重点：按页脚编号先读 4–11 页：802.11 layers、网络、硬件、FullMAC/SoftMAC、栈图和虚拟接口，安排 15–20 分钟。

停止位置：到 Implementing wireless drivers 先停；第二遍再读 TX、RX 与调试部分，无需通读结构体定义。

检查理解：为什么 iw 的配置命令与普通 socket 的业务数据走不同路径？

来源说明：已下载核对讲义，共 47 个 PDF 页面（页脚编号含封面差异）。SoftMAC 仍可将实时 Low-MAC 功能交给硬件。

### 6. mac80211 到底替驱动做了什么？

来源：Linux Wireless · About mac80211 · 英文 · 核心推荐

短篇官方概览，明确 mac80211 是给 SoftMAC 驱动使用的框架，提供 802.11 软件 MAC 能力。

- [阅读官方概览](https://wireless.docs.kernel.org/en/latest/en/developers/documentation/mac80211.html)

重点：读开头概述与 Supported features，约 10 分钟；认识其与 cfg80211 的依赖关系。

停止位置：不进入完整 driver API 手册；先分清设备固件、内核和 hostapd 的职责。

检查理解：支持 mac80211 是否意味着所有 MAC 操作都在 CPU 上执行？

来源说明：已核对官方页面。部分特性列表和历史描述较旧，适合作为职责概览。

### 7. cfg80211 与 nl80211：配置走哪条路？

来源：Linux Wireless · 两篇短文 · 英文

用两篇短文弄清内核无线配置 API 与用户态 Netlink 接口；理解扫描、连接和设备能力如何被管理。

- [cfg80211 概览](https://wireless.docs.kernel.org/en/latest/en/developers/documentation/cfg80211.html)
- [nl80211 概览](https://wireless.docs.kernel.org/en/latest/en/developers/documentation/nl80211.html)

重点：先读 cfg80211 开头，再读 nl80211 概述与 Users of nl80211，安排 10–15 分钟。

停止位置：跳过 vendor commands、testmode 和老 Wireless Extensions 的迁移细节。

检查理解：hostapd、wpa_supplicant 和 iw 如何把控制请求交给驱动？

来源说明：两个页面已访问核对；历史 CRDA 描述不作为现代系统部署指南。

### 8. 数字调制：从比特到星座点

来源：PySDR · 第 4 章（中文选读） · 中文 · 核心推荐

通过图像理解符号、PSK、QAM 和星座图。16-QAM 每个星座符号携带 4 个编码后的比特。

- [阅读中文章节](https://pysdr.org/zh/content-zh/digital_modulation.html)

重点：只读“符号”“相移键控”“IQ 图/星座图”“正交幅度调制”，安排 20–25 分钟。

停止位置：到 FSK 前可以停下；Python 实验按兴趣做。注意这里的符号不同于完整 OFDM 符号。

检查理解：为什么更高阶 QAM 提高速率，却也更容易受噪声影响？

来源说明：已核对中文正文与对应小节。

### 9. 信道编码：为什么发送额外的比特？

来源：PySDR · 第 13 章（中文选读） · 中文 · 核心推荐

理解前向纠错、编码率与软判决，补上“比特 → QAM”之间常被科普省略的一段。

- [阅读中文章节](https://pysdr.org/zh/content-zh/channel_coding.html)

重点：读“为什么需要信道编码”“编码率”“调制与编码”“软判决解码 vs 硬判决解码”，安排 20 分钟。

停止位置：汉明码矩阵、香农公式和复杂编码器推导先跳过。把 1/2 码率理解为信息位只占编码位的一半。

检查理解：提高调制阶数和提高编码率，各自怎样改变速率与可靠性？

来源说明：已核对中文正文。此章解释通用编码概念，不是 Wi-Fi 编码器的逐位规范。

### 10. 频域与 FFT：看波形的另一种坐标

来源：PySDR · 第 2 章（中文选读） · 中文

用时频图建立傅里叶变换的直觉，为 OFDM 的子载波与 IFFT 做准备。

- [阅读中文章节](https://pysdr.org/zh/content-zh/frequency_domain.html)

重点：看“时间-频率对”“傅里叶变换”和“快速傅里叶变换（FFT）”中的图，安排 20 分钟。

停止位置：第一次不必推导积分、实现 FFT 算法或研究窗函数。

检查理解：同一段信号的时域图和频域图分别回答什么问题？

来源说明：已核对真正的中文章节路径，而非返回首页的旧链接。

### 11. 多径与 OFDM：反射为什么会让通信变难？

来源：PySDR · 第 15 章（中文选读） · 中文 · 核心推荐

从多个延迟副本的叠加出发，理解衰落、码间干扰和把宽带信道拆成窄子载波的思路。

- [阅读中文章节](https://pysdr.org/zh/content-zh/multipath_fading.html)

重点：读“多径”“衰落”“对抗多径衰落”和“OFDM”，安排 20–25 分钟。

停止位置：先略过瑞利衰落仿真代码和 CDMA；记住多径既可能相长，也可能相消。

检查理解：为什么信号强度不错，也可能有部分子载波质量很差？

来源说明：已核对多径与 OFDM 小节；循环前缀的机制配合下一篇阅读。

### 12. 循环前缀：保护间隔为什么要这样构造？

来源：DSP Illustrations · The Cyclic Prefix in OFDM · 英文 · 核心推荐

认识复制符号尾部的作用：在合适的定时和足够 CP 长度下，让接收窗口中的信道作用适于 FFT 后逐子载波均衡。

- [阅读循环前缀文章](https://dspillustrations.com/pages/posts/misc/the-cyclic-prefix-cp-in-ofdm.html)
- [配套 OFDM 收发示例](https://dspillustrations.com/pages/posts/misc/python-ofdm-example.html)

重点：先读概念和时域示意，再看线性卷积与循环卷积的联系，安排 20–30 分钟。

停止位置：第一次可跳过卷积代数推导。CP 不会消除多径本身，也不能解决所有频偏问题。

检查理解：当信道的延迟扩展超出 CP 时，会发生什么？

来源说明：已核对正文的 CP 两个作用及数值示例；具体长度和符号格式要对应所学 PHY。

### 13. I/Q、采样与射频：数字如何接上模拟世界？

来源：PySDR · 第 3 章（中文选读） · 中文 · 核心推荐

把复数、正交采样、载波、下变频与接收机架构联系起来。I/Q 是信号的两路分量表示。

- [阅读中文章节](https://pysdr.org/zh/content-zh/sampling.html)

重点：先读“正交采样”“复数”，再读“载波和下变频”“接收机架构”“基带信号与带通信号”，安排 25–35 分钟。

停止位置：先跳过平均功率、PSD 代码与硬件操作。沿接收图反向理解发射端的 DAC 与上变频。

检查理解：为什么采样率不必直接等于 5 GHz 的射频载波频率？

来源说明：已核对中文 I/Q 章节及接收架构小节。

### 14. 链路预算：功率、距离、天线与 SNR

来源：PySDR · 第 12 章（中文选读） · 中文

认识 dB/dBm、发射功率、路径损耗、天线增益和信噪比，解释“为什么有信号却跑不快”。

- [阅读中文章节](https://pysdr.org/zh/content-zh/link_budgets.html)

重点：先读信号功率预算中的各项与 SNR，安排 20 分钟；尝试把损耗与增益相加减。

停止位置：无需照算 ADS-B 案例；RSSI 不等于 SNR，天线增益也不是凭空增加发射机总功率。

检查理解：干扰变大但 RSSI 不变时，吞吐量可能怎样变化？

来源说明：已核对中文链路预算章节。

### 15. 接收端先做什么：时间同步与载波频偏

来源：PySDR · Synchronization · 英文

理解真实接收机面对的未知时间偏移和频率偏差；接收流程远不止调用一次 FFT。

- [阅读同步章节](https://pysdr.org/content/sync.html)

重点：读 Introduction、Adding a Frequency Offset 和各级同步的概念图，安排 20–30 分钟。

停止位置：暂不实现 Mueller and Muller 或 Costas Loop；这里以单载波示例讲同步，不能直接视为 Wi-Fi 接收机算法。

检查理解：符号定时、载波同步和帧同步分别在寻找什么？

来源说明：已核对英文正文；中文目录尚未提供同等同步章节。

### 16. PHY 帧里的前导码、训练序列与数据

来源：ShareTechnote · WiFi PHY Frame · 英文

把抽象 OFDM 波形放回一个真正的 Wi-Fi 物理层包，理解接收机从哪里获得同步和信道信息。

- [阅读 PHY 帧图解](https://www.sharetechnote.com/html/WLAN_PHY_Frames.html)

重点：先看总体结构和 802.11a/g 的 OFDM 示例，找出训练字段、信令字段和数据字段，安排 20 分钟。

停止位置：不必同时记住 HT、VHT、HE、EHT 的所有帧格式。

检查理解：如果只发送业务数据、不发送训练序列，接收机会缺少什么？

来源说明：已核对页面；不同 PHY 的前导码和字段安排不同。

### 17. MIMO、MCS 与聚合：速率是怎么提高的？

来源：Linux Wireless · Review of IEEE-802.11n · 英文

短篇串联空间流、信道带宽、保护间隔、MCS 与帧聚合，理解 PHY 速率和 MAC 效率的两条提升路径。

- [阅读 802.11n 概览](https://wireless.docs.kernel.org/en/latest/en/developers/documentation/ieee80211/802.11n.html)

重点：读 Spatial streams 与 MCS，再找聚合和 Block ACK，安排 20–30 分钟。

停止位置：先不背 MCS 表；空间流数量不等于天线数量，A-MSDU 与 A-MPDU 的聚合层级也不同。

检查理解：提高 MCS 和开启 A-MPDU，为什么都可能提升吞吐，却作用于不同环节？

来源说明：已核对官方概览。这是 802.11n 的入门视角，不是 Wi-Fi 6/7 的完整介绍。

### 18. openwifi：用一张架构图贯穿软件与硬件

来源：open-sdr · 官方项目 README · 英文 · 核心推荐

从真实开源实现检查自己对全链路的理解：Linux mac80211 驱动、FPGA Low-MAC / PHY、射频收发器。

- [阅读项目架构](https://github.com/open-sdr/openwifi)

重点：只读开头定义、架构图和 Features；定位 DCF/CSMA-CA 与 SIFS 的实现位置，安排 15–20 分钟。

停止位置：到 Download img and Quick start 即可停下，第一轮不需要开发板或构建 FPGA。

检查理解：为什么 Low-MAC 在 FPGA 中，而普通网络工具仍可像使用商用网卡一样工作？

来源说明：已核对官方 README、架构与功能列表。开源版本和高级订阅功能范围不同。

### 19. openwifi-hw：基带收发模块在哪里？

来源：open-sdr · FPGA 项目 README · 英文

将理论中的 OFDM 收发、Low-MAC、DMA 和射频接口映射到可见的硬件模块。

- [阅读 FPGA 项目](https://github.com/open-sdr/openwifi-hw)

重点：浏览 README 和 IP 目录名称；只为 TX/RX、XPU 与接口建立模块索引，安排 15 分钟。

停止位置：不要求读 Verilog 或启动 Vivado；有了整体地图后再按模块深入。

检查理解：从 DMA 收到一个帧之后，哪些硬件块参与把它变成 I/Q？

来源说明：官方软件仓库明确链接到此硬件仓库；具体模块接口随版本变化。

### 20. gr-ieee802-11：可观察的 OFDM 收发流程

来源：Bastian Bloessl · 官方项目 · 英文

通过 GNU Radio 项目理解 802.11a/g/p 收发处理块，并认识从信号恢复帧到送入 Wireshark 的边界。

- [阅读项目说明](https://github.com/bastibl/gr-ieee802-11)

重点：读 README 开头、OFDM PHY 与 Usage，浏览 examples 中的流程图，安排 20 分钟。

停止位置：跳过 Installation，先看模块；模拟运行与完整实时 Wi-Fi MAC 互通是不同目标。

检查理解：为何能解码 802.11 帧，不代表实现了所有实时 ACK 和竞争行为？

来源说明：已核对项目说明、支持的 PHY 与 GNU Radio 分支要求。

### 21. 普通抓包与 Monitor 模式到底差在哪？

来源：Wireshark Wiki · WLAN Capture Setup · 英文

解释为什么普通网卡抓包可能只见到类似以太网的帧，以及如何理解管理帧、控制帧和监听模式。

- [阅读抓包概念](https://wiki.wireshark.org/CaptureSetup/WLAN)
- [Radiotap 字段说明](https://www.radiotap.org/)

重点：先读 802.11 packet types 与 monitor mode 说明，约 15–20 分钟。

停止位置：先跳过不同操作系统的配置命令；监听模式也不是保存原始 I/Q 采样。

检查理解：看见 Wireshark 中的 Wi-Fi 帧，是否意味着看到了原始电磁波？

来源说明：已核对 Wireshark 页面；其中部分频段和平台说明较旧，实际能力取决于网卡和驱动。

## 文字来源访问记录

记录的是本次访问结果与正文标题，并不保证链接长期有效。官方 PDF 已单独下载与解析。

| 原始链接 | HTTP | 落地页面标题 |
| --- | --- | --- |
| https://www.sharetechnote.com/html/WLAN_Overview.html | 200 | WiFi  /  ShareTechnote |
| https://www.sharetechnote.com/html/WLAN_Protocol.html | 200 | WiFi  /  ShareTechnote |
| https://www.sharetechnote.com/html/WLAN_FrameStructure.html | 200 | WiFi  /  ShareTechnote |
| https://bootlin.com/pub/conferences/2025/elce/lothore-80211.pdf | 200 | Unpacking the Linux WiFi stack — 47 个 PDF 页面 |
| https://bootlin.com/blog/back-from-open-source-summit-europe-2025-talks-from-bootlin/ | 200 | Back from Open Source Summit Europe 2025: talks from Bootlin – Bootlin |
| https://wireless.docs.kernel.org/en/latest/en/developers/documentation/mac80211.html | 200 | About mac80211 — Linux Wireless  documentation |
| https://wireless.docs.kernel.org/en/latest/en/developers/documentation/cfg80211.html | 200 | About cfg80211 — Linux Wireless  documentation |
| https://wireless.docs.kernel.org/en/latest/en/developers/documentation/nl80211.html | 200 | About nl80211 — Linux Wireless  documentation |
| https://pysdr.org/zh/content-zh/digital_modulation.html | 200 | 4. 数字调制  /  PySDR: A Guide to SDR and DSP using Python |
| https://pysdr.org/zh/content-zh/channel_coding.html | 200 | 13. 信道编码  /  PySDR: A Guide to SDR and DSP using Python |
| https://pysdr.org/zh/content-zh/frequency_domain.html | 200 | 2. 频率域  /  PySDR: A Guide to SDR and DSP using Python |
| https://pysdr.org/zh/content-zh/multipath_fading.html | 200 | 15. 多径衰落  /  PySDR: A Guide to SDR and DSP using Python |
| https://dspillustrations.com/pages/posts/misc/the-cyclic-prefix-cp-in-ofdm.html | 200 | The Cyclic Prefix (CP) in OFDM - DSPIllustrations.com |
| https://dspillustrations.com/pages/posts/misc/python-ofdm-example.html | 200 | Python OFDM Example - DSPIllustrations.com |
| https://pysdr.org/zh/content-zh/sampling.html | 200 | 3. IQ 采样  /  PySDR: A Guide to SDR and DSP using Python |
| https://pysdr.org/zh/content-zh/link_budgets.html | 200 | 12. 链路预算  /  PySDR: A Guide to SDR and DSP using Python |
| https://pysdr.org/content/sync.html | 200 | Synchronization  /  PySDR: A Guide to SDR and DSP using Python |
| https://www.sharetechnote.com/html/WLAN_PHY_Frames.html | 200 | WiFi  /  ShareTechnote |
| https://wireless.docs.kernel.org/en/latest/en/developers/documentation/ieee80211/802.11n.html | 200 | Review of IEEE-802.11n — Linux Wireless  documentation |
| https://github.com/open-sdr/openwifi | 200 | GitHub - open-sdr/openwifi: open-source IEEE 802.11 WiFi baseband FPGA (chip) design: driver, software · GitHub |
| https://github.com/open-sdr/openwifi-hw | 200 | GitHub - open-sdr/openwifi-hw: open-source IEEE 802.11 WiFi baseband FPGA (chip) design: FPGA, hardware · GitHub |
| https://github.com/bastibl/gr-ieee802-11 | 200 | GitHub - bastibl/gr-ieee802-11: IEEE 802.11 a/g/p Transceiver · GitHub |
| https://wiki.wireshark.org/CaptureSetup/WLAN | 200 | CaptureSetup/WLAN - Wireshark Wiki |
| https://www.radiotap.org/ | 200 | Radiotap - Introduction |

## 维护约定

数据源为 `resources.js`。维护时保留资源 ID；修改来源、标题、选读范围或新增材料后，同步此文件。搜索入口必须保留“搜索”字样；不能把作者目录、检索结果或 HTTP 200 当作已完整观看的视频证明。
