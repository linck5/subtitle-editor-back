
import { IsString, IsInt, IsUrl, IsAscii, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class GetBranchByNameDTO {

  @IsString()
  readonly name: string;
}

export class CreateBranchDTO {

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsInt()
  readonly duration: number;

  @IsUrl()
  @IsString()
  readonly url: string;
}

export class UpdateBranchDTO {

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsInt()
  readonly duration: number;

  @IsUrl()
  @IsString()
  readonly url: string;
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
['name', 'creation', /*'subtitleTreeCount',*/ 'duration']
