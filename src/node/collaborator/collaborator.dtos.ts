
import { IsBoolean, IsMongoId, IsDefined } from 'class-validator';
import { Schema } from 'mongoose';

export class UpdateNodeCollaboratorDTO {

  @IsDefined()
  @IsMongoId()
  readonly user_id: Schema.Types.ObjectId;

  @IsBoolean()
  readonly creator:boolean;

  @IsBoolean()
  readonly admin:boolean;

  @IsBoolean()
  readonly banned:boolean;
}
