
import { IsBoolean, IsMongoId, IsDefined } from 'class-validator';
import { Schema } from 'mongoose';

export class UpdateBranchCollaboratorDTO {

  @IsDefined()
  @IsMongoId()
  readonly user: Schema.Types.ObjectId;

  @IsBoolean()
  readonly creator:boolean;

  @IsBoolean()
  readonly admin:boolean;

  @IsBoolean()
  readonly banned:boolean;
}
