
import { IsString, IsInt, IsUrl, IsAscii, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class GetChangeByNameDTO {

  @IsString()
  readonly name: string;
}

export class CreateChangeDTO {

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

export class UpdateChangeDTO {

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

export class ListChangeDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const changeOrderByParams =
['name', 'creation', /*'subtitleTreeCount',*/ 'duration']
