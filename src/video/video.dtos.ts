
import { IsString, IsInt, IsUrl, IsAscii, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class CreateVideoDTO {

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

export class UpdateVideoDTO {

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

export class ListVideoDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderBy: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const videoOrderByParams =
['name', 'creation', /*'subtitleTreeCount',*/ 'duration']
