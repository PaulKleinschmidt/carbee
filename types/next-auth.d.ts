import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Augmenting types to include accessToken - https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  interface User {
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
  }
}
