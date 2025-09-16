// src/api/login/types.ts

export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponseData {
    id: string;
    email: string;
    role: string;
    access_token: string;
  }
  
  export interface LoginResponse {
    code: number;
    message: string;
    data: LoginResponseData;
  }