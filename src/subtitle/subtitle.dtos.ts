
import { IsString, IsInt, IsUrl, IsAscii, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class GetSubtitleByNameDTO {

  @IsString()
  readonly name: string;
}

export class CreateSubtitleDTO {

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

export class UpdateSubtitleDTO {

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

export class ListSubtitleDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const subtitleOrderByParams =
['name', 'creation', /*'subtitleTreeCount',*/ 'duration']
