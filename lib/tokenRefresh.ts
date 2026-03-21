/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from 'next-auth/react';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const session = await getSession();
  
  if (!session?.refreshToken) {
    return null;
  }

  if (isRefreshing) {
    // If already refreshing, wait for it
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      // Update session with new tokens
      // Note: You'll need to implement session update
      processQueue(null, data.data.accessToken);
      return data.data.accessToken;
    } else {
      processQueue(new Error('Refresh failed'), null);
      return null;
    }
  } catch (error) {
    processQueue(error, null);
    return null;
  } finally {
    isRefreshing = false;
  }
};