
import { IsString, IsInt, IsUrl, IsAscii, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class GetTreeByNameDTO {

  @IsString()
  readonly name: string;
}

export class CreateTreeDTO {

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

export class UpdateTreeDTO {

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

export class ListTreeDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const treeOrderByParams =
['name', 'creation', /*'subtitleTreeCount',*/ 'duration']
