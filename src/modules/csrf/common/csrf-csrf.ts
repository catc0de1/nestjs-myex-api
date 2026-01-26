import { doubleCsrf } from 'csrf-csrf';

import type { Request } from 'express';

export const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  cookieName: process.env.NODE_ENV === 'production' ? '__Host-csrf' : 'csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  getSecret: () => process.env.CSRF_SECRET!,
  getSessionIdentifier: (req: Request) => {
    return req.sessionID ?? req.ip;
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});
