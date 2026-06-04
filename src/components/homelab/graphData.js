export const NODE_TYPES_META = {
  external: { color: 'var(--red-team)',       label: 'External'  },
  security: { color: '#ffc800',               label: 'Security'  },
  zone:     { color: 'var(--accent)',         label: 'Zone'      },
  host:     { color: 'var(--text-secondary)', label: 'Host'      },
  service:  { color: '#00e5ff',              label: 'Service'   },
  mgmt:     { color: '#a78bfa',              label: 'Mgmt'      },
}

export const EDGE_STYLES = {
  filtered:  { stroke: 'var(--red-team)',  strokeWidth: 1.5, strokeDasharray: '6 3' },
  allowed:   { stroke: 'var(--accent)',    strokeWidth: 1,   strokeDasharray: '4 4' },
  monitored: { stroke: '#ffc800',         strokeWidth: 1,   strokeDasharray: '3 3' },
}

export const initialNodes = [
  // ── Niveau 0 : WAN ───────────────────────────────────────
  {
    id: 'internet',
    type: 'custom',
    position: { x: 460, y: 20 },
    data: {
      label: 'INTERNET',
      type: 'external',
      role: 'WAN / FAI',
      description: 'Réseau WAN / Livebox FAI (192.168.1.0/24). Point d\'entrée unique pour tout le trafic entrant.',
      services: ['HTTP', 'HTTPS', 'DNS WAN'],
    },
  },

  // ── Niveau 1 : VPN + BASTION ─────────────────────────────
  {
    id: 'vpn-wg',
    type: 'custom',
    position: { x: 80, y: 160 },
    data: {
      label: 'WireGuard',
      type: 'service',
      role: 'VPN split-tunnel admin',
      description: 'VPN split-tunnel admin (UDP 51820). Routes VLANs poussées vers les clients. Utilisé avec Xguard GUI depuis Debian GNOME.',
      services: ['UDP 51820', 'Split-tunnel', 'Xguard GUI'],
    },
  },
  {
    id: 'bastion',
    type: 'custom',
    position: { x: 460, y: 160 },
    data: {
      label: 'BASTION',
      type: 'security',
      role: 'DMZ / Point d\'entrée unique',
      description: 'ThinkCentre M700 SFF — Debian 13 bare-metal (192.168.1.30). Héberge la VM OpenWRT, NPM, Teleport CE, AdGuard, CrowdSec. nftables en politique DROP sur br-wan.',
      services: ['Debian 13', 'KVM/libvirt', 'nftables DROP', 'IP: 192.168.1.30'],
    },
  },
  {
    id: 'vpn-xray',
    type: 'custom',
    position: { x: 840, y: 160 },
    data: {
      label: 'Xray VLESS+Reality',
      type: 'service',
      role: 'VPN full-tunnel anti-DPI',
      description: 'Full-tunnel anti-DPI (TCP 443). SNI spoofing www.microsoft.com — trafic indiscernable du TLS légitime. Utilisé depuis Debian via Xguard et depuis iOS via Karing (Sing-box).',
      services: ['TCP 443', 'SNI spoofing', 'VLESS+Reality', 'Karing iOS'],
    },
  },

  // ── Niveau 2 : Services BASTION ──────────────────────────
  {
    id: 'crowdsec',
    type: 'custom',
    position: { x: 80, y: 340 },
    data: {
      label: 'CrowdSec',
      type: 'security',
      role: 'IDS/IPS comportemental',
      description: 'IDS/IPS comportemental bare-metal sur BASTION. Analyse logs NPM + SSH + système. Bouncer nftables pour injection de règles de ban dynamiques.',
      services: ['Log analysis', 'nftables bouncer', 'Ban dynamique'],
    },
  },
  {
    id: 'openwrt',
    type: 'custom',
    position: { x: 300, y: 340 },
    data: {
      label: 'OpenWRT VM',
      type: 'security',
      role: 'Routeur / Firewall inter-VLAN',
      description: 'VM KVM/libvirt sur BASTION. Routage inter-VLAN, DHCP dnsmasq avec baux statiques MAC-based, NAT masquerade WAN, firewall nftables inter-VLAN via LuCI.',
      services: ['Routage inter-VLAN', 'DHCP dnsmasq', 'NAT masquerade', 'nftables LuCI'],
    },
  },
  {
    id: 'npm',
    type: 'custom',
    position: { x: 620, y: 340 },
    data: {
      label: 'NPM',
      type: 'service',
      role: 'Reverse Proxy TLS',
      description: 'Nginx Proxy Manager — reverse proxy TLS wildcard (*.hegemonia.lan). PKI interne : CA auto-signée 10 ans, certificat wildcard 825 jours.',
      services: ['TLS wildcard', 'PKI interne', '*.hegemonia.lan'],
    },
  },
  {
    id: 'adguard',
    type: 'custom',
    position: { x: 900, y: 340 },
    data: {
      label: 'AdGuard Home',
      type: 'service',
      role: 'DNS interne / Filtrage',
      description: 'DNS resolver interne (port 53). Rewrite *.hegemonia.lan → 192.168.1.30. Filtrage publicitaire et tracking réseau.',
      services: ['DNS port 53', 'Rewrite hegemonia.lan', 'Filtrage ad/tracking'],
    },
  },

  // ── Niveau 3 : Switch + Mgmt ──────────────────────────────
  {
    id: 'switch',
    type: 'custom',
    position: { x: 200, y: 520 },
    data: {
      label: 'HORACO Switch',
      type: 'zone',
      role: 'Switch L2 VLAN manageable',
      description: 'HORACO HC-SWTGW218AS — switch L2 manageable (chipset Realtek RTL8373-CG). Port 1 : trunk VLANs 1/20/30 → BASTION. Port 2 : access VLAN 20 → Proxmox. Port 3 : access VLAN 30 → SOC.',
      services: ['802.1Q Trunk', 'VLAN 20 access', 'VLAN 30 access'],
    },
  },
  {
    id: 'teleport',
    type: 'custom',
    position: { x: 560, y: 520 },
    data: {
      label: 'Teleport CE',
      type: 'mgmt',
      role: 'Bastion SSH / App Proxy',
      description: 'Teleport CE 18.7.2 — Bastion SSH et App Access proxy (teleport.hegemonia.lan). Accès admin SSH restreint, CA SSH interne. Tous les accès admin passent par Teleport ou Neko.',
      services: ['SSH Bastion', 'App Access', 'CA SSH interne', 'v18.7.2'],
    },
  },
  {
    id: 'neko',
    type: 'custom',
    position: { x: 800, y: 520 },
    data: {
      label: 'Neko (Firefox isolé)',
      type: 'mgmt',
      role: 'Navigateur admin isolé',
      description: 'Navigateur Firefox containerisé (WebRTC). Seul point d\'accès aux UIs d\'administration internes. Isolé du LAN — accessible uniquement via NPM après authentification Teleport.',
      services: ['Firefox containerisé', 'WebRTC', 'Accès UI admin'],
    },
  },

  // ── Niveau 4 : VLANs ─────────────────────────────────────
  {
    id: 'vlan20',
    type: 'custom',
    position: { x: 80, y: 700 },
    data: {
      label: 'VLAN 20 — APPS',
      type: 'zone',
      role: 'Segment applicatif / BYOD',
      description: '192.168.20.0/24 — Gateway 192.168.20.254. Héberge Proxmox PVE et les workspaces BYOD Kasm. Connexion physique en cours.',
      services: ['192.168.20.0/24', 'GW: .254', 'Proxmox', 'Kasm Workspaces'],
    },
  },
  {
    id: 'vlan30',
    type: 'custom',
    position: { x: 380, y: 700 },
    data: {
      label: 'VLAN 30 — SOC',
      type: 'zone',
      role: 'Segment SOC / monitoring',
      description: '192.168.30.0/24 — Gateway 192.168.30.254. Héberge Wazuh Manager, Grafana, Prometheus, Uptime Kuma. Isolé du reste du réseau.',
      services: ['192.168.30.0/24', 'GW: .254', 'Wazuh', 'Grafana/Prometheus'],
    },
  },

  // ── Niveau 5 : Hôtes physiques ───────────────────────────
  {
    id: 'apps-host',
    type: 'custom',
    position: { x: 80, y: 880 },
    data: {
      label: 'APPS (Proxmox)',
      type: 'host',
      role: 'Hyperviseur / Workspaces BYOD',
      description: 'ThinkCentre sous Proxmox VE (192.168.20.10). Héberge les VMs workspaces BYOD Kasm Workspaces (192.168.20.20). Connexion physique switch en cours.',
      services: ['Proxmox VE', 'Kasm Workspaces', 'IP: 192.168.20.10'],
    },
  },
  {
    id: 'soc-host',
    type: 'custom',
    position: { x: 380, y: 880 },
    data: {
      label: 'SOC',
      type: 'host',
      role: 'SIEM / Monitoring centralisé',
      description: 'ThinkCentre Tiny sous Debian (192.168.30.10). Héberge Wazuh Manager (SIEM), Grafana + Prometheus (métriques), Uptime Kuma (disponibilité). Agents node_exporter sur tous les hôtes.',
      services: ['Wazuh Manager', 'Grafana + Prometheus', 'Uptime Kuma', 'IP: 192.168.30.10'],
    },
  },
]

export const initialEdges = [
  { id: 'e1',  source: 'internet',  target: 'bastion',   label: 'HTTPS/TCP',     animated: true,  edgeType: 'filtered'  },
  { id: 'e2',  source: 'internet',  target: 'vpn-wg',    label: 'WireGuard/UDP', animated: false, edgeType: 'allowed'   },
  { id: 'e3',  source: 'internet',  target: 'vpn-xray',  label: 'VLESS/TCP443',  animated: false, edgeType: 'allowed'   },
  { id: 'e4',  source: 'vpn-wg',   target: 'bastion',   label: 'Tunnel',        animated: true,  edgeType: 'allowed'   },
  { id: 'e5',  source: 'vpn-xray', target: 'bastion',   label: 'Tunnel',        animated: true,  edgeType: 'allowed'   },
  { id: 'e6',  source: 'bastion',  target: 'openwrt',   label: 'virbr-mgmt',   animated: false, edgeType: 'allowed'   },
  { id: 'e7',  source: 'bastion',  target: 'npm',       label: 'HTTP/HTTPS',    animated: false, edgeType: 'allowed'   },
  { id: 'e8',  source: 'bastion',  target: 'crowdsec',  label: 'Logs/Analyse',  animated: false, edgeType: 'monitored' },
  { id: 'e9',  source: 'bastion',  target: 'adguard',   label: 'DNS',           animated: false, edgeType: 'allowed'   },
  { id: 'e10', source: 'npm',      target: 'teleport',  label: 'Proxy TLS',     animated: false, edgeType: 'allowed'   },
  { id: 'e11', source: 'npm',      target: 'neko',      label: 'Proxy TLS',     animated: false, edgeType: 'allowed'   },
  { id: 'e12', source: 'openwrt',  target: 'switch',    label: '802.1Q Trunk',  animated: false, edgeType: 'allowed'   },
  { id: 'e13', source: 'switch',   target: 'vlan20',    label: 'VLAN 20',       animated: false, edgeType: 'allowed'   },
  { id: 'e14', source: 'switch',   target: 'vlan30',    label: 'VLAN 30',       animated: false, edgeType: 'allowed'   },
  { id: 'e15', source: 'vlan20',   target: 'apps-host', label: 'LAN',           animated: false, edgeType: 'allowed'   },
  { id: 'e16', source: 'vlan30',   target: 'soc-host',  label: 'LAN',           animated: false, edgeType: 'allowed'   },
  { id: 'e17', source: 'teleport', target: 'vlan20',    label: 'SSH/App Proxy', animated: true,  edgeType: 'monitored' },
  { id: 'e18', source: 'teleport', target: 'vlan30',    label: 'SSH/App Proxy', animated: true,  edgeType: 'monitored' },
  { id: 'e19', source: 'crowdsec', target: 'bastion',   label: 'nftables ban',  animated: false, edgeType: 'monitored' },
  { id: 'e20', source: 'adguard',  target: 'vlan20',    label: 'DNS',           animated: false, edgeType: 'allowed'   },
  { id: 'e21', source: 'adguard',  target: 'vlan30',    label: 'DNS',           animated: false, edgeType: 'allowed'   },
]
