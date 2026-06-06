import { useCallback, useState, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  external: { color: '#f54b4b', label: 'Externe'     },
  security: { color: '#f5a623', label: 'Sécurité'    },
  zone:     { color: '#9b59f5', label: 'Zone réseau' },
  host:     { color: '#4b9ef5', label: 'Hôte'        },
  service:  { color: '#00e5a0', label: 'Service'      },
  mgmt:     { color: '#e5c300', label: 'Management'  },
}

// ─── NŒUD CUSTOM ─────────────────────────────────────────────────────────────
function CyberNode({ data }) {
  const cfg = TYPE_CONFIG[data.nodeType] || TYPE_CONFIG.host
  return (
    <div style={{
      background: 'var(--bg-surface, #16162a)',
      border: `1px solid ${cfg.color}`,
      borderRadius: '6px',
      padding: '8px 14px',
      minWidth: '120px',
      boxShadow: `0 0 10px ${cfg.color}33`,
      fontFamily: "'IBM Plex Mono', monospace",
      cursor: 'pointer',
    }}>
      <Handle type="target" position={Position.Top}  style={{ background: cfg.color, border: 'none', width: 8, height: 8 }} />
      <Handle type="target" position={Position.Left} style={{ background: cfg.color, border: 'none', width: 8, height: 8 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
        <span style={{ color: '#e8e8f0', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>
          {data.label}
        </span>
      </div>
      <div style={{ color: '#8888aa', fontSize: '9px', marginTop: 2, letterSpacing: '0.04em' }}>
        {data.role}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: cfg.color, border: 'none', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right}  style={{ background: cfg.color, border: 'none', width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { cyberNode: CyberNode }

// ─── POSITIONS FIXES PAR COUCHE ───────────────────────────────────────────────
const LAYER_Y  = [0, 120, 260, 400, 520, 640, 760, 900]
const CENTER_X = 500

// ─── DONNÉES ─────────────────────────────────────────────────────────────────
const RAW_NODES = [
  // Couche 0 — WAN
  { id: 'internet',   label: 'Internet / WAN',       nodeType: 'external', role: 'Source WAN',
    pos: { x: CENTER_X - 80,  y: LAYER_Y[0] },
    description: 'Trafic entrant depuis Internet. Ports acceptés : 80, 443, 53, WebRTC 52000–52100. Tout le reste est DROP en entrée nftables.' },

  // Couche 1 — Filtrage
  { id: 'box',        label: 'Box FAI / LAN',        nodeType: 'external', role: 'Gateway ISP · 192.168.1.0/24',
    pos: { x: CENTER_X - 300, y: LAYER_Y[1] },
    description: 'Routeur ISP, gateway 192.168.1.1. Gère le LAN 192.168.1.0/24. Ne supporte pas les routes statiques inter-VLAN. BASTION 192.168.1.30, OpenWRT WAN 192.168.1.31.' },
  { id: 'nftables',   label: 'nftables + CrowdSec',  nodeType: 'security', role: 'Filtrage périmétrique / IPS',
    pos: { x: CENTER_X + 120, y: LAYER_Y[1] },
    description: 'Firewall bare-metal sur le BASTION. Policy DROP sur br-wan, chain input_guard. CrowdSec injecte dynamiquement des règles de ban via crowdsec-firewall-bouncer-nftables.' },

  // Couche 2 — Hyperviseur central
  { id: 'bastion',    label: 'BASTION',               nodeType: 'host',     role: 'DMZ · Hyperviseur · Stack services',
    pos: { x: CENTER_X - 80,  y: LAYER_Y[2] },
    description: "ThinkCentre M700 SFF — Debian 13 bare-metal (192.168.1.30). Héberge la VM OpenWRT (KVM), la stack Docker (NPM, AdGuard, Teleport, Neko, Portainer) et CrowdSec. Sortie directe interdite par output_guard nftables." },

  // Couche 3 — Services
  { id: 'openwrt-vm', label: 'OpenWRT VM',            nodeType: 'security', role: 'Routeur inter-VLAN / DHCP / FW',
    pos: { x: CENTER_X - 340, y: LAYER_Y[3] },
    description: 'VM KVM/libvirt. Routage inter-VLAN router-on-a-stick, DHCP MAC-based par VLAN, NAT masquerade, firewall nftables LuCI. Pont virbr-mgmt 10.0.0.0/30 vers BASTION.' },
  { id: 'npm',        label: 'Nginx Proxy Manager',   nodeType: 'security', role: 'Reverse proxy TLS',
    pos: { x: CENTER_X - 60,  y: LAYER_Y[3] },
    description: "Reverse proxy TLS *.hegemonia.lan. PKI interne CA 10 ans. Tous les services passent par NPM. Port 81 (admin) filtré nftables — accessible uniquement depuis Neko." },
  { id: 'adguard',    label: 'AdGuard Home',          nodeType: 'service',  role: 'DNS interne / *.hegemonia.lan',
    pos: { x: CENTER_X + 220, y: LAYER_Y[3] },
    description: 'DNS resolver interne (port 53). Rewrite *.hegemonia.lan → 192.168.1.30. dnsmasq OpenWRT forward vers AdGuard pour tous les clients VLAN.' },

  // Couche 4 — Accès admin
  { id: 'neko',       label: 'Neko Firefox',          nodeType: 'mgmt',     role: 'Navigateur admin isolé',
    pos: { x: CENTER_X - 220, y: LAYER_Y[4] },
    description: "Firefox containerisé (host network). Seul point d'accès aux UIs admin (NPM:81, Portainer, AdGuard). WebRTC UDP 52000–52100 ouvert en nftables." },
  { id: 'teleport',   label: 'Teleport CE',           nodeType: 'mgmt',     role: 'Bastion SSH / App Access / CA',
    pos: { x: CENTER_X + 60,  y: LAYER_Y[4] },
    description: 'Teleport CE 18.7.2. Certificats SSH éphémères, proxy SSH + WebUI vers Wazuh et Proxmox. Accessible via NPM sur teleport.hegemonia.lan.' },

  // Couche 5 — Switch
  { id: 'horaco',     label: 'Switch HORACO',         nodeType: 'zone',     role: 'Commutation L2 · 802.1Q',
    pos: { x: CENTER_X - 80,  y: LAYER_Y[5] },
    description: 'HC-SWTGW218AS L2 manageable. Port 8 trunk → BASTION (VLANs 1/20/30). Port 2 access VLAN 20 → Proxmox. Port 3 access VLAN 30 → Wazuh.' },

  // Couche 6 — Zones VLAN
  { id: 'zone-vlan20',label: 'VLAN 20 — APPS',       nodeType: 'zone',     role: 'Zone applicative BYOD',
    pos: { x: CENTER_X - 280, y: LAYER_Y[6] },
    description: '192.168.20.0/24 — gateway 192.168.20.254. Proxmox PVE (192.168.20.10), Kasm Workspaces (192.168.20.20).' },
  { id: 'zone-vlan30',label: 'VLAN 30 — SOC',        nodeType: 'zone',     role: 'Zone SOC · Monitoring · SIEM',
    pos: { x: CENTER_X + 120, y: LAYER_Y[6] },
    description: '192.168.30.0/24 — gateway 192.168.30.254. Isolé du VLAN 20. Seuls flux agents Wazuh (1514) et proxys NPM autorisés en entrée.' },

  // Couche 7 — Hôtes physiques
  { id: 'proxmox',    label: 'Proxmox PVE',           nodeType: 'host',     role: 'Hyperviseur · Workspaces BYOD',
    pos: { x: CENTER_X - 280, y: LAYER_Y[7] },
    description: 'ThinkCentre Proxmox VE 9 (192.168.20.10). Kasm Workspaces (192.168.20.20). Connexion VLAN 20 en attente câblage rack.' },
  { id: 'wazuh-host', label: 'Wazuh Manager',         nodeType: 'host',     role: 'SIEM · Grafana · Prometheus',
    pos: { x: CENTER_X + 120, y: LAYER_Y[7] },
    description: "ThinkCentre Tiny Ubuntu (192.168.30.10). Wazuh SIEM, Grafana, Prometheus, Uptime Kuma. Reçoit les logs de tous les agents." },
]

const RAW_EDGES = [
  { id: 'e1',  source: 'internet',    target: 'box',         label: 'WAN',                    edgeType: 'allowed'   },
  { id: 'e2',  source: 'internet',    target: 'nftables',    label: 'Filtrage périmétrique',   edgeType: 'filtered'  },
  { id: 'e3',  source: 'box',         target: 'bastion',     label: 'HTTP/HTTPS/DNS',          edgeType: 'filtered'  },
  { id: 'e4',  source: 'nftables',    target: 'bastion',     label: '80/443/53 ACCEPT',        edgeType: 'filtered'  },
  { id: 'e5',  source: 'box',         target: 'npm',         label: 'HTTPS',                   edgeType: 'allowed'   },
  { id: 'e6',  source: 'box',         target: 'adguard',     label: 'DNS',                     edgeType: 'allowed'   },
  { id: 'e7',  source: 'bastion',     target: 'openwrt-vm',  label: 'virbr-mgmt /30',          edgeType: 'allowed'   },
  { id: 'e8',  source: 'bastion',     target: 'npm',         label: 'Stack Docker',            edgeType: 'allowed'   },
  { id: 'e9',  source: 'bastion',     target: 'adguard',     label: 'DNS interne',             edgeType: 'allowed'   },
  { id: 'e10', source: 'bastion',     target: 'wazuh-host',  label: 'Wazuh agent 1514',        edgeType: 'monitored' },
  { id: 'e11', source: 'openwrt-vm',  target: 'adguard',     label: 'DNS forward',             edgeType: 'allowed'   },
  { id: 'e12', source: 'openwrt-vm',  target: 'horaco',      label: 'Trunk 802.1Q 1/20/30',   edgeType: 'allowed'   },
  { id: 'e13', source: 'npm',         target: 'teleport',    label: 'HTTPS proxy',             edgeType: 'monitored' },
  { id: 'e14', source: 'npm',         target: 'neko',        label: 'HTTPS WebSocket',         edgeType: 'allowed'   },
  { id: 'e15', source: 'npm',         target: 'zone-vlan30', label: 'HTTPS Grafana/Kuma',      edgeType: 'monitored' },
  { id: 'e16', source: 'neko',        target: 'npm',         label: 'Admin UI :81',            edgeType: 'monitored' },
  { id: 'e17', source: 'teleport',    target: 'zone-vlan20', label: 'SSH / App Access',        edgeType: 'monitored' },
  { id: 'e18', source: 'teleport',    target: 'zone-vlan30', label: 'SSH / App Access',        edgeType: 'monitored' },
  { id: 'e19', source: 'horaco',      target: 'zone-vlan20', label: 'Access VLAN 20',          edgeType: 'allowed'   },
  { id: 'e20', source: 'horaco',      target: 'zone-vlan30', label: 'Access VLAN 30',          edgeType: 'allowed'   },
  { id: 'e21', source: 'zone-vlan20', target: 'proxmox',     label: '192.168.20.10',           edgeType: 'allowed'   },
  { id: 'e22', source: 'zone-vlan30', target: 'wazuh-host',  label: '192.168.30.10',           edgeType: 'allowed'   },
  { id: 'e23', source: 'proxmox',     target: 'wazuh-host',  label: 'Wazuh agent 1514',        edgeType: 'monitored' },
  { id: 'e24', source: 'wazuh-host',  target: 'bastion',     label: 'Prometheus scrape 9100',  edgeType: 'monitored' },
  { id: 'e25', source: 'zone-vlan20', target: 'zone-vlan30', label: 'Wazuh inter-VLAN',        edgeType: 'filtered'  },
]

const EDGE_STYLE = {
  allowed:   { stroke: '#9b59f5', strokeWidth: 1.5, strokeDasharray: undefined },
  filtered:  { stroke: '#f54b4b', strokeWidth: 2,   strokeDasharray: '5,3'     },
  monitored: { stroke: '#f5a623', strokeWidth: 1.5, strokeDasharray: '3,3'     },
}

// ─── BUILD REACT FLOW DATA (positions fixes, pas de dagre) ───────────────────
function buildFlowData() {
  const rfNodes = RAW_NODES.map(n => ({
    id:       n.id,
    type:     'cyberNode',
    data:     { label: n.label, role: n.role, nodeType: n.nodeType, description: n.description },
    position: n.pos,
  }))

  const rfEdges = RAW_EDGES.map(e => ({
    id:       e.id,
    source:   e.source,
    target:   e.target,
    label:    e.label,
    animated: e.edgeType !== 'filtered',
    style:    EDGE_STYLE[e.edgeType] || EDGE_STYLE.allowed,
    labelStyle:   { fill: '#8888aa', fontSize: 9, fontFamily: 'IBM Plex Mono' },
    labelBgStyle: { fill: '#10101a', fillOpacity: 0.85 },
    markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_STYLE[e.edgeType]?.stroke || '#9b59f5' },
  }))

  return { nodes: rfNodes, edges: rfEdges }
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function NetworkGraph() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildFlowData(), [])
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(prev => prev?.label === node.data.label ? null : node.data)
  }, [])

  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex' }}>
      <div style={{ flex: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={2}
          style={{ background: 'var(--bg-primary, #0a0a0f)' }}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          nodesDraggable={false}
          edgesUpdatable={false}
          nodesFocusable={false}
          connectOnClick={false}
        >
          <Background color="#2a2a42" gap={20} size={1} />
          <Controls style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px' }} />
          <MiniMap
            nodeColor={n => TYPE_CONFIG[n.data?.nodeType]?.color || '#9b59f5'}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          />
        </ReactFlow>

        {/* Légende intégrée */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 10,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '8px 14px',
          display: 'flex', gap: 14, flexWrap: 'wrap', maxWidth: '480px',
        }}>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color }} />
              <span style={{ color: '#8888aa', fontSize: 9, fontFamily: 'IBM Plex Mono' }}>{cfg.label}</span>
            </div>
          ))}
          <div style={{ width: '1px', background: 'var(--border)', margin: '0 2px' }} />
          {[
            { label: 'Autorisé',   color: '#9b59f5', dash: false },
            { label: 'Filtré',    color: '#f54b4b', dash: true  },
            { label: 'Surveillé', color: '#f5a623', dash: true  },
          ].map(e => (
            <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 16, height: 2,
                background: e.dash
                  ? `repeating-linear-gradient(to right, ${e.color} 0, ${e.color} 4px, transparent 4px, transparent 7px)`
                  : e.color,
              }} />
              <span style={{ color: '#8888aa', fontSize: 9, fontFamily: 'IBM Plex Mono' }}>{e.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel détail nœud */}
      {selectedNode && (
        <div style={{
          width: 280, height: '100%', padding: 20, overflowY: 'auto',
          background: 'var(--bg-secondary)', borderLeft: `1px solid ${TYPE_CONFIG[selectedNode.nodeType]?.color || 'var(--border)'}`,
          fontFamily: 'IBM Plex Mono', display: 'flex', flexDirection: 'column', gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: TYPE_CONFIG[selectedNode.nodeType]?.color, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                {TYPE_CONFIG[selectedNode.nodeType]?.label}
              </div>
              <div style={{ color: '#e8e8f0', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>
                {selectedNode.label}
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ background: 'none', border: 'none', color: '#8888aa', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
          <div style={{ color: '#8888aa', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
            {selectedNode.role}
          </div>
          <div style={{ color: '#c8c8d8', fontSize: 11, lineHeight: 1.7 }}>
            {selectedNode.description}
          </div>
        </div>
      )}
    </div>
  )
}
