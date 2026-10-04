import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from './api';
import type { AccessRequest, AccessRequestCreate, AuditRecord, DashboardStats } from './api';
import {
  AuditView,
  BpmnView,
  CasesView,
  DashboardView,
  IntegrationsView,
  ProcessesView,
  TasksView,
  UsersView,
} from './views';

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

type NavName = (typeof navItems)[number][0];
type Action = 'approve' | 'reject' | 'retry';

const EMPTY_FORM: AccessRequestCreate = {
  requester_name: '',
  user_email: '',
  system: '',
  access_level: 'Estándar',
  justification: '',
};

const EMPTY_STATS: DashboardStats = {
  total: 0,
  completed: 0,
  in_progress: 0,
  pending: 0,
  rejected: 0,
  error: 0,
  rest_requests: 0,
};

const pageMeta: Record<NavName, { eyebrow: string; title: string; description: string }> = {
  Dashboard: {
    eyebrow: 'Panel de control · API local conectada',
    title: 'Gestión BPM de solicitudes de acceso',
    description: 'Solicitudes, aprobación humana, aprovisionamiento REST y trazabilidad local.',
  },
  'Mis tareas': {
    eyebrow: 'Bandeja de trabajo · Tareas humanas',
    title: 'Mis tareas y aprobaciones',
    description: 'Resuelve solicitudes pendientes y recupera integraciones con error.',
  },
  Procesos: {
    eyebrow: 'Orquestación · Proceso activo',
    title: 'Procesos BPM',
    description: 'Consulta el proceso, sus actores, reglas y métricas de ejecución.',
  },
  Casos: {
    eyebrow: 'Instancias · Seguimiento operativo',
    title: 'Casos e instancias',
    description: 'Filtra y revisa cada solicitud que atraviesa el flujo BPM.',
  },
  'Diseño BPMN': {
    eyebrow: 'Modelado · BPMN 2.0',
    title: 'Diseño del proceso',
    description: 'Vista funcional del flujo que se implementará y validará en Bonita Studio.',
  },
  Integraciones: {
    eyebrow: 'Servicios · REST / FastAPI',
    title: 'Integraciones',
    description: 'Estado del servicio, endpoints disponibles y métricas de aprovisionamiento.',
  },
  Auditoría: {
    eyebrow: 'Trazabilidad · Evidencia técnica',
    title: 'Auditoría',
    description: 'Registros reales de aprovisionamiento generados durante la sesión local.',
  },
  Usuarios: {
    eyebrow: 'Participantes · Solicitantes',
    title: 'Usuarios',
    description: 'Resumen de usuarios y sistemas a partir de las solicitudes registradas.',
  },
};

export default function App() {
  const [activeNav, setActiveNav] = useState<NavName>('Dashboard');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
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
      const [requestRows, dashboardStats, auditRows] = await Promise.all([
        api.listRequests(),
        api.stats(),
        api.listAudit().catch(() => [] as AuditRecord[]),
      ]);
      setRequests(requestRows);
      setStats(dashboardStats);
      setAuditRecords(auditRows);
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

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const created = await api.createRequest(form);
      setModalOpen(false);
      setForm(EMPTY_FORM);
      showNotice(`Solicitud ${created.id} creada y enviada a aprobación.`);
      await loadDashboard();
      setActiveNav('Mis tareas');
    } catch (error) {
      showNotice(`No se pudo crear la solicitud: ${error instanceof Error ? error.message : 'error desconocido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const performAction = async (id: string, action: Action) => {
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

  const commonProps = {
    requests,
    stats,
    auditRecords,
    query,
    apiOnline,
    busyId,
    onAction: performAction,
    onNewRequest: () => setModalOpen(true),
    onRefresh: loadDashboard,
  };

  const renderView = () => {
    switch (activeNav) {
      case 'Mis tareas': return <TasksView {...commonProps} />;
      case 'Procesos': return <ProcessesView {...commonProps} />;
      case 'Casos': return <CasesView {...commonProps} />;
      case 'Diseño BPMN': return <BpmnView />;
      case 'Integraciones': return <IntegrationsView {...commonProps} />;
      case 'Auditoría': return <AuditView {...commonProps} />;
      case 'Usuarios': return <UsersView {...commonProps} />;
      default: return <DashboardView {...commonProps} />;
    }
  };

  const meta = pageMeta[activeNav];

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
              <span className="eyebrow">{meta.eyebrow}</span>
              <h1>{meta.title}</h1>
              <p>{meta.description}</p>
            </div>
            <div className="heading-actions">
              <span className="date-label">{today}</span>
              {loading && <span className="loading-label">Actualizando…</span>}
              <button className="primary-action" type="button" onClick={() => setModalOpen(true)}>Nueva solicitud</button>
            </div>
          </div>

          {renderView()}
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title">
            <header className="modal-header">
              <div><span className="eyebrow">Nueva instancia</span><h2 id="request-title">Solicitud de acceso</h2></div>
              <button type="button" aria-label="Cerrar" onClick={() => setModalOpen(false)}>×</button>
            </header>
            <form className="request-form" onSubmit={(event) => void handleCreate(event)}>
              <label>Solicitante<input required minLength={2} value={form.requester_name} onChange={(event) => setForm({ ...form, requester_name: event.target.value })} placeholder="Nombre completo" /></label>
              <label>Correo<input required type="email" value={form.user_email} onChange={(event) => setForm({ ...form, user_email: event.target.value })} placeholder="usuario@empresa.com" /></label>
              <label>Sistema<input required minLength={2} value={form.system} onChange={(event) => setForm({ ...form, system: event.target.value })} placeholder="Sistema solicitado" /></label>
              <label>Nivel de acceso<select value={form.access_level} onChange={(event) => setForm({ ...form, access_level: event.target.value })}><option>Lectura</option><option>Estándar</option><option>Operación</option><option>Supervisor</option><option>Administración</option></select></label>
              <label className="full-field">Justificación<textarea required minLength={3} value={form.justification} onChange={(event) => setForm({ ...form, justification: event.target.value })} placeholder="Explique por qué necesita el acceso." /></label>
              <div className="modal-actions"><button className="secondary-action" type="button" onClick={() => setModalOpen(false)}>Cancelar</button><button className="primary-action" type="submit" disabled={submitting || !apiOnline}>{submitting ? 'Creando…' : 'Crear solicitud'}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
