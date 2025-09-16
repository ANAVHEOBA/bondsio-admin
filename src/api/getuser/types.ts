// src/api/getuser/types.ts

export interface User {
    id: string;
    full_name: string | null;
    email: string;
    user_name: string | null;
    phone: string | null;
    bio: string | null;
    notification: boolean;
    country_id: number | null;
    dob: string | null; // Could be Date if parsed
    email_verified: boolean;
    profile_image: string | null;
    device_type: string | null;
    fcm_token: string | null;
    created_at: string; // ISO date string
  }
  
  export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface GetUserResponseData {
    users: User[];
    pagination: Pagination;
  }
  
  export interface GetUserResponse {
    code: number;
    message: string;
    data: GetUserResponseData;
  }