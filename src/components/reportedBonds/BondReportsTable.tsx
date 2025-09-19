// src/components/reportedBonds/BondReportsTable.tsx

import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { getReportsForBond } from '../../api/reportedBonds/api';
import type { BondReportsResponse, ReportStatus } from '../../api/reportedBonds/types';
import ReviewReportForm from './ReviewReportForm';
import './BondReportsTable.css';

interface Props {
  bondId: number | string;
  token: string;
}

export default function BondReportsTable({ bondId, token }: Props) {
  const [data, setData] = useState<BondReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }

    if (!bondId) {
      setError('Bond ID is invalid.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getReportsForBond(bondId, token);
      setData(response);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [bondId, token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReviewSuccess = () => {
    fetchReports(); // Refresh data after successful review
  };

  if (loading) {
    return <p className="loading-info" aria-live="polite">Loading reports…</p>;
  }

  if (error) {
    return (
      <div className="error-container" role="alert">
        <p className="error">Error: {error}</p>
        <button onClick={fetchReports} className="btn-refresh">
          Retry
        </button>
      </div>
    );
  }

  if (!data?.data.reports || data.data.reports.length === 0) {
    return <p className="no-reports-info">No reports for this bond.</p>;
  }

  return (
    <div className="reports-container">
      <table className="reports-table" aria-label="Reports for this bond">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Reporter</th>
            <th scope="col">Reason</th>
            <th scope="col">Description</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.data.reports.map((r) => (
            <React.Fragment key={r.id}>
              <tr className="report-row">
                <td>{r.id}</td>
                <td>{r.reporter_id || '—'}</td>
                <td>{r.reason || '—'}</td>
                <td>{r.description || '—'}</td>
                <td>
                  <span className={`status-badge status-${r.status?.toLowerCase() || 'unknown'}`}>
                    {r.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </td>
                <td>
                  {r.status === 'pending' ? (
                    <button
                      className="btn-review"
                      aria-label={`Review report ${r.id}`}
                    >
                      Review
                    </button>
                  ) : (
                    <span className="status-locked" title="Status is finalized">
                      Finalized
                    </span>
                  )}
                </td>
              </tr>
              {r.status === 'pending' && (
                <tr>
                  <td colSpan={7}>
                    <div className="review-form-wrapper">
                      <ReviewReportForm
                        reportId={r.id}
                        currentStatus={r.status as ReportStatus}
                        token={token}
                        onSuccess={handleReviewSuccess}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}