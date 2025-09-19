import { useEffect, useState } from 'react';
import { getReportedBonds } from '../../api/reportedBonds/api';
import type { ReportedBondsResponse } from '../../api/reportedBonds/types';
import './ReportedBondList.css';
import { Link } from 'react-router-dom';

interface Props {
  token: string;
}

export default function ReportedBondList({ token }: Props) {
  const [data, setData] = useState<ReportedBondsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    setLoading(true);
    setError(null);

    getReportedBonds(token)
      .then((response) => {
        if (isMounted) {
          setData(response);
        }
      })
      .catch((e: unknown) => {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (loading) {
    return <p className="bond-list-info" aria-live="polite">Loading reported bonds…</p>;
  }

  if (error) {
    return (
      <p className="bond-list-info error" role="alert">
        Error: {error}
      </p>
    );
  }

  if (!data?.data.bonds || data.data.bonds.length === 0) {
    return <p className="bond-list-info">No reported bonds found.</p>;
  }

  return (
    <div className="bond-list-wrapper" role="region" aria-label="List of reported bonds">
      <table className="bond-table" aria-label="Reported bonds table">
        <thead>
          <tr>
            <th scope="col">Bond ID</th>
            <th scope="col">Name</th>
            <th scope="col">Total Reports</th>
            <th scope="col">Pending Reports</th>
          </tr>
        </thead>
        <tbody>
          {data.data.bonds.map((b) => (
            <tr key={b.bond_id} className="clickable-row">
              <td>
                <Link to={`/reports/bonds/${b.bond_id}`} aria-label={`View reports for bond ${b.name}`}>
                  {b.bond_id}
                </Link>
              </td>
              <td>
                <Link to={`/reports/bonds/${b.bond_id}`} aria-label={`View reports for bond ${b.name}`}>
                  {b.name}
                </Link>
              </td>
              <td>
                <Link to={`/reports/bonds/${b.bond_id}`} aria-label={`View reports for bond ${b.name}`}>
                  {b.total_reports}
                </Link>
              </td>
              <td>
                <Link to={`/reports/bonds/${b.bond_id}`} aria-label={`View reports for bond ${b.name}`}>
                  {b.pending_reports}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}