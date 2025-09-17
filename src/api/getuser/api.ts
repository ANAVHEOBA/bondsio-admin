import type { GetUserResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUsers = async (
  page: number = 1,
  limit: number = 20,
  token: string
): Promise<GetUserResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/admin-list?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};