import type {
    ReportedBondsResponse,
    BondReportsResponse,
    PatchReportResponse,
    ReportStatus,

  } from './types';
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  /* -------------------------------------------------- */
  /*  GET  /api/bonds/admin/reported-bonds              */
  /* -------------------------------------------------- */
  export const getReportedBonds = async (token: string): Promise<ReportedBondsResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/bonds/admin/reported-bonds`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error(`Reported bonds fetch failed (${res.status})`);
    return (await res.json()) as ReportedBondsResponse;
  };
  
  /* -------------------------------------------------- */
  /*  GET  /api/bonds/admin/reports/:bondId             */
  /* -------------------------------------------------- */
  export const getReportsForBond = async (bondId: number | string, token: string) => {
    const res = await fetch(`${API_BASE_URL}/api/bonds/admin/reports/${bondId}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error(`Bond reports fetch failed (${res.status})`);
    return (await res.json()) as BondReportsResponse;
  };
  
  /* -------------------------------------------------- */
  /*  PATCH /api/bonds/admin/reports/:reportId          */
  /*  Content-Type: multipart/form-data                 */
  /* -------------------------------------------------- */
  export const reviewBondReport = async (
    reportId: number | string,
    token: string,
    status: ReportStatus,
    notes?: string
  ): Promise<PatchReportResponse> => {
    const body = new FormData();
    body.append('status', status);
    if (notes) body.append('notes', notes);
  
    const res = await fetch(`${API_BASE_URL}/api/bonds/admin/reports/${reportId}`, {
      method: 'PATCH',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      body,
    });
  
    if (!res.ok) throw new Error(`Review failed (${res.status})`);
    return (await res.json()) as PatchReportResponse;
  };