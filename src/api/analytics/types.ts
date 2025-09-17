// src/api/analytics/types.ts

export interface GetTotalUsersResponseData {
    total: number;
  }
  
  export interface GetTotalUsersResponse {
    code: number;
    message: string;
    data: GetTotalUsersResponseData;
  }

  export interface VerificationStats {
    count: number;
    percentage: number;
  }
  
  export interface GetUserVerificationResponseData {
    total: number;
    email_verified: VerificationStats;
    phone_verified: VerificationStats;
    both_verified: VerificationStats;
  }
  
  export interface GetUserVerificationResponse {
    code: number;
    message: string;
    data: GetUserVerificationResponseData;
  }

 // NEW: Demography Types
export interface AgeDemographic {
    bucket: string;
    count: string; // API returns string, we'll convert to number
  }
  
  export interface GenderDemographic {
    gender: string;
    count: string; // API returns string, we'll convert to number
  }
  
  export interface CountryDemographic {
    country: string | null;
    count: string; // API returns string, we'll convert to number
  }

  export interface GetUserDemographyResponseData {
    age: AgeDemographic[];
    gender: GenderDemographic[];
    countries: CountryDemographic[];
  }
  
  export interface GetUserDemographyResponse {
    code: number;
    message: string;
    data: GetUserDemographyResponseData;
  }

  export interface TimeSeriesDataPoint {
    label: string;
    count: number;
  }
  
  export interface AnalyticsOverviewData {
    signUps: TimeSeriesDataPoint[];
    active: TimeSeriesDataPoint[];
    churned: TimeSeriesDataPoint[];
  }

  export interface GetAnalyticsOverviewResponse {
    code: number;
    message: string;
    data: AnalyticsOverviewData;
  }