export type RequestStatus =
  | 'PENDING_APPROVAL'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'ERROR';

export type AccessRequest = {
  id: string;
  requester_name: string;
  user_email: string;
  system: string;
  access_level: string;
  justification: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  external_reference?: string | null;
};

export type AccessRequestCreate = {
  requester_name: string;
  user_email: string;
  system: string;
  access_level: string;
  justification: string;
};

export type DashboardStats = {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  rejected: number;
  error: number;
  rest_requests: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json() as { detail?: string };
      message = body.detail ?? message;
    } catch {
      // Keep the HTTP fallback when the response is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  baseUrl: API_BASE_URL,
  health: () => request<{ status: string }>('/health'),
  listRequests: () => request<AccessRequest[]>('/requests'),
  stats: () => request<DashboardStats>('/stats'),
  createRequest: (payload: AccessRequestCreate) =>
    request<AccessRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  approveRequest: (id: string) =>
    request<AccessRequest>(`/requests/${encodeURIComponent(id)}/approve`, {
      method: 'POST',
    }),
  rejectRequest: (id: string) =>
    request<AccessRequest>(`/requests/${encodeURIComponent(id)}/reject`, {
      method: 'POST',
    }),
  retryRequest: (id: string) =>
    request<AccessRequest>(`/requests/${encodeURIComponent(id)}/retry`, {
      method: 'POST',
    }),
};
