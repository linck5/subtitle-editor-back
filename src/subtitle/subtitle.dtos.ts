
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateLineDTO } from './line/line.dtos'


export class CreateSubtitleDTO {

  @IsNotEmpty()
  readonly lines: CreateLineDTO[];
}

export class CreateSubtitleFromASSFileDTO {

  @IsString()
  readonly assstring: string;
}
