import { CsrfMiddleware } from './csrf.middleware';

describe('CsrfMiddleware', () => {
  it('should be defined', () => {
    expect(new CsrfMiddleware()).toBeDefined();
  });
});
