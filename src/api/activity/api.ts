import type {
    ActivityResponse,
    TrendingActivitiesResponse,
    SingleActivityResponse,
  } from './types';
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // 👇 Existing admin activities endpoint
  export const getActivities = async (
    page: number = 1,
    limit: number = 5,
    token: string
  ): Promise<ActivityResponse> => {
    const url = new URL(`${API_BASE_URL}/api/activity/admin/list`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
  
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
  
    return await response.json();
  };
  
  // 👇 NEW: Trending activities endpoint
  export const getTrendingActivities = async (
    page: number = 1,
    limit: number = 5,
    token: string
  ): Promise<TrendingActivitiesResponse> => {
    const url = new URL(`${API_BASE_URL}/api/activity/admin/trending`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
  
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
  
    return await response.json();
  };
  
  // 👇 NEW: Get single activity by ID (admin-only)
  export const getActivityById = async (
    id: number,
    token: string
  ): Promise<SingleActivityResponse> => {
    const url = `${API_BASE_URL}/api/activity/admin/${id}`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
  
    return await response.json();
  };