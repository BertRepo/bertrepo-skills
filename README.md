# BertRepo Skills

Framework-neutral frontend workflows for coding agents. / 面向日常前端工程的按需工作簿。

## Skills

| Skill | Scope |
| --- | --- |
| `frontend-dev-playbook` | 项目探查、设计输入、组件/SSR/跨端、API/Mock、状态/表单、响应式/i18n、无障碍/性能、安全/隐私、调试、测试、构建部署、迁移重构、评审交接 |
| `prototype-to-code` | 聚焦原型/设计图还原：可用结构化数据、合法导出、授权复制与有预算的截图降级 |

`frontend-dev-playbook` 的入口只做路由，13 个 references 按场景加载。覆盖通用工作流，具体框架 API 仍以项目版本及官方文档为准。没有框架绑定、个人后端地址或账号密钥；MCP、浏览器和 Mock 服务都可选。不会全局安装 hook、强制启动浏览器或替用户上线。

## Install with Skills CLI

```sh
npx skills add BertRepo/bertrepo-skills --skill frontend-dev-playbook
# User-level installation, instead of the current project:
npx skills add BertRepo/bertrepo-skills --skill frontend-dev-playbook -g
# Focused design-only skill:
npx skills add BertRepo/bertrepo-skills --skill prototype-to-code -g
```

按 CLI 提示选择客户端。不同客户端目录不同，使用模型代理不等于自动获得所有 skill；需在支持 Skills 的 agent 中安装/启用。

## Magpie Library

在 **Library → Skills** 从 GitHub 添加 `BertRepo/bertrepo-skills`，选择技能及接收的 agents。可直接导入，无需等热门榜收录。

也可使用本地导入支持的 CLI：先将单个完整技能目录复制到 `~/.agents/skills/frontend-dev-playbook`，再执行：

```sh
magpie library skill hand-over frontend-dev-playbook
magpie library skill agents frontend-dev-playbook claude,codex,cursor
```

agent 名称与已安装能力以 `magpie agents` 为准。如果 agent 自己已有同名技能，先比较并保留备份，再选 `use-library` 或 `keep-own`，不要盲目覆盖。由 Library 接管后通过其更新，避免另一个安装器覆盖管理状态。

Windows 本地安装器可用于已经下载的仓库：

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
# Stage in the shared folder and hand over to Magpie:
powershell -ExecutionPolicy Bypass -File install.ps1 -Magpie
```

默认仅安装 frontend-dev-playbook；同名目标存在时退出，显式 `-Force` 才会备份并更新。安装器不自动创建付费设计任务、不修改 MCP 凭据。

## Examples / 场景示例

- “接手这个 Vue 2 项目，做一个员工列表并对接分页 API。”→ 项目探查、接口、数据状态。
- “照这张 Figma/墨刀图做页面，分享链接导不出来。”→ 检查工具契约与权限，不能猜 ID；必要时授权截图降级。
- “React 搜索框快速输入后显示旧结果。”→ 请求竞态调试和针对性回归，不启动整站 E2E。
- “SSR 水合报错，刷新深层路径 404。”→ 运行边界、路由和部署诊断。
- “给表单加键盘支持/深色模式/多语言。”→ 状态、样式与无障碍分册。
- “升级组件库但不能改变现有接口。”→ 迁移基线、分批变更、兼容检查。

更多用例与验收标准见 [场景评估表](evals/scenarios.json)。这些是可复用的评估用例，不是模型行为已经全通过的声明。

## Validation

Requires Node.js 18+ only for repository validation (the skills themselves are Markdown).

```sh
node tests/validate.cjs
```

检查 frontmatter、相对引用、13 个路由、场景预期引用、敏感信息模式与包完整性。行为评估需要用真实 agent 执行场景，核查是否选对分册、避免猜测、完成实际验证；静态检查不能替代它。

## Distribution status and contributions

公共 GitHub 是安装源；[skills.sh FAQ](https://www.skills.sh/docs/faq) 说明排行榜通过真实安装的匿名统计收录，推送并不保证立即上榜。Magpie 市场使用 skills.sh 的搜索与榜单，并有缓存。以实际搜索结果为准，不虚报收录、排名或安装量。

上游项目并非自动分发市场：Anthropic 为精选示例；Superpowers 通常不收新技能；wshobson/agents 需先提案等待回复；VoltAgent 主收子代理。遵守各自贡献规范，不群发推广 PR。欢迎在本仓库提具体现有场景、平台契约证据和小范围改进 PR。

## License

MIT, see [LICENSE](LICENSE). Original workflow guidance; no third-party skill bundle is redistributed. Design assets remain subject to their owners' terms. No credentials or proprietary prototype data are included.
