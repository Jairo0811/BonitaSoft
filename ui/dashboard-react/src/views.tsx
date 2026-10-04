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

type DailyPerformance = {
  key: string;
  label: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  rejected: number;
  error: number;
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

const localDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildDailyPerformance = (requests: AccessRequest[], days = 7): DailyPerformance[] => {
  const formatter = new Intl.DateTimeFormat('es-DO', { weekday: 'short', day: '2-digit' });
  const today = new Date();
  const buckets: DailyPerformance[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    buckets.push({
      key: localDateKey(date),
      label: formatter.format(date).replace('.', ''),
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      rejected: 0,
      error: 0,
    });
  }

  const byDate = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  requests.forEach((request) => {
    const bucket = byDate.get(localDateKey(new Date(request.updated_at)));
    if (!bucket) return;
    bucket.total += 1;
    if (request.status === 'COMPLETED') bucket.completed += 1;
    if (request.status === 'IN_PROGRESS') bucket.inProgress += 1;
    if (request.status === 'PENDING_APPROVAL') bucket.pending += 1;
    if (request.status === 'REJECTED') bucket.rejected += 1;
    if (request.status === 'ERROR') bucket.error += 1;
  });

  return buckets;
};

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
        <button className="mini-action approve" type="button" disabled={disabled} onClick={() => void onAction(request.id, 'approve')}><i className="fa-solid fa-check" aria-hidden="true" /> Aprobar</button>
        <button className="mini-action reject" type="button" disabled={disabled} onClick={() => void onAction(request.id, 'reject')}><i className="fa-solid fa-xmark" aria-hidden="true" /> Rechazar</button>
      </div>
    );
  }
  if (request.status === 'ERROR') {
    return <button className="mini-action retry" type="button" disabled={disabled} onClick={() => void onAction(request.id, 'retry')}><i className="fa-solid fa-rotate" aria-hidden="true" /> Reintentar</button>;
  }
  return null;
}

export function DashboardView(props: CommonProps) {
  const { requests, stats, auditRecords, apiOnline, busyId, onAction } = props;
  const safeTotal = Math.max(stats.total, 1);
  const percent = (value: number) => Math.round((value / safeTotal) * 100);
  const completedPercent = percent(stats.completed);
  const inProgressPercent = percent(stats.in_progress);
  const pendingPercent = percent(stats.pending);
  const rejectedPercent = percent(stats.rejected);
  const errorPercent = percent(stats.error);
  const actionable = requests.filter((item) => item.status === 'PENDING_APPROVAL' || item.status === 'ERROR').slice(0, 4);
  const recent = requests.slice(0, 6);
  const latestRequest = requests[0] ?? null;
  const performance = useMemo(() => buildDailyPerformance(requests), [requests]);
  const performanceMax = Math.max(...performance.flatMap((day) => [day.completed, day.inProgress, day.pending, day.rejected, day.error]), 1);
  const cumulative = {
    completed: (stats.completed / safeTotal) * 100,
    inProgress: ((stats.completed + stats.in_progress) / safeTotal) * 100,
    pending: ((stats.completed + stats.in_progress + stats.pending) / safeTotal) * 100,
    rejected: ((stats.completed + stats.in_progress + stats.pending + stats.rejected) / safeTotal) * 100,
  };

  return (
    <>
      <section className="metric-grid" aria-label="Indicadores principales">
        <article className="metric-card blue"><div className="metric-icon"><i className="fa-solid fa-layer-group" /></div><div><span>Instancias totales</span><strong>{stats.total}</strong><small>SQLite · /stats</small></div></article>
        <article className="metric-card green"><div className="metric-icon"><i className="fa-solid fa-circle-check" /></div><div><span>Completadas</span><strong>{stats.completed}</strong><small>{completedPercent}% del total real</small></div></article>
        <article className="metric-card red"><div className="metric-icon"><i className="fa-solid fa-hourglass-half" /></div><div><span>Pendientes</span><strong>{stats.pending}</strong><small>{stats.error} con error actual</small></div></article>
        <article className="metric-card blue"><div className="metric-icon"><i className="fa-solid fa-plug-circle-check" /></div><div><span>Integraciones REST</span><strong>{stats.rest_requests}</strong><small>{auditRecords.length} auditorías persistentes</small></div></article>
      </section>

      <section className="analytics-grid">
        <article className="panel performance-panel">
          <div className="panel-title"><div><span>Rendimiento real</span><small>Últimos 7 días · estado final por updated_at desde SQLite</small></div><span className="data-source-badge"><i className="fa-solid fa-database" /> SQLite</span></div>
          <div className="real-performance-chart" aria-label="Actividad real de solicitudes de los últimos siete días">
            {performance.map((day) => (
              <div className="real-day-group" key={day.key}>
                <div className="real-day-bars">
                  <span className="real-bar completed" style={{ height: `${(day.completed / performanceMax) * 100}%` }} title={`${day.label} · Completadas: ${day.completed}`} />
                  <span className="real-bar progress" style={{ height: `${(day.inProgress / performanceMax) * 100}%` }} title={`${day.label} · En progreso: ${day.inProgress}`} />
                  <span className="real-bar pending" style={{ height: `${(day.pending / performanceMax) * 100}%` }} title={`${day.label} · Pendientes: ${day.pending}`} />
                  <span className="real-bar rejected" style={{ height: `${(day.rejected / performanceMax) * 100}%` }} title={`${day.label} · Rechazadas: ${day.rejected}`} />
                  <span className="real-bar error" style={{ height: `${(day.error / performanceMax) * 100}%` }} title={`${day.label} · Errores: ${day.error}`} />
                </div>
                <strong>{day.total}</strong>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
          <div className="chart-legend real-legend">
            <span><i className="legend-blue" /> Completadas</span>
            <span><i className="legend-cyan" /> En progreso</span>
            <span><i className="legend-amber" /> Pendientes</span>
            <span><i className="legend-red" /> Rechazadas</span>
            <span><i className="legend-magenta" /> Error</span>
          </div>
        </article>

        <article className="panel status-panel">
          <div className="panel-title"><div><span>Estado del proceso</span><small>Distribución actual desde /stats</small></div><span className="data-source-badge"><i className="fa-solid fa-chart-pie" /> API</span></div>
          <div className="status-content">
            <div className="donut" style={{ background: `conic-gradient(#2f80ff 0 ${cumulative.completed}%, #38bdf8 ${cumulative.completed}% ${cumulative.inProgress}%, #f59e0b ${cumulative.inProgress}% ${cumulative.pending}%, #ff1744 ${cumulative.pending}% ${cumulative.rejected}%, #d946ef ${cumulative.rejected}% 100%)` }}><span><strong>{stats.total}</strong><small>Total</small></span></div>
            <div className="status-list">
              <span><i className="dot blue-dot" /> Completadas <b>{stats.completed} · {completedPercent}%</b></span>
              <span><i className="dot cyan-dot" /> En progreso <b>{stats.in_progress} · {inProgressPercent}%</b></span>
              <span><i className="dot amber-dot" /> Pendientes <b>{stats.pending} · {pendingPercent}%</b></span>
              <span><i className="dot red-dot" /> Rechazadas <b>{stats.rejected} · {rejectedPercent}%</b></span>
              <span><i className="dot magenta-dot" /> Error <b>{stats.error} · {errorPercent}%</b></span>
            </div>
          </div>
        </article>

        <article className="panel integration-panel">
          <div className="panel-title"><div><span>Integración</span><small>Estado y registros reales de FastAPI</small></div><span className="data-source-badge"><i className="fa-solid fa-plug" /> REST</span></div>
          <div className={`api-health ${apiOnline ? '' : 'api-offline'}`}><span className="pulse" /><div><strong>REST /provision</strong><small>Estado: {apiOnline ? 'disponible' : 'sin conexión'}</small></div></div>
          <div className="api-stats"><span><b>{stats.rest_requests}</b><small>aprovisionados</small></span><span><b>{auditRecords.length}</b><small>auditorías</small></span><span><b>{stats.error}</b><small>errores actuales</small></span></div>
          <code>POST {api.baseUrl}/provision</code>
        </article>
      </section>

      <section className="workspace-grid">
        <article className="panel process-panel">
          <div className="panel-title"><div><span>Flujo de la instancia más reciente</span><small>{latestRequest ? `${latestRequest.id} · ${latestRequest.requester_name} · ${statusLabel[latestRequest.status]}` : 'Sin instancias registradas'}</small></div><span className="live-badge"><i className="fa-solid fa-database" /> DATOS REALES</span></div>
          <ProcessFlow request={latestRequest} />
        </article>

        <article className="panel tasks-panel">
          <div className="panel-title"><div><span>Tareas pendientes</span><small>{actionable.length} visibles desde SQLite</small></div></div>
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
        <div className="panel-title"><div><span>Instancias recientes</span><small>{recent.length} registros reales</small></div><span className="data-source-badge"><i className="fa-solid fa-database" /> SQLite</span></div>
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
        <SummaryCard label="Pendientes de aprobación" value={props.stats.pending} icon="fa-user-check" tone="warning" />
        <SummaryCard label="Errores reintentables" value={props.stats.error} icon="fa-rotate" tone="danger" />
        <SummaryCard label="Total de tareas" value={actionable.length} icon="fa-list-check" tone="blue" />
      </section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Mi bandeja de tareas</span><small>Acciones humanas obtenidas desde SQLite</small></div></div>
        <div className="large-task-list">
          {actionable.length === 0 && <EmptyPanel title="Sin tareas" text="No hay solicitudes pendientes ni errores por reintentar." />}
          {actionable.map((request) => (
            <div className="task-card" key={request.id}>
              <div className="task-card-main">
                <span className={`task-card-icon ${request.status === 'ERROR' ? 'error' : ''}`}><i className={`fa-solid ${request.status === 'ERROR' ? 'fa-triangle-exclamation' : 'fa-user-check'}`} /></span>
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
  const latest = props.requests[0] ?? null;
  return (
    <div className="section-stack">
      <section className="process-definition-card panel">
        <div className="process-definition-header"><div><span className="process-icon"><i className="fa-solid fa-diagram-project" /></span><div><h2>Solicitud de acceso a sistema corporativo</h2><p>Proceso BPM principal del proyecto ISO-815</p></div></div><span className="live-badge"><i className="fa-solid fa-database" /> MÉTRICAS REALES</span></div>
        <div className="process-definition-stats">
          <span><b>{props.stats.total}</b><small>instancias</small></span><span><b>{props.stats.pending}</b><small>pendientes</small></span><span><b>{props.stats.completed}</b><small>completadas</small></span><span><b>{successRate}%</b><small>cierre exitoso</small></span>
        </div>
        <ProcessFlow request={latest} />
      </section>
      <section className="process-detail-grid">
        <article className="panel section-panel"><div className="panel-title"><div><span>Actores</span><small>Configuración del proceso</small></div></div><ul className="detail-list"><li><b>Solicitante</b><span>Inicia y justifica la solicitud.</span></li><li><b>Aprobador</b><span>Aprueba o rechaza la tarea humana.</span></li><li><b>Servicio REST</b><span>Ejecuta el aprovisionamiento.</span></li><li><b>Auditoría</b><span>Registra referencia y resultado.</span></li></ul></article>
        <article className="panel section-panel"><div className="panel-title"><div><span>Reglas</span><small>Configuración funcional, no métricas</small></div></div><ul className="detail-list"><li><b>Aprobada</b><span>Continúa a POST /provision.</span></li><li><b>Rechazada</b><span>Finaliza sin aprovisionar acceso.</span></li><li><b>Error REST</b><span>Queda disponible para reintento.</span></li><li><b>Idempotencia</b><span>request_id evita duplicados.</span></li></ul></article>
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
        <div className="section-toolbar"><div><strong>Casos e instancias</strong><small>{filtered.length} de {props.requests.length} registros SQLite · selecciona un ID para ver su historial</small></div><div className="filter-chips">{(['ALL', 'PENDING_APPROVAL', 'COMPLETED', 'REJECTED', 'ERROR'] as const).map((filter) => <button type="button" key={filter} className={statusFilter === filter ? 'active' : ''} onClick={() => setStatusFilter(filter)}>{filter === 'ALL' ? 'Todos' : statusLabel[filter]}</button>)}</div></div>
        <RequestTable requests={filtered} busyId={props.busyId} onAction={props.onAction} showActions onOpen={openCase} />
      </article>

      {selectedRequest && (
        <div className="case-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRequest(null); }}>
          <section className="case-detail-panel" role="dialog" aria-modal="true" aria-labelledby="case-detail-title">
            <header className="case-detail-header">
              <div><span className="eyebrow">Detalle persistente</span><h2 id="case-detail-title">{selectedRequest.id}</h2><p>{selectedRequest.requester_name} · {selectedRequest.user_email}</p></div>
              <button type="button" aria-label="Cerrar detalle" onClick={() => setSelectedRequest(null)}><i className="fa-solid fa-xmark" /></button>
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
        <div className="panel-title"><div><span>Diseño BPMN</span><small>Modelo visual de referencia; no representa datos operativos</small></div><span className="demo-label">BPMN 2.0 · MODELO</span></div>
        <ProcessFlow large />
      </article>
      <section className="process-detail-grid">
        <article className="panel section-panel"><div className="panel-title"><div><span>Elementos BPMN</span><small>Componentes definidos</small></div></div><ul className="detail-list"><li><b>Evento de inicio</b><span>Recepción de solicitud.</span></li><li><b>Tarea de validación</b><span>Verificación de datos y contrato.</span></li><li><b>Tarea humana</b><span>Aprobación por responsable.</span></li><li><b>Gateway exclusivo</b><span>Decisión aprobada/rechazada.</span></li><li><b>Service Task</b><span>Invocación REST /provision.</span></li><li><b>Eventos de fin</b><span>Cierre o rechazo.</span></li></ul></article>
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
        <div><span className={`service-orb ${props.apiOnline ? 'online' : 'offline'}`}><i className="fa-solid fa-plug" /></span><div><h2>FastAPI Provisioning Service</h2><p>{props.apiOnline ? 'Servicio local disponible con persistencia SQLite.' : 'Servicio sin conexión.'}</p><code>{api.baseUrl}</code></div></div>
        <button className="secondary-action" type="button" onClick={() => void props.onRefresh()}><i className="fa-solid fa-rotate" /> Verificar conexión</button>
      </section>
      <section className="section-summary-grid"><SummaryCard label="REST completados" value={props.stats.rest_requests} icon="fa-plug-circle-check" tone="blue" /><SummaryCard label="Auditorías" value={props.auditRecords.length} icon="fa-clock-rotate-left" tone="green" /><SummaryCard label="Errores actuales" value={props.stats.error} icon="fa-triangle-exclamation" tone="danger" /></section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Endpoints</span><small>Contrato estático del servicio; las métricas superiores son datos reales</small></div></div>
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
      <section className="section-summary-grid"><SummaryCard label="Registros" value={props.auditRecords.length} icon="fa-clock-rotate-left" tone="blue" /><SummaryCard label="Aprovisionados" value={props.auditRecords.filter((x) => x.status === 'PROVISIONED').length} icon="fa-circle-check" tone="green" /><SummaryCard label="Referencias ACC" value={props.auditRecords.filter((x) => x.external_reference.startsWith('ACC-')).length} icon="fa-hashtag" tone="warning" /></section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Trazabilidad REST</span><small>Registros reales persistidos por el servicio de aprovisionamiento</small></div><span className="data-source-badge"><i className="fa-solid fa-database" /> SQLite</span></div>
        <div className="audit-timeline">
          {filtered.length === 0 && <EmptyPanel title="Sin registros" text="Aprueba una solicitud para generar una entrada de auditoría." />}
          {filtered.map((record) => (
            <div className="audit-event" key={record.request_id}><span className="audit-marker"><i className="fa-solid fa-check" /></span><div><strong>{record.request_id} · {record.status}</strong><small>{record.user_email} · {record.system}</small><p>Nivel: {record.access_level} · Referencia: <code>{record.external_reference}</code></p></div><time>{formatDate(record.provisioned_at)}</time></div>
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
      <section className="section-summary-grid"><SummaryCard label="Usuarios persistentes" value={props.users.length} icon="fa-users" tone="blue" /><SummaryCard label="Con accesos completados" value={props.users.filter((x) => x.completed_count > 0).length} icon="fa-user-check" tone="green" /><SummaryCard label="Sistemas solicitados" value={uniqueSystems} icon="fa-server" tone="warning" /></section>
      <article className="panel section-panel">
        <div className="panel-title"><div><span>Usuarios del proceso</span><small>Entidades reales persistidas en SQLite</small></div><span className="data-source-badge"><i className="fa-solid fa-database" /> SQLite</span></div>
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
  return <article className={`summary-card ${tone}`}><span><i className={`fa-solid ${icon}`} /></span><div><small>{label}</small><strong>{value}</strong></div></article>;
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

function ProcessFlow({ request, large = false }: { request?: AccessRequest | null; large?: boolean }) {
  const status = request?.status;
  const afterApproval = status === 'IN_PROGRESS' || status === 'COMPLETED' || status === 'ERROR';
  const approvalClass = status === 'PENDING_APPROVAL' ? 'active' : afterApproval || status === 'REJECTED' ? 'done' : '';
  const restClass = status === 'IN_PROGRESS' ? 'active' : status === 'COMPLETED' ? 'done' : status === 'ERROR' ? 'flow-error active' : '';
  const closeClass = status === 'COMPLETED' ? 'done' : '';
  const rejectClass = status === 'REJECTED' ? 'reject active' : 'reject';

  return (
    <div className={`process-flow ${large ? 'process-flow-large' : ''}`} aria-label={request ? `Flujo de ${request.id}, estado ${statusLabel[request.status]}` : 'Modelo BPM de solicitud de acceso'}>
      <div className={`flow-node start ${request ? 'done' : ''}`}><b><i className="fa-solid fa-play" /></b><span>Inicio<small>Solicitud recibida</small></span></div><span className="connector">→</span>
      <div className={`flow-node ${request ? 'done' : ''}`}><b><i className="fa-solid fa-check" /></b><span>Validación<small>Datos y contrato</small></span></div><span className="connector">→</span>
      <div className={`flow-node ${approvalClass}`}><b><i className="fa-solid fa-user-check" /></b><span>Aprobación<small>Tarea humana</small></span></div><span className="connector">→</span>
      <div className="gateway"><span>?</span><small>¿Aprobada?</small></div>
      <div className="branch approved"><span>sí →</span><div className={`flow-node ${restClass}`}><b><i className="fa-solid fa-plug" /></b><span>REST<small>{status === 'ERROR' ? 'Error / reintento' : '/provision'}</small></span></div><span>→</span><div className={`flow-node ${closeClass}`}><b><i className="fa-solid fa-flag-checkered" /></b><span>Cierre<small>Auditoría</small></span></div></div>
      <div className="branch rejected"><span>no →</span><div className={`flow-node ${rejectClass}`}><b><i className="fa-solid fa-xmark" /></b><span>Rechazo<small>Notificación</small></span></div></div>
    </div>
  );
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return <div className="rich-empty"><span><i className="fa-regular fa-circle" /></span><strong>{title}</strong><p>{text}</p></div>;
}
