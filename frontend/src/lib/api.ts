const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
  updatedAt: string;
}

export const createLink = async (url: string, code?: string): Promise<Link> => {
  const response = await fetch(`${BASE_URL}/api/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create link');
  }

  const data = await response.json();
  return data.link;
};

export const getAllLinks = async (): Promise<Link[]> => {
  const response = await fetch(`${BASE_URL}/api/links`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }
  const data = await response.json();
  console.log("response is ", data)
  return data.links;
};

export const getLinkStats = async (code: string): Promise<Link> => {
  // Debugging: log the code parameter
  console.log('Fetching stats for code:', code);
  
  const response = await fetch(`${BASE_URL}/api/links/${code}`);
    const data = await response.json();
    console.log("data is ", data)

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch link stats');
  }

  return data.link;
};

export const deleteLink = async (code: string): Promise<void> => {
  // Debugging: log the code parameter
  console.log('Deleting link with code:', code);
  
  const response = await fetch(`${BASE_URL}/api/links/${code}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete link');
  }
};

export const healthCheck = async (): Promise<{ ok: boolean; version: string }> => {
  const response = await fetch(`${BASE_URL}/healthz`);
  
  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
};