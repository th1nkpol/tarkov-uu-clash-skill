# Tarkov UU Clash Skill

让 AI 帮你处理逃离塔科夫、网易 UU 与 Clash 同时运行时的网络冲突：保留日常代理，让游戏使用所选的 UU 加速路径。

这个 Windows Codex Skill 来自一次实际排查：俄区账号在 UU 与 Clash 同开时无法登录，登录恢复后更新仍然缓慢。通过区分系统代理绕过、Clash DIRECT 和 TUN，最终恢复登录，更新速度由用户确认接近原有 UU 的 20 MB/s。

Skill 会引导 AI 检查真实运行配置、合并必要规则、重建连接，并分别验证登录和更新。仓库提供正式 `SKILL.md`、诊断指南、脱敏案例及 22 条可合并规则，保留用户原有订阅和自定义设置。它不是代理订阅，没有节点或认证信息。

## 提供什么

| 内容 | 作用 |
|---|---|
| 分层诊断流程 | 避免把 DIRECT、虚拟 IP 或 403 当作结论 |
| 22 条规则模板 | 覆盖启动器、游戏、UU 进程及相关域名 |
| 系统代理绕过名单 | 同时处理登录和 `eft-store.com` 更新流量 |
| 验证与恢复步骤 | 核对真实连接，失败时只回滚本次变更 |
| 正式 Skill 结构 | 可在 Codex 中调用，也可供其他 AI 阅读 |

## 适用场景

- UU 与 Clash 同开，塔科夫登录出现 Forbidden 或超时。
- 登录已经恢复，但游戏更新明显慢于只使用 UU。
- 俄区账号需要保持 UU“俄服登录解锁”，同时保留其他应用的代理。

参考方案保持规则模式、系统代理开启，关闭 TUN，并分别设置系统代理绕过与前置 DIRECT 规则。关闭 TUN 会影响不遵循系统代理的其他应用，实施前应结合用户需求判断。案例验证了登录与更新；对局和其他环境需实际测试。

## 安装到 Codex

将仓库内整个 `skills/tarkov-uu-clash` 文件夹复制到你的 `$CODEX_HOME/skills` 目录。未设置 `CODEX_HOME` 时使用 `~/.codex/skills`。在 Windows 上通常是：

```text
%USERPROFILE%\.codex\skills\tarkov-uu-clash\SKILL.md
```

复制的是 Skill 文件夹，不是整个仓库。安装后在新会话中检查技能是否出现；若未发现，重新打开客户端。

调用示例：

```text
使用 $tarkov-uu-clash 检查我的 UU 与 Clash 分流。
我的塔科夫账号是俄区，UU 使用俄服登录解锁。
保留已有订阅和其他设置，分别验证登录与更新。
```

支持相同 Skill 格式的其他 AI 工具，可按其安装方式使用；没有技能机制的工具也可以先读取 `SKILL.md` 和所链接的参考文件。

## 内容

```text
skills/tarkov-uu-clash/
├── SKILL.md
├── agents/openai.yaml
├── references/diagnostics.md
├── references/verified-case.md
└── assets/
    ├── clash-global-script.js
    ├── mihomo-rules-fragment.yaml
    ├── system-proxy-bypass.txt
    └── verge-settings-fragment.yaml
```

模板只有分流规则，不能直接当作完整节点配置导入。AI 应按指南合并、核对真实核心、保护备份，并避免覆盖用户原有配置。

## 贡献与许可证

欢迎补充不同客户端版本的进程名、更新域名和可复现案例。请说明软件版本、故障阶段、实际连接路径及验证结果；提交前移除身份、订阅与认证信息。不要提交完整 Clash 配置或私人诊断日志。

本仓库原创代码和文档采用 [MIT License](LICENSE)。外部官方文档仅提供链接，其内容不包含在本仓库中。
