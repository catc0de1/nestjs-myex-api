import { ThrottleGuard } from './throttle.guard';

describe('ThrottleGuard', () => {
  it('should be defined', () => {
    expect(new ThrottleGuard()).toBeDefined();
  });
});
