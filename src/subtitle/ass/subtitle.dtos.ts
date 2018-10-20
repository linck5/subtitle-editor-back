
import { ValidateNested, IsString, IsDefined, IsInt } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateSubtitleFromASSFileDTO {

  @IsDefined()
  @IsString()
  readonly assstring: string;
}

export class ConvertToAssStringDTO {

  @IsDefined()
  readonly subtitleobj: Object;
}
