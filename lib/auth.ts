export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Session {
  user: User;
  accessToken: string;
}

export const verifyToken = (token: string): Promise<User | null> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }).then(res => res.json());
};