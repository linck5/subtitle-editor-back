
import { ValidateNested, IsString, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateSubtitleFromASSFileDTO {

  @IsDefined()
  @IsString()
  readonly assstring: string;
}

export class ApplySubtitleDTO {

  @IsDefined()
  readonly changes: any[];
}
