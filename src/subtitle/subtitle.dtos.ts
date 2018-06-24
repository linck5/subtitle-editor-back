
import { ValidateNested, IsString, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLineDTO } from './line/line.dtos'


export class CreateSubtitleDTO {

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CreateLineDTO)
  readonly lines: CreateLineDTO[];
}

export class CreateSubtitleFromASSFileDTO {

  @IsDefined()
  @IsString()
  readonly assstring: string;
}
