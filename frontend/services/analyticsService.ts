import { TaskStats } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/v1`;

export interface HeatmapData {
  high: number;
  medium: number;
  low: number;
}

export interface DistributionData {
  distribution: Record<string, number>;
}

export async function fetchStats(token: string): Promise<TaskStats> {
  const response = await fetch(`${API_URL}/analytics/stats`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch stats' }));
    throw new Error(error.detail || 'Failed to fetch stats');
  }
  
  return response.json();
}

export async function fetchHeatmap(token: string): Promise<HeatmapData> {
  const response = await fetch(`${API_URL}/analytics/heatmap`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch heatmap data');
  }
  
  return response.json();
}

export async function fetchDistribution(token: string): Promise<DistributionData> {
  const response = await fetch(`${API_URL}/analytics/distribution`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch distribution data');
  }
  
  return response.json();
}
