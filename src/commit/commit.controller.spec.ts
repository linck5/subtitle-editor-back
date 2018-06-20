import { Test, TestingModule } from '@nestjs/testing';
import { CommitController } from './commit.controller';

describe('Commit Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CommitController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: CommitController = module.get<CommitController>(CommitController);
    expect(controller).toBeDefined();
  });
});
