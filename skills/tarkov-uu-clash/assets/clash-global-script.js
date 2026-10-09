// Clash Verge Rev global extension: apply after any existing custom logic.
// Does not contain proxy nodes, subscriptions, credentials, or DNS changes.
function applyTarkovUuBypass(config) {
  const processes = [
    'BsgLauncher.exe', 'EscapeFromTarkov.exe', 'EscapeFromTarkov_BE.exe',
    'BEService.exe', 'BEService_x64.exe', 'BELauncher.exe',
    'uu.exe', 'uu_launcher.exe', 'uu_agent.exe', 'uu_ball.exe',
    'uu_cloudsyn.exe', 'uu_neths_helper.exe', 'uu_download.exe', 'uu_translate.exe'
  ];
  const domains = [
    'escapefromtarkov.ru', 'escapefromtarkov.com', 'tarkov.com',
    'battlestategames.com', 'battleye.com', 'uu.163.com', 'uu.netease.com',
    'eft-store.com'
  ];
  const priority = processes.map(p => `PROCESS-NAME,${p},DIRECT`)
    .concat(domains.map(d => `DOMAIN-SUFFIX,${d},DIRECT`));
  const existing = config.rules || [];
  config.rules = priority.concat(existing.filter(r => !priority.includes(r)));
  config['find-process-mode'] = 'always';
  return config;
}

// If main() already exists, merge the helper above into that script and call
// applyTarkovUuBypass(config) just before its final return. Keep ONE main().
function main(config, profileName) {
  return applyTarkovUuBypass(config);
}
