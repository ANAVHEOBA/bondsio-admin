// src/api/login/api.ts

import type { LoginRequest, LoginResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};