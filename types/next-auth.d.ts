import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    name?: string | null; // Add name for compatibility
    image?: string | null; // Add image for avatar
    role: string;
    accessToken?: string;
    refreshToken?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      name?: string | null; // Add name
      image?: string | null; // Add image for avatar
      role: string;
      accessToken?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    name?: string | null;
    image?: string | null;
    role: string;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}