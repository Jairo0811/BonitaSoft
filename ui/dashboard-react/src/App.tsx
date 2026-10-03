import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AccessRequest, AccessRequestCreate, DashboardStats, api } from './api';

type UiStatus = 'Completada' | 'En progreso' | 'Pendiente' | 'Rechazada' | 'Error';

type CaseRow = {
  id: string;
  requester: string;
  system: string;
  status: UiStatus;
  started: string;
  duration: string;
  externalReference?: string | null;
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

const performance = [58, 72, 66, 83, 76, 91, 88, 96, 79, 87, 93, 84];

const EMPTY_FORM: AccessRequestCreate = {
  requester_name: '',
  user_email: '',
  system: '',
  access_level: 'Estándar',
  justification: '',
};

const toUiStatus = (status: AccessRequest['status']): UiStatus => {
  if (status === 'COMPLETED') return 'Completada';
  if (status === 'IN_PROGRESS') return 'En progreso';
  if (status === 'PENDING_APPROVAL') return 'Pendiente';
  if (status === 'REJECTED') return 'Rechazada';
  return 'Error';
};

const statusClass = (status: UiStatus) => {
  if (status === 'Completada') return 'success';
  if (status === 'Rechazada' || status === 'Error') return 'danger';
  if (status === 'Pendiente') return 'warning';
  return 'info';
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const formatDuration = (start: string, end: string) => {
  const minutes = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tareas');
  const [notice, setNotice] = useState('');
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, completed: 0, in_progress: 0, pending: 0, rejected: 0, error: 0, rest_requests: 0 });
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AccessRequestCreate>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4200);
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      await api.health();
      setApiOnline(true);
      const [requestRows, dashboardStats] = await Promise.all([api.listRequests(), api.stats()]);
      setRequests(requestRows);
      setStats(dashboardStats);
    } catch (error) {
      setApiOnline(false);
      showNotice(`No se pudo conectar con la API local: ${error instanceof Error ? error.message : 'error desconocido'}`);
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const cases = useMemo<CaseRow[]>(() => requests.map((item) => ({
    id: item.id,
    requester: item.requester_name,
    system: item.system,
    status: toUiStatus(item.status),
    started: formatDate(item.created_at),
    duration: item.status === 'PENDING_APPROVAL' ? '—' : formatDuration(item.created_at, item.updated_at),
    externalReference: item.external_reference,
  })), [requests]);

  const filteredCases = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return cases;
    return cases.filter((item) =>
      [item.id, item.requester, item.system, item.status, item.externalReference ?? ''].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [cases, query]);

  const actionableRequests = useMemo(
    () => requests.filter((item) => item.status === 'PENDING_APPROVAL' || item.status === 'ERROR'),
    [requests],
  );

  const today = new Intl.DateTimeFormat('es-DO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const totalForPercent = Math.max(stats.total, 1);
  const completedPercent = Math.round((stats.completed / totalForPercent) * 100);
  const pendingPercent = Math.round((stats.pending / totalForPercent) * 100);
  const problemPercent = Math.round(((stats.rejected + stats.error) / totalForPercent) * 100);
  const progressPercent = Math.max(0, 100 - completedPercent - pendingPercent - problemPercent);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createRequest(form);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      showNotice(`Solicitud ${created.id} creada y enviada a aprobación.`);
      await loadDashboard();
    } catch (error) {
      showNotice(`No se pudo crear la solicitud: ${error instanceof Error ? error.message : 'error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const performAction = async (id: string, action: 'approve' | 'reject' | 'retry') => {
    setBusyId(id);
    try {
      if (action === 'approve') {
        const updated = await api.approveRequest(id);
        showNotice(`${id} aprobada y aprovisionada. Ref: ${updated.external_reference ?? 'N/D'}`);
      } else if (action === 'reject') {
        await api.rejectRequest(id);
        showNotice(`${id} rechazada correctamente.`);
      } else {
        const updated = await api.retryRequest(id);
        showNotice(`${id} reintentada y completada. Ref: ${updated.external_reference ?? 'N/D'}`);
      }
      await loadDashboard();
    } catch (error) {
      showNotice(`Acción fallida para ${id}: ${error instanceof Error ? error.message : 'error desconocido'}`);
    } finally {
      setBusyId('');
    }
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
            <button key={label} className={`nav-item ${activeNav === label ? 'is-active' : ''}`} onClick={() => setActiveNav(label)} type="button">
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              {label === 'Mis tareas' && <strong className="nav-badge">{actionableRequests.length}</strong>}
            </button>
          ))}
        </nav>

        <div className="quick-access">
          <p>Acceso rápido</p>
          <button type="button" onClick={() => setModalOpen(true)}>＋ Nueva solicitud</button>
          <button type="button" onClick={() => setActiveNav('Mis tareas')}>▷ Mis aprobaciones</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar casos, usuarios, sistemas..." aria-label="Buscar" />
          </label>

          <div className="topbar-actions">
            <button className={`runtime-pill runtime-button ${apiOnline ? '' : 'offline'}`} type="button" onClick={() => void loadDashboard()}>
              <i /> {apiOnline ? 'Mock API online' : 'Mock API offline'}
            </button>
            <button className="icon-button" type="button" aria-label="Actualizar" onClick={() => void loadDashboard()}>↻</button>
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
              <span className="eyebrow">Panel de control · API local conectada</span>
              <h1>Gestión BPM de solicitudes de acceso</h1>
              <p>Solicitudes, aprobación humana, aprovisionamiento REST y trazabilidad local.</p>
            </div>
            <div className="heading-actions">
              <span className="date-label">{today}</span>
              <button className="primary-action" type="button" onClick={() => setModalOpen(true)}>Nueva solicitud</button>
            </div>
          </div>

          <section className="metric-grid" aria-label="Indicadores principales">
            <article className="metric-card blue"><div className="metric-icon">▤</div><div><span>Instancias totales</span><strong>{stats.total}</strong><small>{loading ? 'Actualizando...' : 'Datos de la API'}</small></div></article>
            <article className="metric-card green"><div className="metric-icon">✓</div><div><span>Completadas</span><strong>{stats.completed}</strong><small>{completedPercent}% del total</small></div></article>
            <article className="metric-card red"><div className="metric-icon">◷</div><div><span>Pendientes</span><strong>{stats.pending}</strong><small>{stats.error} con error</small></div></article>
            <article className="metric-card blue"><div className="metric-icon">↔</div><div><span>Integraciones REST</span><strong>{stats.rest_requests}</strong><small>aprovisionamientos reales de la sesión</small></div></article>
          </section>

          <section className="analytics-grid">
            <article className="panel performance-panel">
              <div className="panel-title"><div><span>Rendimiento</span><small>Serie visual histórica de demostración</small></div><button type="button">Ver analítica →</button></div>
              <div className="bar-chart" aria-label="Gráfico de rendimiento demostrativo">
                {performance.map((height, index) => <div className="bar-column" key={`${height}-${index}`}><span className="bar-fill" style={{ height: `${height}%` }} />{index % 3 === 0 && <small>{index + 1}</small>}</div>)}
              </div>
              <div className="chart-legend"><span><i className="legend-blue" /> Completadas</span><span><i className="legend-red" /> En revisión / error</span></div>
            </article>

            <article className="panel status-panel">
              <div className="panel-title"><div><span>Estado del proceso</span><small>Distribución desde la API</small></div></div>
              <div className="status-content">
                <div className="donut" style={{ background: `conic-gradient(#2f80ff 0 ${completedPercent}%, #ff1744 ${completedPercent}% ${completedPercent + progressPercent}%, #f59e0b ${completedPercent + progressPercent}% ${completedPercent + progressPercent + pendingPercent}%, #8fa6d8 ${completedPercent + progressPercent + pendingPercent}% 100%)` }}><span><strong>{stats.total}</strong><small>Total</small></span></div>
                <div className="status-list">
                  <span><i className="dot blue-dot" /> Completadas <b>{completedPercent}%</b></span>
                  <span><i className="dot red-dot" /> En progreso <b>{progressPercent}%</b></span>
                  <span><i className="dot amber-dot" /> Pendientes <b>{pendingPercent}%</b></span>
                  <span><i className="dot gray-dot" /> Rechazo/Error <b>{problemPercent}%</b></span>
                </div>
              </div>
            </article>

            <article className="panel integration-panel">
              <div className="panel-title"><div><span>Integración</span><small>Servicio auxiliar FastAPI</small></div></div>
              <div className={`api-health ${apiOnline ? '' : 'api-offline'}`}><span className="pulse" /><div><strong>REST /provision</strong><small>Estado: {apiOnline ? 'disponible' : 'sin conexión'}</small></div></div>
              <div className="api-stats"><span><b>{stats.rest_requests}</b><small>requests</small></span><span><b>{stats.pending}</b><small>pendientes</small></span><span><b>{stats.error}</b><small>errores</small></span></div>
              <code>POST {api.baseUrl}/provision</code>
            </article>
          </section>

          <section className="workspace-grid">
            <article className="panel process-panel">
              <div className="panel-title"><div><span>Flujo activo</span><small>Solicitud de acceso a sistema corporativo</small></div><span className="live-badge">● LIVE LOCAL</span></div>
              <div className="process-flow" aria-label="Flujo BPM demostrativo">
                <div className="flow-node start"><b>▶</b><span>Inicio<small>Solicitud recibida</small></span></div><span className="connector">→</span>
                <div className="flow-node"><b>✓</b><span>Validación<small>Datos y contrato</small></span></div><span className="connector">→</span>
                <div className="flow-node active"><b>♙</b><span>Aprobación<small>Tarea humana</small></span></div><span className="connector">→</span>
                <div className="gateway"><span>?</span><small>¿Aprobada?</small></div>
                <div className="branch approved"><span>sí →</span><div className="flow-node"><b>↔</b><span>REST<small>/provision</small></span></div><span>→</span><div className="flow-node done"><b>✓</b><span>Cierre<small>Auditoría</small></span></div></div>
                <div className="branch rejected"><span>no →</span><div className="flow-node reject"><b>×</b><span>Rechazo<small>Notificación</small></span></div></div>
              </div>
            </article>

            <article className="panel tasks-panel">
              <div className="tabs" role="tablist">
                {['Tareas', 'Aprobaciones', 'Casos'].map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}{tab === 'Tareas' && <b>{actionableRequests.length}</b>}</button>)}
              </div>
              <div className="task-list">
                {actionableRequests.length === 0 && <p className="empty-state">No hay tareas pendientes.</p>}
                {actionableRequests.slice(0, 5).map((item) => (
                  <div className="task-row task-row-live" key={item.id}>
                    <span className="task-check" />
                    <span className="task-copy"><strong>{item.status === 'ERROR' ? `Reintentar ${item.id}` : `Aprobar ${item.id}`}</strong><small>{item.system} · {item.access_level}</small></span>
                    <div className="task-actions">
                      {item.status === 'ERROR' ? (
                        <button type="button" className="mini-action retry" disabled={busyId === item.id} onClick={() => void performAction(item.id, 'retry')}>Reintentar</button>
                      ) : (
                        <>
                          <button type="button" className="mini-action approve" disabled={busyId === item.id} onClick={() => void performAction(item.id, 'approve')}>Aprobar</button>
                          <button type="button" className="mini-action reject" disabled={busyId === item.id} onClick={() => void performAction(item.id, 'reject')}>Rechazar</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <article className="panel table-panel">
            <div className="panel-title"><div><span>Instancias recientes</span><small>{filteredCases.length} resultados visibles</small></div><span className="demo-label">API local</span></div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>ID</th><th>Solicitante</th><th>Sistema</th><th>Estado</th><th>Inicio</th><th>Duración</th><th>Referencia</th></tr></thead>
                <tbody>
                  {filteredCases.map((item) => <tr key={item.id}><td className="case-id">{item.id}</td><td>{item.requester}</td><td>{item.system}</td><td><span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span></td><td>{item.started}</td><td>{item.duration}</td><td>{item.externalReference ?? '—'}</td></tr>)}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => !submitting && setModalOpen(false)}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="new-request-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><span className="eyebrow">Nueva instancia</span><h2 id="new-request-title">Solicitud de acceso</h2></div><button type="button" onClick={() => setModalOpen(false)} aria-label="Cerrar">×</button></div>
            <form className="request-form" onSubmit={handleCreate}>
              <label>Solicitante<input required minLength={2} value={form.requester_name} onChange={(event) => setForm({ ...form, requester_name: event.target.value })} /></label>
              <label>Correo<input required type="email" value={form.user_email} onChange={(event) => setForm({ ...form, user_email: event.target.value })} /></label>
              <label>Sistema<input required minLength={2} placeholder="Ej. ERP Finanzas" value={form.system} onChange={(event) => setForm({ ...form, system: event.target.value })} /></label>
              <label>Nivel de acceso<select value={form.access_level} onChange={(event) => setForm({ ...form, access_level: event.target.value })}><option>Lectura</option><option>Estándar</option><option>Operación</option><option>Supervisor</option><option>Administración</option></select></label>
              <label className="full-field">Justificación<textarea required minLength={3} rows={4} value={form.justification} onChange={(event) => setForm({ ...form, justification: event.target.value })} /></label>
              <div className="modal-actions"><button type="button" className="secondary-action" onClick={() => setModalOpen(false)} disabled={submitting}>Cancelar</button><button type="submit" className="primary-action" disabled={submitting}>{submitting ? 'Creando...' : 'Crear solicitud'}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
