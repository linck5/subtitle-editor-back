
import { IsString, IsInt, IsDate, IsMongoId, ValidateNested, IsNumber,
  IsDefined, Matches } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';
import { Schema } from 'mongoose';
import { Type } from 'class-transformer';




export class CreateChangeDTO {

  @IsDefined()
  @IsInt({each: true})
  readonly line_ids: number[];

  @IsDefined()
  @IsMongoId()
  readonly user_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly commit_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly node_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsString()
  @Matches(/(?:CREATE)|(?:EDIT)|(?:TIME_SHIFT)|(?:DELETE)/)
  readonly type: string;


  @ValidateNested()
  @Type(() => ChangeDataDTO)
  readonly data: ChangeDataDTO;

}


export class RebasedChangeDTO {

  @IsDefined()
  @IsInt({each: true})
  readonly line_ids: number[];

  @IsDefined()
  @IsMongoId()
  readonly user_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly commit_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsMongoId()
  readonly node_id: Schema.Types.ObjectId;

  @IsDefined()
  @IsString()
  readonly type: string;

  @IsDefined()
  @IsDate()
  readonly creation: Date;

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

export class ListOrderedMainlineChanges {

  @IsMongoId()
  readonly tree_id: Schema.Types.ObjectId;;
}


export class ChangeDataDTO {

  @IsNumber()
  readonly startTime: number; //milliseconds

  @IsNumber()
  readonly endTime: number; //milliseconds

  @IsString()
  readonly text: string;


  @IsNumber()
  readonly timeShift: number; //milliseconds

  //position? //TODO
}
