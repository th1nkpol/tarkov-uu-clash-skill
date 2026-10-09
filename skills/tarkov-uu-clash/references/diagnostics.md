# 本机诊断、验证与恢复

## 观察真实运行状态

定位当前 Clash/Mihomo 核心，读取其实际 `-f`、`-d`、控制管道或 API 端点；服务参数可能覆盖前端生成的配置。不要假定某个固定进程名、AppData 路径或代理端口适用于所有客户端。

候选查询：

```powershell
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -match 'mihomo|clash|BsgLauncher|^uu' } |
  Select-Object ProcessId, Name, ExecutablePath
Get-NetAdapter | Select-Object Name, Status, InterfaceDescription
Get-NetRoute -AddressFamily IPv4 |
  Where-Object { $_.DestinationPrefix -eq '0.0.0.0/0' } |
  Select-Object InterfaceAlias, NextHop
```

必要时在本机读取命令行和运行配置，但展示前删除认证参数、节点密码、WireGuard 密钥和订阅令牌。核心 `/connections` 只提取目标进程、公开域名、规则、链路及流量增量，不输出完整 API 数据。日志只提取错误类型、时间、公开主机名和状态码，不输出账号、Cookie、签名 URL 或登录请求体。

若 TCP 目标是 UU 本机端口，结合进程、实际加速状态和成功结果判断。某次案例使用端口 1111，其他环境不应硬编码。BsgLauncher 到 Clash 的连接可能是后台推送，也可能是下载，应以域名和流量区分。

出现 `198.18.*` 虚拟地址时，可比较 UDP/TCP DNS 和普通域名。它说明存在映射，不足以判断是哪层产生；清空系统缓存后仍存在也不能证明 Clash 配置无效。优先检查当前 UU 会话与真实连接，避免直接覆盖 hosts。

## 应用设置与核心规则

Clash Verge 的应用设置、全局扩展和订阅扩展有不同作用。参考 [官方扩展说明](https://www.clashverge.dev/guide/extend.html) 与 [Mihomo 规则文档](https://wiki.metacubex.one/config/rules/)，实施前以本机版本为准。

`system_proxy_bypass` 是 Verge 应用层设置。Windows 绕过项通常用分号分隔，根域和子域分别写为 `eft-store.com;*.eft-store.com`。将模板条目追加到原名单，保留默认本地绕过。

TUN 和系统代理开关优先从客户端设置保存，避免只写会被前端覆盖的核心字段。不要用规则片段整体替换订阅。全局脚本合并后确认节点、组、DNS、原有规则保留，目标规则在原 MATCH 前；切换订阅后重新确认。

备份应放在受保护目录，排除版本控制。记录旧开关、名单和脚本。必要的候选配置校验只用 `-t`，不要启动第二个 WireGuard 客户端占用同一身份。通过受支持的设置或接口加载；编辑前端文件时避免内存缓存把旧值写回，失败回滚本次修改。

## 检查系统代理绕过

对使用 .NET Framework 系统代理的启动器，可在 Windows PowerShell 5.1 中检查代理决定：

```powershell
$taskProxy = [System.Net.WebRequest]::GetSystemWebProxy()
foreach ($taskUrl in @(
  'https://launcher.escapefromtarkov.ru/',
  'https://launcher.escapefromtarkov.com/',
  'https://profile.tarkov.com/',
  'https://node06-108.eft-store.com/',
  'http://cdn-11.eft-store.com/'
)) {
  $taskUri = [Uri]$taskUrl
  [pscustomobject]@{
    Host = $taskUri.Host
    Bypassed = $taskProxy.IsBypassed($taskUri)
  }
}
```

此检查不发送 HTTP 请求。PowerShell 7 使用不同运行时，不能无条件当成启动器的同一行为。如果启动器版本或代理机制改变，检查实际机制。需要更多域名时，从当前下载连接识别并有针对性地补充。

## 结果标准

- 真实核心为 Rule 模式、TUN 关闭；系统代理仍开启，普通代理连接可用。
- 相关域名绕过系统代理，目标规则生效，原有订阅、组和规则保留。
- 重建同一 UU 加速并重开启动器后，用户实际登录成功。
- 更新主流量走预期路径；用户报告速度改善。可以从核心流量增量观察，但不要对无关后台流量要求完全归零。
- 进服与对局另行确认。登录和更新成功不能替代对局验证，配置兼容也不能替代切换订阅后的实测。

## 失败与恢复

登录仍报错时，根据新状态码、超时和路由继续定位；不能只反复重启同一配置。登录正常但更新慢时，检查遗漏的更新域名、显式代理、扩展覆盖或旧连接。需要暂停/重开下载时结合用户当前状态安排。

无法证明改善时，撤销本次新增规则、绕过项和开关变化。备份后用户若有新编辑，应合并恢复，而非整体替换。用户要求 TUN 同时开启时，说明目前验证范围并重新设计；不能擅自宣称 DIRECT 等同于从 TUN 排除。
