
import { IsString, IsInt, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { UpdateBranchCollaboratorDTO } from './collaborator/collaborator.dtos'


export class UpdateBranchDTO {

  @IsString()
  readonly status: string;

  @IsBoolean()
  readonly deleted: boolean;

  @ValidateNested({ each: true })
  @Type(() => UpdateBranchCollaboratorDTO)
  readonly collaborators: UpdateBranchCollaboratorDTO[];
}

export class ListBranchDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const branchOrderByParams =
['status']
