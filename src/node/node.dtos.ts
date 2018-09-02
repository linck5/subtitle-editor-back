
import { IsString, IsInt, IsBoolean, ValidateNested, IsMongoId, IsDefined,
Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { UpdateNodeCollaboratorDTO } from './collaborator/collaborator.dtos';
import { ResolvedRebaseDTO } from './rebasing/rebase.dtos';

export class CreateNodeDTO {

  @IsDefined()
  @IsMongoId()
  readonly creator_id: string;

  @IsDefined()
  @IsMongoId()
  readonly tree_id: string;
}

export class UpdateNodeDTO {

  @IsString()
  @Matches(/(?:IN_PROGRESS)|(?:FINISHED)|(?:APPROVED)/)
  readonly status: string;

  @IsBoolean()
  readonly deleted: boolean;

  @ValidateNested()
  @Type(() => ResolvedRebaseDTO)
  readonly resolvedRebase: ResolvedRebaseDTO;

  @ValidateNested({ each: true })
  @Type(() => UpdateNodeCollaboratorDTO)
  readonly collaborators: UpdateNodeCollaboratorDTO[];
}

export class ListNodeDTO {

  @IsBoolean()
  readonly isInMainline: boolean;

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const nodeOrderByParams =
['status']
