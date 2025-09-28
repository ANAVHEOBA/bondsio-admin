// src/components/reportedActivities/ReviewReportModal.tsx

import { useState } from 'react';
import type { ReviewActivityReportDto } from '../../api/activityReports/types';
import { ActivityReportStatus } from '../../api/activityReports/types'; // ✅ Import enum as VALUE
import { patchActivityReportStatus } from '../../api/activityReports/api';
import './ReviewReportModal.css';

interface ReviewReportModalProps {
  reportId: number;
  currentStatus: ActivityReportStatus;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewReportModal({
  reportId,
  currentStatus,
  onClose,
  onSuccess,
}: ReviewReportModalProps) {
  const [status, setStatus] = useState<ActivityReportStatus>(currentStatus);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('admin_token');
  if (!token) {
    alert('No authentication token. Please log in again.');
    onClose();
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const dto: ReviewActivityReportDto = {
      status,
      notes: notes.trim() || undefined,
    };

    try {
      await patchActivityReportStatus(token, reportId, dto);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update report status:', err);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Review Report #{reportId}</h3>
        {error && <div className="review-modal-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ActivityReportStatus)}
              disabled={isSubmitting}
            >
              <option value={ActivityReportStatus.PENDING}>Pending</option>
              <option value={ActivityReportStatus.REVIEWED}>Reviewed</option>
              <option value={ActivityReportStatus.RESOLVED}>Resolved</option>
              <option value={ActivityReportStatus.DISMISSED}>Dismissed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal review notes..."
              disabled={isSubmitting}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}