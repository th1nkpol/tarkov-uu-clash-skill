---
name: tarkov-uu-clash
description: "Diagnose and resolve Escape from Tarkov login or update conflicts when NetEase UU and Clash/Mihomo run together on Windows. Use for system proxy bypass, process/domain split routing, and preserving a Russian-region UU login path; excludes general AWS deployment and unrelated proxy setup."
---

# 塔科夫、UU 与 Clash 共存

帮助用户在 Windows 上保留 Clash 普通代理，同时让塔科夫通过 UU 登录和更新。保持当前订阅、节点、原规则及其他自定义配置。

## 先确认实际路径

- 区分登录失败、更新慢和进服/对局异常。用户已经说明账号区服时，沿用该信息；俄区账号按用户要求使用 UU“俄服登录解锁”，不能擅自替换成 Clash 美国节点。
- 只读核对当前订阅、Rule/Global 模式、系统代理和 TUN 状态，以及真实运行核心的配置和控制端点。历史文档不能代替当前运行状态。
- 读取 [诊断与验证](references/diagnostics.md) 后再做本机修改。观察相关连接的进程、域名、匹配规则和链路，避免输出完整订阅、认证 URL 或日志中的凭据。

## 三个不同层次

1. **系统代理绕过**让遵循系统代理的应用直接建立连接。
2. **Clash DIRECT**只处理已经进入 Clash 的流量；外部连接可能由 Mihomo 建立，不能据此判断 UU 已接管游戏进程。
3. **TUN**从路由层接收流量。绕过系统代理或命中 DIRECT 不等于避开 TUN。

本 Skill 的已验证配置是 **规则模式、系统代理开启、TUN 关闭**。关闭 TUN 会使不遵循系统代理的其他应用走本地网络，应说明这一影响。用户明确要求保留 TUN 时，需要另行诊断和验证，不能把本方案当作已验证的 TUN 共存方案。

## 合并配置

在用户授权的修复范围内，先保存受保护的备份和原始开关状态，再合并下列资源。当前用户的约束优先于案例中的具体设置。

- [全局扩展脚本](assets/clash-global-script.js)：前置 14 条进程和 8 条域名 DIRECT 规则。已有 `main()` 时保留其逻辑，将辅助函数合并并在最终返回前调用，只留一个入口。
- [系统代理绕过名单](assets/system-proxy-bypass.txt)：追加根域及通配子域，保留原有自定义项和默认本地绕过。包含更新域名 `eft-store.com`，不能只处理登录域名。
- [Verge 应用设置参考](assets/verge-settings-fragment.yaml)：属于应用层设置，不能作为完整 Mihomo 订阅导入或整体覆盖 `verge.yaml`。
- [Mihomo 规则参考](assets/mihomo-rules-fragment.yaml)：同一组 22 条规则。仅作合并模板，不能替换原规则列表或节点配置。

确认当前进程名与实际域名是否匹配，再使用模板。通过客户端支持的设置或接口生效，处理前端缓存，并核对真实核心。订阅扩展可能继续改写全局规则，切换订阅后也要验证。需要候选配置校验时使用内核 `-t`，避免运行第二个使用相同 WireGuard 身份的核心。

设置生效后，重建同一条 UU 加速会话，再完全退出、重开启动器。重启加速会中断现有连接，应按用户当前使用状态安排。用户自行完成登录。

## 验证与恢复

分别验证设置生效、登录、更新和进服。用实际下载连接与用户速度报告判断更新恢复；存在少量无关启动器后台代理连接不代表修复失败。

403 不能单独证明锁区；`198.18.*` 虚拟映射不能单独归因于 Clash。清理 Windows DNS 缓存不等于清理 UU 会话。不要凭这些现象修改 hosts、账户或服务器。

失败时根据新证据继续定位，无法证明改善时恢复本次变更。恢复只撤销本次新增项和开关变化；备份之后若有其他编辑，先合并差异。不要覆盖后来用户自定义设置。

本 Skill 不需要修改 AWS 资源、IAM、服务器、设备密钥或游戏账号，也不应把游戏更新引入计费出口作为默认修复。工具不可用时明确当前只能提供指导，不能声称已操作或已验证。

## 参考案例

遇到“登录已恢复但更新仍慢”或解释本方案依据时，读取 [脱敏案例](references/verified-case.md)。案例中登录和更新已由用户验证，对局与订阅切换后的游戏行为没有单独验证；速度不是承诺。
