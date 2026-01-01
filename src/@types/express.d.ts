import type { User } from '@/modules/users/user.entity';

declare module 'express' {
  interface Request {
    currentUser?: User;
  }
}
