# bertrepo-skills

个人/团队 Claude Code skills 集合,聚焦「设计稿/原型 → 前端代码」工程化工作流。

## 包含的 skills

### prototype-to-code
设计稿/原型 → 前端代码的通用工作流:
- **墨刀**(modao MCP):分享链接克隆 → `export_proto_to_html` 导出 HTML 还原;含错误文案排查表
- **Figma**:本地 Dev Mode MCP 优先,远程 OAuth 限制说明
- **通用兜底**:MasterGo/即时设计/Pixso/截图 → agent-browser 逐屏截图还原
- 附还原纪律(标注优先、复用组件库、完成后截图对比)

## 安装

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

重启 Claude Code 会话后生效。也可手动把 `skills/<name>` 复制到 `~/.claude/skills/`。

## 适用范围

- 需要 [modao MCP](https://modao.cc) 与墨刀个人令牌(墨刀设置内生成)
- Figma 还原需要 Figma 桌面端 Dev Mode 或 figma MCP OAuth
