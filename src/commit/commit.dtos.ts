
import { IsString, IsInt, IsUrl, IsDefined, IsMongoId, IsBoolean
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';


export class CreateCommitDTO {

  @IsString()
  readonly description: string;

  @IsDefined()
  @IsMongoId()
  readonly node_id: string;
}

export class UpdateCommitDTO {

  @IsString()
  readonly description: string;

  @IsBoolean()
  readonly done: boolean;
}

export class ListCommitDTO {

  @IsBoolean()
  readonly done:boolean;

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const commitOrderByParams =
['node']
