import { useMemo, useState } from 'react';
import { api } from './api';
import type {
  AccessRequest,
  AuditRecord,
  DashboardStats,
  RequestEvent,
  RequestStatus,
  UserSummary,
} from './api';

type Action = 'approve' | 'reject' | 'retry';

type CommonProps = {
  requests: AccessRequest[];
  stats: DashboardStats;
  auditRecords: AuditRecord[];
  users: UserSummary[];
  query: string;
  apiOnline: boolean;
  busyId: string;
  onAction: (id: string, action: Action) => Promise<void>;
  onNewRequest: () => void;
  onRefresh: () => Promise<void>;
};

const statusLabel: Record<RequestStatus, string> = {
  PENDING_APPROVAL: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  REJECTED: 'Rechazada',
  ERROR: 'Error',
};

const statusTone: Record<RequestStatus, string> = {
  PENDING_APPROVAL: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  REJECTED: 'danger',
  ERROR: 'danger',
};

const eventLabel: Record<string, string> = {
  REQUEST_CREATED: 'Solicitud creada',
  APPROVED: 'Aprobación humana',
  RETRY_STARTED: 'Reintento iniciado',
  PROVISIONED: 'Aprovisionamiento completado',
  PROVISION_FAILED: 'Error de integración',
  REJECTED: 'Solicitud rechazada',
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const requestMatches = (request: AccessRequest, query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    request.id,
    request.requester_name,
    request.user_email,
    request.system,
    request.access_level,
    request.status,
    request.external_reference ?? '',
  ].some((value) => value.toLowerCase().includes(normalized));
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`status-badge ${statusTone[status]}`}>{statusLabel[status]}</span>;
}

function RequestActions({ request, busyId, onAction }: Pick<CommonProps, 'busyId' | 'onAction'> & { request: AccessRequest }) {
  const disabled = busyId === request.id;
  if (request.status === 'PENDING_APPROVAL') {
    return (
      <div className="task-actions">
        <button className="mini-action approve" type="button" disabled={disabled} onClick={() => void onAction(request.id, 'approve')}>Aprobar</button>
        <button className="mini-action reject" type="button" disabled={disabled} onClick={() => void onAction(request.id, 'reject')}>Rechazar</button>
      </div>
    );
  }
  if (request.status === 'ERROR') {
    return <button className="mini-action retry" type="button" disabled={disabled} onClick={() => void onAction(request.id, 'retry')}>Reintentar</button>;
  }
  return null;
}

export function DashboardView(props: CommonProps) {
  const { requests, stats, auditRecords, apiOnline, busyId, onAction } = props;
  const total = Math.max(stats.total, 1);
  const completedPercent = Math.round((stats.completed / total) * 100);
  const pendingPercent = Math.round((stats.pending / total) * 100);
  const problemPercent = Math.round(((stats.rejected + stats.error) / total) * 100);
  const progressPercent = Math.max(0, 100 - completedPercent - pendingPercent - problemPercent);
  const actionable = requests.filter((item) => item.status === 'PENDING_APPROVAL' || item.status === 'ERROR').slice(0, 4);
  const recent = requests.slice(0, 6);
  const performance = [58, 72, 66, 83, 76, 91, 88, 96, 79, 87, 93, 84];

  return (
    <>
      <section className="metric-grid" aria-label="Indicadores principales">
        <article className="metric-card blue"><div className="metric-icon">▤</div><div><span>Instancias totales</span><strong>{stats.total}</strong><small>Persistidas en SQLite</small></div></article>
        <article className="metric-card green"><div className="metric-icon">✓</div><div><span>Completadas</span><strong>{stats.completed}</strong><small>{completedPercent}% del total</small></div></article>
        <article className="metric-card red"><div className="metric-icon">◷</div><div><span>Pendientes</span><strong>{stats.pending}</strong><small>{stats.error} con error</small></div></article>
        <article className="metric-card blue"><div className="metric-icon">↔</div><div><span>Integraciones REST</span><strong>{stats.rest_requests}</strong><small>{auditRecords.length} registros persistentes</small></div></article>
      </section>

      <section className="analytics-grid">
        <article className="panel performance-panel">
          <div className="panel-title"><div><span>Rendimiento</span><small>Serie visual histórica de demostración</small></div></div>
          <div className="bar-chart" aria-label="Gráfico de rendimiento demostrativo">
            {performance.map((height, index) => <div className="bar-column" key={`${height}-${index}`}><span className="bar-fill" style={{ height: `${height}%` }} />{index % 3 === 0 && <small>{index + 1}</small>}</div>)}
          </div>
          <div className="chart-legend"><span><i className="legend-blue" /> Completadas</span><span><i className="legend-red" /> En revisión / error</span></div>
        </article>

        <article className="panel status-panel">
          <div className="panel-title"><div><span>Estado del proceso</span><small>Distribución desde SQLite</small></div></div>
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
          <ProcessFlow />
        </article>

        <article className="panel tasks-panel">
          <div className="panel-title"><div><span>Tareas pendientes</span><small>{actionable.length} visibles</small></div></div>
          <div className="task-list">
            {actionable.length === 0 && <p className="empty-state">No hay tareas pendientes.</p>}
            {actionable.map((request) => (
              <div className="task-row task-row-live" key={request.id}>
                <span className="task-check" />
                <span className="task-copy"><strong>{request.status === 'ERROR' ? 'Reintentar' : 'Aprobar'} {request.id}</strong><small>{request.system} · {request.access_level}</small></span>
                <RequestActions request={request} busyId={busyId} onAction={onAction} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <article className="panel table-panel">
        <div className="panel-title"><div><span>Instancias recientes</span><small>{recent.length} resultados</small></div></div>
        <RequestTable requests={recent} busyId={busyId} onAction={onAction} showActions={false} />
      </article>
    </>
  );
}

export function TasksView(props: CommonProps) {
  const actionable = props.requests.filter((item) => item.status === 'PENDING_APPROVAL' || item.status === 'ERROR').filter((item) => requestMatches(item, props.query));
  return (
    <div className="section-stack">
      <section className="section-summary-grid">
        <SummaryCard label="Pendientes de aprobación" value={props.stats.pending} icon="✓" tone="warning" />
        <SummaryCard label="Errores reintentables" value={props.stats.error} icon="↻" tone="danger" />
        <SummaryCard label="Total de tareas" value={actionable.length} icon="▤" tone="blue" />
      </section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Mi bandeja de tareas</span><small>Acciones humanas del proceso</small></div></div>
        <div className="large-task-list">
          {actionable.length === 0 && <EmptyPanel title="Sin tareas" text="No hay solicitudes pendientes ni errores por reintentar." />}
          {actionable.map((request) => (
            <div className="task-card" key={request.id}>
              <div className="task-card-main">
                <span className={`task-card-icon ${request.status === 'ERROR' ? 'error' : ''}`}>{request.status === 'ERROR' ? '!' : '✓'}</span>
                <div><strong>{request.id} · {request.requester_name}</strong><small>{request.system} · {request.access_level}</small><p>{request.justification}</p></div>
              </div>
              <div className="task-card-side"><StatusBadge status={request.status} /><small>{formatDate(request.created_at)}</small><RequestActions request={request} busyId={props.busyId} onAction={props.onAction} /></div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export function ProcessesView(props: CommonProps) {
  const successRate = props.stats.total ? Math.round((props.stats.completed / props.stats.total) * 100) : 0;
  return (
    <div className="section-stack">
      <section className="process-definition-card panel">
        <div className="process-definition-header"><div><span className="process-icon">◇</span><div><h2>Solicitud de acceso a sistema corporativo</h2><p>Proceso BPM principal del proyecto ISO-815</p></div></div><span className="live-badge">● ACTIVO LOCAL</span></div>
        <div className="process-definition-stats">
          <span><b>{props.stats.total}</b><small>instancias</small></span><span><b>{props.stats.pending}</b><small>pendientes</small></span><span><b>{props.stats.completed}</b><small>completadas</small></span><span><b>{successRate}%</b><small>cierre exitoso</small></span>
        </div>
        <ProcessFlow />
      </section>
      <section className="process-detail-grid">
        <article className="panel section-panel"><div className="panel-title"><div><span>Actores</span><small>Participantes definidos</small></div></div><ul className="detail-list"><li><b>Solicitante</b><span>Inicia y justifica la solicitud.</span></li><li><b>Aprobador</b><span>Aprueba o rechaza la tarea humana.</span></li><li><b>Servicio REST</b><span>Ejecuta el aprovisionamiento.</span></li><li><b>Auditoría</b><span>Registra referencia y resultado.</span></li></ul></article>
        <article className="panel section-panel"><div className="panel-title"><div><span>Reglas</span><small>Decisiones del flujo</small></div></div><ul className="detail-list"><li><b>Aprobada</b><span>Continúa a POST /provision.</span></li><li><b>Rechazada</b><span>Finaliza sin aprovisionar acceso.</span></li><li><b>Error REST</b><span>Queda disponible para reintento.</span></li><li><b>Idempotencia</b><span>request_id evita duplicados.</span></li></ul></article>
      </section>
    </div>
  );
}

export function CasesView(props: CommonProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | RequestStatus>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [events, setEvents] = useState<RequestEvent[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const filtered = props.requests.filter((request) => requestMatches(request, props.query)).filter((request) => statusFilter === 'ALL' || request.status === statusFilter);

  const openCase = async (request: AccessRequest) => {
    setSelectedRequest(request);
    setEvents([]);
    setDetailLoading(true);
    try {
      const history = await api.getRequestEvents(request.id);
      setEvents(history);
    } finally {
      setDetailLoading(false);
    }
  };

  const detailAction = async (action: Action) => {
    if (!selectedRequest) return;
    await props.onAction(selectedRequest.id, action);
    const [fresh, history] = await Promise.all([
      api.getRequest(selectedRequest.id),
      api.getRequestEvents(selectedRequest.id),
    ]);
    setSelectedRequest(fresh);
    setEvents(history);
  };

  return (
    <div className="section-stack">
      <article className="panel section-panel">
        <div className="section-toolbar"><div><strong>Casos e instancias</strong><small>{filtered.length} de {props.requests.length} visibles · selecciona un ID para ver su historial</small></div><div className="filter-chips">{(['ALL', 'PENDING_APPROVAL', 'COMPLETED', 'REJECTED', 'ERROR'] as const).map((filter) => <button type="button" key={filter} className={statusFilter === filter ? 'active' : ''} onClick={() => setStatusFilter(filter)}>{filter === 'ALL' ? 'Todos' : statusLabel[filter]}</button>)}</div></div>
        <RequestTable requests={filtered} busyId={props.busyId} onAction={props.onAction} showActions onOpen={openCase} />
      </article>

      {selectedRequest && (
        <div className="case-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRequest(null); }}>
          <section className="case-detail-panel" role="dialog" aria-modal="true" aria-labelledby="case-detail-title">
            <header className="case-detail-header">
              <div><span className="eyebrow">Detalle persistente</span><h2 id="case-detail-title">{selectedRequest.id}</h2><p>{selectedRequest.requester_name} · {selectedRequest.user_email}</p></div>
              <button type="button" aria-label="Cerrar detalle" onClick={() => setSelectedRequest(null)}>×</button>
            </header>

            <div className="case-detail-grid">
              <span><small>Sistema</small><b>{selectedRequest.system}</b></span>
              <span><small>Nivel</small><b>{selectedRequest.access_level}</b></span>
              <span><small>Estado</small><StatusBadge status={selectedRequest.status} /></span>
              <span><small>Referencia</small><code>{selectedRequest.external_reference ?? '—'}</code></span>
            </div>

            <div className="case-detail-justification"><small>Justificación</small><p>{selectedRequest.justification}</p></div>

            <div className="case-detail-actions"><RequestActions request={selectedRequest} busyId={props.busyId} onAction={(_, action) => detailAction(action)} /></div>

            <div className="case-history">
              <div className="panel-title"><div><span>Historial del caso</span><small>Eventos almacenados en SQLite</small></div></div>
              {detailLoading && <p className="empty-state">Cargando trazabilidad…</p>}
              {!detailLoading && events.length === 0 && <EmptyPanel title="Sin eventos" text="No se encontraron eventos para esta solicitud." />}
              {!detailLoading && events.map((event) => (
                <div className="history-event" key={event.id}>
                  <span className={`history-dot ${event.event_type.includes('FAILED') || event.event_type === 'REJECTED' ? 'danger' : event.event_type === 'PROVISIONED' ? 'success' : ''}`} />
                  <div><strong>{eventLabel[event.event_type] ?? event.event_type}</strong><p>{event.message}</p><small>{event.from_status ?? '—'} → {event.to_status ?? '—'}</small></div>
                  <time>{formatDate(event.occurred_at)}</time>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export function BpmnView() {
  return (
    <div className="section-stack">
      <article className="panel bpmn-canvas-panel">
        <div className="panel-title"><div><span>Diseño BPMN</span><small>Modelo visual de referencia del proceso</small></div><span className="demo-label">BPMN 2.0</span></div>
        <ProcessFlow large />
      </article>
      <section className="process-detail-grid">
        <article className="panel section-panel"><div className="panel-title"><div><span>Elementos BPMN</span><small>Componentes utilizados</small></div></div><ul className="detail-list"><li><b>Evento de inicio</b><span>Recepción de solicitud.</span></li><li><b>Tarea de validación</b><span>Verificación de datos y contrato.</span></li><li><b>Tarea humana</b><span>Aprobación por responsable.</span></li><li><b>Gateway exclusivo</b><span>Decisión aprobada/rechazada.</span></li><li><b>Service Task</b><span>Invocación REST /provision.</span></li><li><b>Eventos de fin</b><span>Cierre o rechazo.</span></li></ul></article>
        <article className="panel section-panel warning-panel"><div className="panel-title"><div><span>Estado de validación</span><small>Gate académico pendiente</small></div></div><p>Este diagrama representa el diseño funcional implementado por React + FastAPI. La validación final como proceso ejecutable sigue requiriendo Bonita Studio y evidencias de runtime.</p></article>
      </section>
    </div>
  );
}

export function IntegrationsView(props: CommonProps) {
  const [copied, setCopied] = useState('');
  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(''), 1400);
  };
  const endpoints = [
    ['GET', '/health', 'Health check + SQLite'],
    ['GET', '/requests', 'Listado persistente de solicitudes'],
    ['GET', '/requests/{id}', 'Detalle de una solicitud'],
    ['GET', '/requests/{id}/events', 'Historial persistente del caso'],
    ['POST', '/requests', 'Creación de solicitudes'],
    ['POST', '/requests/{id}/approve', 'Aprobación + aprovisionamiento'],
    ['POST', '/provision', 'Aprovisionamiento idempotente'],
    ['GET', '/audit', 'Trazabilidad de integraciones'],
    ['GET', '/users', 'Usuarios persistentes'],
    ['GET', '/stats', 'Indicadores operativos'],
  ];
  return (
    <div className="section-stack">
      <section className="integration-hero panel">
        <div><span className={`service-orb ${props.apiOnline ? 'online' : 'offline'}`}>↔</span><div><h2>FastAPI Provisioning Service</h2><p>{props.apiOnline ? 'Servicio local disponible con persistencia SQLite.' : 'Servicio sin conexión.'}</p><code>{api.baseUrl}</code></div></div>
        <button className="secondary-action" type="button" onClick={() => void props.onRefresh()}>↻ Verificar conexión</button>
      </section>
      <section className="section-summary-grid"><SummaryCard label="REST completados" value={props.stats.rest_requests} icon="↔" tone="blue" /><SummaryCard label="Auditorías" value={props.auditRecords.length} icon="◎" tone="green" /><SummaryCard label="Errores actuales" value={props.stats.error} icon="!" tone="danger" /></section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Endpoints</span><small>Contrato de integración y persistencia local</small></div></div>
        <div className="endpoint-list">
          {endpoints.map(([method, path, description]) => {
            const full = `${api.baseUrl}${path}`;
            return <button className="endpoint-row" type="button" key={`${method}-${path}`} onClick={() => void copy(full)}><span className={`http-method ${method.toLowerCase()}`}>{method}</span><code>{path}</code><span>{description}</span><b>{copied === full ? 'Copiado ✓' : 'Copiar'}</b></button>;
          })}
        </div>
      </article>
    </div>
  );
}

export function AuditView(props: CommonProps) {
  const filtered = props.auditRecords.filter((record) => {
    const q = props.query.trim().toLowerCase();
    if (!q) return true;
    return [record.request_id, record.user_email, record.system, record.access_level, record.external_reference].some((value) => value.toLowerCase().includes(q));
  });
  return (
    <div className="section-stack">
      <section className="section-summary-grid"><SummaryCard label="Registros" value={props.auditRecords.length} icon="◎" tone="blue" /><SummaryCard label="Aprovisionados" value={props.auditRecords.filter((x) => x.status === 'PROVISIONED').length} icon="✓" tone="green" /><SummaryCard label="Referencias ACC" value={props.auditRecords.filter((x) => x.external_reference.startsWith('ACC-')).length} icon="#" tone="warning" /></section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Trazabilidad REST</span><small>Registros persistidos por el servicio de aprovisionamiento</small></div></div>
        <div className="audit-timeline">
          {filtered.length === 0 && <EmptyPanel title="Sin registros" text="Aprueba una solicitud para generar una entrada de auditoría." />}
          {filtered.map((record) => (
            <div className="audit-event" key={record.request_id}><span className="audit-marker">✓</span><div><strong>{record.request_id} · {record.status}</strong><small>{record.user_email} · {record.system}</small><p>Nivel: {record.access_level} · Referencia: <code>{record.external_reference}</code></p></div><time>{formatDate(record.provisioned_at)}</time></div>
          ))}
        </div>
      </article>
    </div>
  );
}

export function UsersView(props: CommonProps) {
  const users = useMemo(() => {
    const q = props.query.trim().toLowerCase();
    if (!q) return props.users;
    return props.users.filter((user) => [user.name, user.email, ...user.systems].some((value) => value.toLowerCase().includes(q)));
  }, [props.users, props.query]);

  const uniqueSystems = new Set(props.users.flatMap((user) => user.systems)).size;

  return (
    <div className="section-stack">
      <section className="section-summary-grid"><SummaryCard label="Usuarios persistentes" value={props.users.length} icon="♙" tone="blue" /><SummaryCard label="Con accesos completados" value={props.users.filter((x) => x.completed_count > 0).length} icon="✓" tone="green" /><SummaryCard label="Sistemas solicitados" value={uniqueSystems} icon="▦" tone="warning" /></section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Usuarios del proceso</span><small>Entidades persistidas en SQLite</small></div></div>
        <div className="user-grid">
          {users.map((user) => (
            <article className="user-card" key={user.email}><span className="user-avatar">{user.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.email}</small><p>{user.systems.join(' · ')}</p></div><div className="user-meta"><b>{user.request_count}</b><small>solicitudes</small><span>{user.completed_count} completadas</span><time>{formatDate(user.last_activity)}</time></div></article>
          ))}
          {users.length === 0 && <EmptyPanel title="Sin usuarios" text="No hay usuarios que coincidan con la búsqueda." />}
        </div>
      </article>
    </div>
  );
}

function SummaryCard({ label, value, icon, tone }: { label: string; value: number; icon: string; tone: string }) {
  return <article className={`summary-card ${tone}`}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>;
}

function RequestTable({ requests, busyId, onAction, showActions, onOpen }: { requests: AccessRequest[]; busyId: string; onAction: CommonProps['onAction']; showActions: boolean; onOpen?: (request: AccessRequest) => void }) {
  return (
    <div className="table-scroll">
      <table className="cases-table"><thead><tr><th>ID</th><th>Solicitante</th><th>Sistema</th><th>Nivel</th><th>Estado</th><th>Actualización</th><th>Referencia</th>{showActions && <th>Acciones</th>}</tr></thead><tbody>
        {requests.map((request) => <tr key={request.id}><td className="case-id">{onOpen ? <button className="case-link" type="button" onClick={() => onOpen(request)}>{request.id}</button> : request.id}</td><td><strong>{request.requester_name}</strong><small>{request.user_email}</small></td><td>{request.system}</td><td>{request.access_level}</td><td><StatusBadge status={request.status} /></td><td>{formatDate(request.updated_at)}</td><td><code>{request.external_reference ?? '—'}</code></td>{showActions && <td><RequestActions request={request} busyId={busyId} onAction={onAction} /></td>}</tr>)}
      </tbody></table>
      {requests.length === 0 && <EmptyPanel title="Sin resultados" text="No existen casos que coincidan con los filtros actuales." />}
    </div>
  );
}

function ProcessFlow({ large = false }: { large?: boolean }) {
  return (
    <div className={`process-flow ${large ? 'process-flow-large' : ''}`} aria-label="Flujo BPM de solicitud de acceso">
      <div className="flow-node start"><b>▶</b><span>Inicio<small>Solicitud recibida</small></span></div><span className="connector">→</span>
      <div className="flow-node"><b>✓</b><span>Validación<small>Datos y contrato</small></span></div><span className="connector">→</span>
      <div className="flow-node active"><b>♙</b><span>Aprobación<small>Tarea humana</small></span></div><span className="connector">→</span>
      <div className="gateway"><span>?</span><small>¿Aprobada?</small></div>
      <div className="branch approved"><span>sí →</span><div className="flow-node"><b>↔</b><span>REST<small>/provision</small></span></div><span>→</span><div className="flow-node done"><b>✓</b><span>Cierre<small>Auditoría</small></span></div></div>
      <div className="branch rejected"><span>no →</span><div className="flow-node reject"><b>×</b><span>Rechazo<small>Notificación</small></span></div></div>
    </div>
  );
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return <div className="rich-empty"><span>◇</span><strong>{title}</strong><p>{text}</p></div>;
}
