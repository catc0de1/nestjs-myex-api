import { Test, TestingModule } from '@nestjs/testing';
import { CsrfController } from './csrf.controller';

describe('CsrfController', () => {
  let controller: CsrfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsrfController],
    }).compile();

    controller = module.get<CsrfController>(CsrfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
