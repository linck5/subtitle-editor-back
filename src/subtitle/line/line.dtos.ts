
import { IsString, IsInt, IsDefined } from 'class-validator';


export class CreateLineDTO {

  @IsDefined()
  @IsString()
  readonly text:string;

  @IsDefined()
  @IsInt()
  readonly startTime:number;

  @IsDefined()
  @IsInt()
  readonly endTime:number;

  @IsInt()
  readonly positionX:number;

  @IsInt()
  readonly positionY:number;
}
