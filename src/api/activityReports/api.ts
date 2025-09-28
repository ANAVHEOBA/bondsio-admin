import type {
  ActivityReportsResponse,
  ReviewActivityReportDto,
  PatchActivityReportResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* -------------------------------------------------- */
/*  GET  /api/activity/admin/reports                  */
/* -------------------------------------------------- */
export const getActivityReports = async (token: string): Promise<ActivityReportsResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/activity/admin/reports`, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Activity reports fetch failed (${res.status})`);
  return (await res.json()) as ActivityReportsResponse;
};

/* -------------------------------------------------- */
/*  PATCH  /api/activity/admin/reports/:id/status     */
/* -------------------------------------------------- */
export const patchActivityReportStatus = async (
  token: string,
  reportId: number | string,
  dto: ReviewActivityReportDto
): Promise<PatchActivityReportResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/activity/admin/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) throw new Error(`Report status update failed (${res.status})`);
  return (await res.json()) as PatchActivityReportResponse;
};