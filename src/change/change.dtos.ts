
import { IsString, IsInt, IsUrl, IsMongoId, ValidateNested, IsNumber, IsDefined
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { Schema } from 'mongoose';
import { Type } from 'class-transformer';




export class CreateChangeDTO {

  @IsDefined()
  @IsInt({each: true})
  readonly lineIds: number[];

  @IsDefined()
  @IsMongoId()
  readonly user: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly commit: Schema.Types.ObjectId;

  @IsDefined()
  @IsString()
  readonly type: string;


  @ValidateNested()
  @Type(() => ChangeDataDTO)
  readonly data: ChangeDataDTO;

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
['type', 'user', 'commit'];


export class ChangeDataDTO {

  @IsNumber()
  readonly startTime: number;

  @IsNumber()
  readonly endTime: number;

  @IsString()
  readonly text: string;

  //position? //TODO
}
