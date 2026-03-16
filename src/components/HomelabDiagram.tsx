'use client';

import { useState, useCallback, type FC } from 'react';

/* ═══════════════════════════════════════════
   Homelab Interactive Architecture Diagram
   ═══════════════════════════════════════════ */

interface ServiceNode {
  id: string;
  label: string;
  icon: string;
  category: 'infra' | 'media' | 'smart' | 'ai' | 'dev';
  x: number;
  y: number;
  desc: Record<string, string>;
  status?: 'running' | 'stopped';
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

const LABELS: Record<string, Record<string, string>> = {
  es: {
    title: 'Arquitectura en vivo',
    subtitle: 'Haz clic en un servicio para ver qué hace',
    infra: 'Infraestructura',
    media: 'Media',
    smart: 'Domótica',
    ai: 'IA & Agentes',
    dev: 'Desarrollo',
    running: 'Activo',
    stopped: 'Parado',
    services: 'servicios',
    clickHint: 'Selecciona un nodo',
  },
  en: {
    title: 'Live architecture',
    subtitle: 'Click a service to see what it does',
    infra: 'Infrastructure',
    media: 'Media',
    smart: 'Smart Home',
    ai: 'AI & Agents',
    dev: 'Development',
    running: 'Running',
    stopped: 'Stopped',
    services: 'services',
    clickHint: 'Select a node',
  },
  gl: {
    title: 'Arquitectura en vivo',
    subtitle: 'Fai clic nun servizo para ver que fai',
    infra: 'Infraestrutura',
    media: 'Media',
    smart: 'Domótica',
    ai: 'IA e Axentes',
    dev: 'Desenvolvemento',
    running: 'Activo',
    stopped: 'Parado',
    services: 'servizos',
    clickHint: 'Selecciona un nodo',
  },
};

const SERVICES: ServiceNode[] = [
  // Infrastructure layer (top)
  { id: 'nas', label: 'UGREEN NAS', icon: '🖥️', category: 'infra', x: 50, y: 8,
    desc: { es: 'Servidor central. Linux x86_64, Docker Compose, SSD+HDD. Todo corre aquí.', en: 'Central server. Linux x86_64, Docker Compose, SSD+HDD. Everything runs here.', gl: 'Servidor central. Linux x86_64, Docker Compose, SSD+HDD. Todo corre aquí.' }, status: 'running' },
  { id: 'tailscale', label: 'Tailscale', icon: '🔗', category: 'infra', x: 25, y: 8,
    desc: { es: 'VPN mesh: acceso remoto sin abrir puertos. Conecta todos mis dispositivos.', en: 'Mesh VPN: remote access without opening ports. Connects all my devices.', gl: 'VPN mesh: acceso remoto sen abrir portos. Conecta todos os meus dispositivos.' }, status: 'running' },
  { id: 'adguard', label: 'AdGuard', icon: '🛡️', category: 'infra', x: 75, y: 8,
    desc: { es: 'DNS privado: bloqueo de anuncios y trackers a nivel de red para todos los dispositivos.', en: 'Private DNS: network-level ad and tracker blocking for all devices.', gl: 'DNS privado: bloqueo de anuncios e trackers a nivel de rede para todos os dispositivos.' }, status: 'running' },
  { id: 'samba', label: 'Samba', icon: '📁', category: 'infra', x: 12, y: 24,
    desc: { es: 'Servidor de archivos: acceso compartido a media y backups desde cualquier dispositivo.', en: 'File server: shared access to media and backups from any device.', gl: 'Servidor de ficheiros: acceso compartido a media e backups desde calquera dispositivo.' }, status: 'running' },

  // Media layer (middle-left)
  { id: 'plex', label: 'Plex', icon: '🎬', category: 'media', x: 20, y: 48,
    desc: { es: 'Streaming de medios: mi Netflix personal con transcodificación hardware.', en: 'Media streaming: my personal Netflix with hardware transcoding.', gl: 'Streaming de medios: o meu Netflix persoal con transcodificación hardware.' }, status: 'running' },

  // Smart home (middle-right)
  { id: 'hass', label: 'Home Assistant', icon: '🏠', category: 'smart', x: 75, y: 40,
    desc: { es: 'Hub de domótica: persianas, luces, sensores. 3 protocolos (Zigbee, WiFi, miio).', en: 'Smart home hub: blinds, lights, sensors. 3 protocols (Zigbee, WiFi, miio).', gl: 'Hub de domótica: persianas, luces, sensores. 3 protocolos (Zigbee, WiFi, miio).' }, status: 'running' },
  { id: 'zigbee', label: 'Zigbee2MQTT', icon: '📡', category: 'smart', x: 90, y: 55,
    desc: { es: 'Bridge Zigbee: conecta dispositivos Zigbee sin depender de clouds propietarios.', en: 'Zigbee bridge: connects Zigbee devices without depending on proprietary clouds.', gl: 'Bridge Zigbee: conecta dispositivos Zigbee sen depender de clouds propietarios.' }, status: 'stopped' },
  { id: 'mosquitto', label: 'Mosquitto', icon: '📬', category: 'smart', x: 65, y: 55,
    desc: { es: 'Broker MQTT: mensajería entre Home Assistant y dispositivos IoT.', en: 'MQTT broker: messaging between Home Assistant and IoT devices.', gl: 'Broker MQTT: mensaxería entre Home Assistant e dispositivos IoT.' }, status: 'stopped' },

  // AI layer (bottom-right)
  { id: 'openclaw', label: 'OpenClaw', icon: '🐙', category: 'ai', x: 75, y: 78,
    desc: { es: 'Plataforma multi-agente: orquesta 5 agentes de IA especializados en tiempo real.', en: 'Multi-agent platform: orchestrates 5 specialized AI agents in real time.', gl: 'Plataforma multi-axente: orquestra 5 axentes de IA especializados en tempo real.' }, status: 'running' },
  { id: 'mahoraga', label: 'Mahoraga', icon: '📊', category: 'ai', x: 90, y: 90,
    desc: { es: 'Bot de trading: análisis de mercados y ejecución automática de operaciones.', en: 'Trading bot: market analysis and automated trade execution.', gl: 'Bot de trading: análise de mercados e execución automática de operacións.' }, status: 'stopped' },
];

const CONNECTIONS: Connection[] = [
  // Infra backbone
  { from: 'tailscale', to: 'nas' },
  { from: 'nas', to: 'adguard' },
  { from: 'nas', to: 'samba' },
  // Media
  { from: 'nas', to: 'plex' },
  // Smart home
  { from: 'hass', to: 'mosquitto' },
  { from: 'mosquitto', to: 'zigbee' },
  { from: 'nas', to: 'hass' },
  // AI
  { from: 'nas', to: 'openclaw' },
  { from: 'openclaw', to: 'mahoraga' },
];

const CATEGORY_COLORS: Record<string, string> = {
  infra: '#6b9ae8',
  media: '#e8866e',
  smart: '#5cc890',
  ai: '#b88acc',
  dev: '#e8c86e',
};

const STYLES = `
  .hlab-diagram {
    background: var(--bg-secondary, #1c2320);
    border: 1px solid var(--border, #333);
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 2rem 0;
    font-family: var(--font-body, 'DM Sans', sans-serif);
  }

  .hlab-diagram__title {
    font-family: var(--font-display, 'DM Sans', sans-serif);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .hlab-diagram__subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary, #888);
    margin-bottom: 1rem;
  }

  /* Legend */
  .hlab-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .hlab-legend__item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary, #888);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .hlab-legend__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  /* Canvas */
  .hlab-canvas {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 5;
    min-height: 180px;
  }

  .hlab-canvas svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* Node */
  .hlab-node {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    cursor: pointer;
    transform: translate(-50%, -50%);
    transition: transform 0.2s, opacity 0.2s;
    z-index: 2;
  }

  .hlab-node:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  .hlab-node--selected {
    transform: translate(-50%, -50%) scale(1.15);
  }

  .hlab-node--dimmed {
    opacity: 0.25;
  }

  .hlab-node__icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    border: 2px solid transparent;
    transition: border-color 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .hlab-node--selected .hlab-node__icon {
    box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
  }

  .hlab-node__status {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid var(--bg-secondary, #1c2320);
  }

  .hlab-node__label {
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--text-secondary, #888);
    text-align: center;
    white-space: nowrap;
    transition: color 0.2s;
  }

  .hlab-node--selected .hlab-node__label {
    color: var(--text-primary);
  }

  /* Detail panel */
  .hlab-detail {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: var(--bg-primary, #151b18);
    border: 1px solid var(--border, #333);
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    animation: hlab-fade 0.2s ease;
  }

  @keyframes hlab-fade {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hlab-detail__icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .hlab-detail__content {
    flex: 1;
  }

  .hlab-detail__name {
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--text-primary);
    margin-bottom: 0.15rem;
  }

  .hlab-detail__cat {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.35rem;
  }

  .hlab-detail__desc {
    font-size: 0.8125rem;
    color: var(--text-secondary, #888);
    line-height: 1.5;
  }

  .hlab-detail__status {
    font-size: 0.7rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.35rem;
  }

  .hlab-hint {
    text-align: center;
    font-size: 0.8125rem;
    color: var(--text-muted, #555);
    margin-top: 1rem;
    padding: 0.75rem;
  }

  @media (max-width: 640px) {
    .hlab-node__icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1rem;
    }
    .hlab-node__label { font-size: 0.5rem; }
    .hlab-canvas { aspect-ratio: 3 / 4; min-height: 300px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hlab-node, .hlab-detail { transition: none; animation: none; }
  }
`;

interface Props {
  lang?: string;
}

const HomelabDiagram: FC<Props> = ({ lang = 'es' }) => {
  const l = LABELS[lang] || LABELS.es;
  const [selected, setSelected] = useState<string | null>(null);
  const [hoverCat, setHoverCat] = useState<string | null>(null);

  const selectedNode = SERVICES.find(s => s.id === selected);

  // Get connected service IDs for highlighting
  const connectedIds = useCallback((id: string | null): Set<string> => {
    if (!id) return new Set();
    const s = new Set<string>([id]);
    CONNECTIONS.forEach(c => {
      if (c.from === id) s.add(c.to);
      if (c.to === id) s.add(c.from);
    });
    return s;
  }, []);

  const highlighted = connectedIds(selected);

  const categories = ['infra', 'media', 'smart', 'ai'] as const;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="hlab-diagram">
        <div className="hlab-diagram__title">{l.title}</div>
        <div className="hlab-diagram__subtitle">{l.subtitle}</div>

        {/* Legend */}
        <div className="hlab-legend">
          {categories.map(cat => (
            <div
              key={cat}
              className="hlab-legend__item"
              onMouseEnter={() => setHoverCat(cat)}
              onMouseLeave={() => setHoverCat(null)}
              style={{ opacity: hoverCat && hoverCat !== cat ? 0.4 : 1 }}
            >
              <div className="hlab-legend__dot" style={{ background: CATEGORY_COLORS[cat] }} />
              {l[cat]} ({SERVICES.filter(s => s.category === cat).length})
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="hlab-canvas">
          {/* Connection lines */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {CONNECTIONS.map((conn, i) => {
              const from = SERVICES.find(s => s.id === conn.from);
              const to = SERVICES.find(s => s.id === conn.to);
              if (!from || !to) return null;
              const isHighlighted = selected && (highlighted.has(conn.from) && highlighted.has(conn.to));
              const isDimmed = selected && !isHighlighted;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={isHighlighted ? CATEGORY_COLORS[from.category] : 'var(--border, #333)'}
                  strokeWidth={isHighlighted ? 0.4 : 0.2}
                  strokeOpacity={isDimmed ? 0.1 : isHighlighted ? 0.8 : 0.3}
                  strokeDasharray={isDimmed ? '1 1' : 'none'}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {SERVICES.map(service => {
            const isDimmed = (selected && !highlighted.has(service.id)) ||
                             (hoverCat && service.category !== hoverCat);
            const isSelected = selected === service.id;
            const color = CATEGORY_COLORS[service.category];

            return (
              <div
                key={service.id}
                className={`hlab-node ${isSelected ? 'hlab-node--selected' : ''} ${isDimmed ? 'hlab-node--dimmed' : ''}`}
                style={{ left: `${service.x}%`, top: `${service.y}%` }}
                onClick={() => setSelected(isSelected ? null : service.id)}
              >
                <div
                  className="hlab-node__icon"
                  style={{
                    background: `${color}18`,
                    borderColor: isSelected ? color : `${color}40`,
                  }}
                >
                  {service.icon}
                  <div
                    className="hlab-node__status"
                    style={{ background: service.status === 'running' ? '#5cc890' : '#666' }}
                  />
                </div>
                <span className="hlab-node__label">{service.label}</span>
              </div>
            );
          })}
        </div>

        {/* Detail panel or hint */}
        {selectedNode ? (
          <div className="hlab-detail" key={selectedNode.id}>
            <div className="hlab-detail__icon">{selectedNode.icon}</div>
            <div className="hlab-detail__content">
              <div className="hlab-detail__name">{selectedNode.label}</div>
              <div className="hlab-detail__cat" style={{ color: CATEGORY_COLORS[selectedNode.category] }}>
                {l[selectedNode.category]}
              </div>
              <div className="hlab-detail__desc">
                {selectedNode.desc[lang] || selectedNode.desc.es}
              </div>
              <div className="hlab-detail__status">
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: selectedNode.status === 'running' ? '#5cc890' : '#666',
                }} />
                <span style={{ color: selectedNode.status === 'running' ? '#5cc890' : '#888' }}>
                  {selectedNode.status === 'running' ? l.running : l.stopped}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="hlab-hint">{l.clickHint}</div>
        )}
      </div>
    </>
  );
};

export default HomelabDiagram;
