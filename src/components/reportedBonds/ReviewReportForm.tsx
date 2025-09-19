// src/components/reportedBonds/ReviewReportForm.tsx

import { useState } from 'react';
import { reviewBondReport } from '../../api/reportedBonds/api';
import { ReportStatus } from '../../api/reportedBonds/types'; // ← removed "type"
import './ReviewReportForm.css';

interface Props {
  reportId: number;
  currentStatus: ReportStatus; // ← ADDED
  token: string;
  onSuccess?: () => void;
}

export default function ReviewReportForm({ reportId, currentStatus, token, onSuccess }: Props) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus); // ← use prop
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await reviewBondReport(reportId, token, status, notes.trim() || undefined);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <label>
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ReportStatus)}
          required
        >
          <option value={ReportStatus.PENDING}>Pending</option>
          <option value={ReportStatus.REVIEWED}>Reviewed</option>
          <option value={ReportStatus.RESOLVED}>Resolved</option>
          <option value={ReportStatus.DISMISSED}>Dismissed</option>
        </select>
      </label>

      <label>
        Notes (optional)
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Review notes…"
          rows={3}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Update report'}
      </button>
    </form>
  );
}