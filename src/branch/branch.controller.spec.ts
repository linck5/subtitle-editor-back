import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from './branch.controller';

describe('Branch Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BranchController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: BranchController = module.get<BranchController>(BranchController);
    expect(controller).toBeDefined();
  });
});
