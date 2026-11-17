---
name: prototype-to-code
description: 设计稿/原型 → 前端代码的通用工作流。Use when 用户提供 墨刀(modao/axbox 分享链接)、Figma、MasterGo、即时设计、Pixso 等原型链接,或设计稿截图,要求还原页面、提取设计信息、生成前端代码时。
---

# 原型/设计稿 → 代码 通用工作流

## 第一步:识别来源,选对通道(禁止盲目调用工具)

| 来源 | 特征 | 通道 |
| --- | --- | --- |
| 墨刀(可编辑) | `modao.cc/proto/design/{id}` | 墨刀 MCP:`export_proto_to_html` |
| 墨刀(分享链接) | `modao.cc/axbox/share/{token}`、`mrp.modao.cc/...` | ❌ MCP 不支持 → 先让用户克隆(见下) |
| Figma | `figma.com/(file|design)/...` | figma MCP / 本地 Dev Mode MCP;分享链接需 OAuth,网关代登录会被拒 |
| MasterGo / 即时设计 / Pixso | 各自域名 | 暂无 MCP → 走通用兜底(截图对比) |
| 设计稿截图/图片 | 用户直接发图 | 直接读图 → 视觉还原 |

## 第二步:按通道执行

### A. 墨刀(本机已配 modao MCP,Bearer 认证)

1. **分享链接必须先克隆**:告诉用户"浏览器打开链接 → 点「使用此模板/编辑此原型」克隆到自己账号 → 复制设计页地址(`modao.cc/proto/design/xxx`)"。**禁止**把分享链接喂给 MCP —— 会得到"project_url 格式无效",或误导性的"原型 JSON 导出服务暂时不可用"(这是 get_proto_details 找不到原型的兜底文案,不代表服务故障)
2. **`list_created_prototypes`** 确认原型在账号内,拿真实 project_url(禁止手拼 URL)
3. **`export_proto_to_html`**(首选):导出 HTML,直接阅读布局/文案/组件还原代码
4. 需要结构化信息(交互/组件树)才用 `get_proto_details`(project_cid 必须来自真实数据,禁止从链接猜)
5. 视觉稿用 `export_proto_to_png`(cid + canvas_key 来自第 3 步)
6. 报错后**不要自动重试**(墨刀服务端明确要求),把原文展示给用户:
   - "原型项目解析异常" → 链接无效,请用户重新复制
   - "project_url 不属于当前墨刀环境" → 原型不在绑定账号下,走克隆
   - "原型 JSON 导出服务暂时不可用" → 99% 是 cid 错误的兜底文案

### B. Figma

1. 优先本地 Dev Mode MCP(`http://127.0.0.1:3845/mcp`,需 Figma 桌面端开启,免 OAuth)
2. 远程 MCP 需要用户在支持 OAuth 的客户端里自行登录(网关类工具会被 Figma 白名单拒绝)
3. 拿节点树/标注/token → 生成代码;导出图用于最终视觉对比

### C. 通用兜底(无 MCP 可用时的保底方案)

1. 用 agent-browser / playwright 打开原型链接,**逐屏截图**(只读浏览,不交互)
2. 将截图作为视觉参考还原代码,并**明确告知用户**:截图方案精度不如 HTML 导出(间距/字号需用户校对)
3. 原型需要登录才能看时,请用户提供已登录的浏览器环境或改用截图

## 第三步:还原纪律

- 颜色/间距/字号优先来自设计稿标注或导出数据,不凭感觉
- 优先复用项目既有组件库与 token 体系,禁止散落魔法值
- 完成后如可行,截图对比设计稿,差异列清单给用户
