import { useMemo, useState } from 'react';

type Status = 'Completada' | 'En progreso' | 'Pendiente' | 'Rechazada' | 'Error';

type CaseRow = {
  id: string;
  requester: string;
  system: string;
  status: Status;
  started: string;
  duration: string;
};

const navItems = [
  ['Dashboard', '▦'],
  ['Mis tareas', '✓'],
  ['Procesos', '◇'],
  ['Casos', '□'],
  ['Diseño BPMN', '⌘'],
  ['Integraciones', '↔'],
  ['Auditoría', '◎'],
  ['Usuarios', '♙'],
] as const;

const cases: CaseRow[] = [
  { id: 'SA-1048', requester: 'Ana Pérez', system: 'ERP Finanzas', status: 'Completada', started: '03 Oct · 09:14', duration: '18 min' },
  { id: 'SA-1047', requester: 'Carlos Díaz', system: 'Mesa de Ayuda', status: 'En progreso', started: '03 Oct · 08:32', duration: '42 min' },
  { id: 'SA-1046', requester: 'María Santos', system: 'Gestión Documental', status: 'Pendiente', started: '02 Oct · 16:18', duration: '—' },
  { id: 'SA-1045', requester: 'Luis Méndez', system: 'Portal Interno', status: 'Rechazada', started: '02 Oct · 11:03', duration: '26 min' },
  { id: 'SA-1044', requester: 'Elena Ruiz', system: 'Inventario', status: 'Error', started: '01 Oct · 14:41', duration: '12 min' },
];

const tasks = [
  { title: 'Aprobar solicitud SA-1047', meta: 'Mesa de Ayuda · Acceso estándar', priority: 'Alta', tone: 'danger' },
  { title: 'Revisar solicitud SA-1046', meta: 'Gestión Documental · Rol supervisor', priority: 'Media', tone: 'warning' },
  { title: 'Validar error SA-1044', meta: 'Inventario · REST /provision', priority: 'Alta', tone: 'danger' },
  { title: 'Auditar cierre SA-1043', meta: 'Portal Interno · Caso completado', priority: 'Baja', tone: 'info' },
];

const performance = [58, 72, 66, 83, 76, 91, 88, 96, 79, 87, 93, 84];

const statusClass = (status: Status) => {
  if (status === 'Completada') return 'success';
  if (status === 'Rechazada' || status === 'Error') return 'danger';
  if (status === 'Pendiente') return 'warning';
  return 'info';
};

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tareas');
  const [notice, setNotice] = useState('');

  const filteredCases = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return cases;
    return cases.filter((item) =>
      [item.id, item.requester, item.system, item.status].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [query]);

  const today = new Intl.DateTimeFormat('es-DO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const createDemoRequest = () => {
    setNotice('Demo: la nueva solicitud se conectará al formulario de Bonita cuando el runtime quede validado.');
    window.setTimeout(() => setNotice(''), 4200);
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="brand" aria-label="BonitaSoft">
          <span className="brand-mark" aria-hidden="true">b</span>
          <span className="brand-name">Bonita<span>Soft</span></span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          {navItems.map(([label, icon]) => (
            <button
              key={label}
              className={`nav-item ${activeNav === label ? 'is-active' : ''}`}
              onClick={() => setActiveNav(label)}
              type="button"
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              {label === 'Mis tareas' && <strong className="nav-badge">4</strong>}
            </button>
          ))}
        </nav>

        <div className="quick-access">
          <p>Acceso rápido</p>
          <button type="button" onClick={createDemoRequest}>＋ Nueva solicitud</button>
          <button type="button" onClick={() => setActiveNav('Mis tareas')}>▷ Mis aprobaciones</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar casos, usuarios, sistemas..."
              aria-label="Buscar"
            />
          </label>

          <div className="topbar-actions">
            <span className="runtime-pill"><i /> Mock API online</span>
            <button className="icon-button" type="button" aria-label="Notificaciones">●</button>
            <div className="profile">
              <span className="avatar">ISO</span>
              <span><strong>Equipo ISO-815</strong><small>BonitaSoft BPM</small></span>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          {notice && <div className="notice" role="status">{notice}</div>}

          <div className="page-heading">
            <div>
              <span className="eyebrow">Panel de control · Datos de demostración</span>
              <h1>Gestión BPM de solicitudes de acceso</h1>
              <p>Seguimiento del proceso, aprobaciones humanas, integración REST y trazabilidad.</p>
            </div>
            <div className="heading-actions">
              <span className="date-label">{today}</span>
              <button className="primary-action" type="button" onClick={createDemoRequest}>Nueva solicitud</button>
            </div>
          </div>

          <section className="metric-grid" aria-label="Indicadores principales">
            <article className="metric-card blue">
              <div className="metric-icon">▤</div>
              <div><span>Instancias totales</span><strong>128</strong><small>↑ 12% este período</small></div>
            </article>
            <article className="metric-card green">
              <div className="metric-icon">✓</div>
              <div><span>Completadas</span><strong>92</strong><small>71.9% del total</small></div>
            </article>
            <article className="metric-card red">
              <div className="metric-icon">◷</div>
              <div><span>En progreso</span><strong>24</strong><small>4 esperan aprobación</small></div>
            </article>
            <article className="metric-card blue">
              <div className="metric-icon">↔</div>
              <div><span>Integraciones REST</span><strong>117</strong><small>96.7% exitosas</small></div>
            </article>
          </section>

          <section className="analytics-grid">
            <article className="panel performance-panel">
              <div className="panel-title"><div><span>Rendimiento</span><small>Casos procesados por intervalo</small></div><button type="button">Ver analítica →</button></div>
              <div className="bar-chart" aria-label="Gráfico de rendimiento de demostración">
                {performance.map((height, index) => (
                  <div className="bar-column" key={`${height}-${index}`}>
                    <span className="bar-fill" style={{ height: `${height}%` }} />
                    {index % 3 === 0 && <small>{index + 1}</small>}
                  </div>
                ))}
              </div>
              <div className="chart-legend"><span><i className="legend-blue" /> Completadas</span><span><i className="legend-red" /> En revisión / error</span></div>
            </article>

            <article className="panel status-panel">
              <div className="panel-title"><div><span>Estado del proceso</span><small>Distribución de instancias</small></div></div>
              <div className="status-content">
                <div className="donut"><span><strong>128</strong><small>Total</small></span></div>
                <div className="status-list">
                  <span><i className="dot blue-dot" /> Completadas <b>72%</b></span>
                  <span><i className="dot red-dot" /> En progreso <b>19%</b></span>
                  <span><i className="dot amber-dot" /> Pendientes <b>6%</b></span>
                  <span><i className="dot gray-dot" /> Error <b>3%</b></span>
                </div>
              </div>
            </article>

            <article className="panel integration-panel">
              <div className="panel-title"><div><span>Integración</span><small>Servicio auxiliar FastAPI</small></div></div>
              <div className="api-health"><span className="pulse" /><div><strong>REST /provision</strong><small>Estado: disponible</small></div></div>
              <div className="api-stats"><span><b>117</b><small>requests</small></span><span><b>4</b><small>reintentos</small></span><span><b>1.2s</b><small>respuesta media</small></span></div>
              <code>POST http://localhost:8000/provision</code>
            </article>
          </section>

          <section className="workspace-grid">
            <article className="panel process-panel">
              <div className="panel-title">
                <div><span>Flujo activo</span><small>Solicitud de acceso a sistema corporativo</small></div>
                <span className="live-badge">● LIVE DEMO</span>
              </div>
              <div className="process-flow" aria-label="Flujo BPM demostrativo">
                <div className="flow-node start"><b>▶</b><span>Inicio<small>Solicitud recibida</small></span></div>
                <span className="connector">→</span>
                <div className="flow-node"><b>✓</b><span>Validación<small>Datos y contrato</small></span></div>
                <span className="connector">→</span>
                <div className="flow-node active"><b>♙</b><span>Aprobación<small>Tarea humana</small></span></div>
                <span className="connector">→</span>
                <div className="gateway"><span>?</span><small>¿Aprobada?</small></div>
                <div className="branch approved"><span>sí →</span><div className="flow-node"><b>↔</b><span>REST<small>/provision</small></span></div><span>→</span><div className="flow-node done"><b>✓</b><span>Cierre<small>Auditoría</small></span></div></div>
                <div className="branch rejected"><span>no →</span><div className="flow-node reject"><b>×</b><span>Rechazo<small>Notificación</small></span></div></div>
              </div>
            </article>

            <article className="panel tasks-panel">
              <div className="tabs" role="tablist">
                {['Tareas', 'Aprobaciones', 'Casos'].map((tab) => (
                  <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}{tab === 'Tareas' && <b>4</b>}</button>
                ))}
              </div>
              <div className="task-list">
                {tasks.map((task) => (
                  <button className="task-row" type="button" key={task.title} onClick={() => setNotice(`${task.title}: vista detallada disponible en la siguiente iteración.`)}>
                    <span className="task-check" />
                    <span className="task-copy"><strong>{task.title}</strong><small>{task.meta}</small></span>
                    <span className={`priority ${task.tone}`}>{task.priority}</span>
                  </button>
                ))}
              </div>
            </article>
          </section>

          <article className="panel table-panel">
            <div className="panel-title">
              <div><span>Instancias recientes</span><small>{filteredCases.length} resultados visibles</small></div>
              <span className="demo-label">Dataset demostrativo</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>ID</th><th>Solicitante</th><th>Sistema</th><th>Estado</th><th>Inicio</th><th>Duración</th></tr></thead>
                <tbody>
                  {filteredCases.map((item) => (
                    <tr key={item.id}>
                      <td className="case-id">{item.id}</td>
                      <td>{item.requester}</td>
                      <td>{item.system}</td>
                      <td><span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                      <td>{item.started}</td>
                      <td>{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
