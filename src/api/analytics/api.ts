// src/api/analytics/api.ts

import type { 
    GetTotalUsersResponse, 
    GetUserVerificationResponse,
    GetUserDemographyResponse,
    GetAnalyticsOverviewResponse
  } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTotalUsers = async (
  token: string
): Promise<GetTotalUsersResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/user/analytics/total`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};


export const getUserVerificationStats = async (
    token: string
  ): Promise<GetUserVerificationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/user/analytics/users/verification`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.json();
  };


  export const getUserDemographyStats = async (
    token: string
  ): Promise<GetUserDemographyResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/user/analytics/users/demography`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.json();
  };


  export const getAnalyticsOverview = async (
    token: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<GetAnalyticsOverviewResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/user/analytics/overview?period=${period}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      }
    );
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const result = await response.json();
  
  // Convert string counts to numbers
    const processDataPoints = (data: Array<{label: string, count: string | number}>) => 
      data.map(item => ({
        label: item.label,
        count: typeof item.count === 'string' ? parseInt(item.count) : item.count
      }));
  
  return {
      ...result,
      data: {
        signUps: processDataPoints(result.data.signUps),
        active: processDataPoints(result.data.active),
        churned: processDataPoints(result.data.churned)
      }
    };
  };