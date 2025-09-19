export interface ReportedBond {
    bond_id: number;
    name: string;
    total_reports: string;   // API returns string "1"
    pending_reports: string; // API returns string "1"
  }
  
  export interface ReportedBondsData {
    bonds: ReportedBond[];
    total: number;
  }
  
  export interface ReportedBondsResponse {
    code: number;
    message: string;
    data: ReportedBondsData;
  }




  export interface BondReport {
    id: number;
    bond_id: number;
    reporter_id: string;
    reason: string;
    description: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    created_at: string;
    reviewed_at: string | null;
  }
  
  export interface BondReportsData {
    reports: BondReport[];
    total: number;
  }
  
  export interface BondReportsResponse {
    code: number;
    message: string;
    data: BondReportsData;
  }


  export enum ReportStatus {
    PENDING   = 'pending',
    REVIEWED  = 'reviewed',
    RESOLVED  = 'resolved',
    DISMISSED = 'dismissed',
  }
  
  export interface ReviewReportDto {
    status: ReportStatus;
    notes?: string;
  }

  export interface PatchReportResponse {
    code: number;
    message: string;
    data: BondReport; // single updated report
  }