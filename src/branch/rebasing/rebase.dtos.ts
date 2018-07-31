
import { ValidateNested, IsMongoId, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { RebasedChangeDTO } from '../../change/change.dtos'

export class ResolvedRebaseDTO {

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => RebasedChangeDTO)
  readonly rebaseData: RebasedChangeDTO[];

  @IsDefined()
  @IsMongoId()
  readonly rebaseId: string;

}
