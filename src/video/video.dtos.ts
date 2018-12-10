
import { IsString, IsInt, IsUrl, IsMongoId, IsDefined, IsArray } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class GetVideoByNameDTO {

  @IsDefined()
  @IsString()
  readonly name: string;
}

export class CreateVideoDTO {

  @IsDefined()
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsDefined()
  @IsInt()
  readonly duration: number;

  @IsDefined()
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

  @IsMongoId({each: true})
  readonly trees: string[];
}

export class ListVideoDTO {

  @IsArray()
  readonly ids: number[];

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const videoOrderByParams =
['name', 'creation', 'duration']
