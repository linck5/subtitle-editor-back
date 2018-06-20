import { Test, TestingModule } from '@nestjs/testing';
import { ChangeController } from './change.controller';

describe('Change Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ChangeController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ChangeController = module.get<ChangeController>(ChangeController);
    expect(controller).toBeDefined();
  });
});
