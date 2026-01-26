import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { generateCsrfToken } from './common/csrf-csrf';

import type { Request, Response } from 'express';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getToken(@Req() req: Request, @Res() res: Response) {
    // if (!req.session) {
    //   throw new Error('Session not initialized');
    // }

    // req.session.csrf = true;

    const token = generateCsrfToken(req, res);

    return res.json({ csrfToken: token });
  }

  @Get('dummy-get')
  dummyGet() {
    return { message: 'GET request success (CSRF not checked)' };
  }

  @Post('dummy-post')
  dummyPost(@Body() body: string) {
    return { message: 'POST request success (CSRF validated)', data: body };
  }
}
