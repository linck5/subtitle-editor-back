import { Test, TestingModule } from '@nestjs/testing';
import { SubtitleController } from './subtitle.controller';

describe('Subtitle Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SubtitleController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SubtitleController = module.get<SubtitleController>(SubtitleController);
    expect(controller).toBeDefined();
  });
});
