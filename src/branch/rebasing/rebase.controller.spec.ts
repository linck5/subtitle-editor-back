import { Test, TestingModule } from '@nestjs/testing';
import { RebaseController } from './rebase.controller';

describe('Rebase Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RebaseController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RebaseController = module.get<RebaseController>(RebaseController);
    expect(controller).toBeDefined();
  });
});
