import { IsString, IsInt, IsMongoId, ValidateNested, IsNumber,
  IsDefined, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChangeDTO, RebasedChangeDTO } from '../change.dtos';


export class CreateAssChangeDTO extends CreateChangeDTO {

  @ValidateNested()
  @Type(() => AssChangeDataDTO)
  readonly data: AssChangeDataDTO;

}

export class RebasedAssChangeDTO extends RebasedChangeDTO {

  @ValidateNested()
  @Type(() => AssChangeDataDTO)
  readonly data: AssChangeDataDTO;

}

export class AssChangeDataDTO {

  @IsString()
  @Matches(/(?:script_info)|(?:styles)|(?:dialogues)/)
  readonly section: string;

  @IsInt({each: true})
  readonly ids: number[];

  @IsInt()
  readonly timeShift: number;

  @ValidateNested({each: true})
  @Type(() => AssChangeDataFieldDTO)
  readonly fields: AssChangeDataFieldDTO[];
}

export class AssChangeDataFieldDTO {

    @IsDefined()
    @IsString()
    readonly name: string;

    @IsDefined()
    readonly value: any
}
