export interface ActivityReport {
    id: number;
    activity_id: number;
    reporter_id: string;
    reason: string;
    description: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'; // ← Exact backend union
    created_at: string;
    reviewed_at: string | null;
  }
  
  export interface ActivityReportsData {
    reports: ActivityReport[];
    total: number;
  }
  
  export interface ActivityReportsResponse {
    code: number;
    message: string;
    data: ActivityReportsData;
  }
  
  // ✅ ENUM WITH ALL FOUR STATUS VALUES (matches backend exactly)
  export enum ActivityReportStatus {
    PENDING   = 'pending',
    REVIEWED  = 'reviewed',
    RESOLVED  = 'resolved',   // ← Included ✅
    DISMISSED = 'dismissed',
  }
  
  // DTO used when submitting a review
  export interface ReviewActivityReportDto {
    status: ActivityReportStatus;
    notes?: string;
  }
  
  // Response after PATCHing a report
  export interface PatchActivityReportResponse {
    code: number;
    message: string;
    data: ActivityReport; // single updated report
  }