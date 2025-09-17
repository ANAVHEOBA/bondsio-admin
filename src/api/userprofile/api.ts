import type { UserProfileResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (
  userId: string,
  token: string
): Promise<UserProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/admin/profile/${userId}`, {
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