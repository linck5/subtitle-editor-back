
import { IsString, IsInt } from 'class-validator';


export class CreateLineDTO {

  @IsString()
  readonly text:string;

  @IsInt()
  readonly startTime:number;

  @IsInt()
  readonly endTime:number;

  @IsInt()
  readonly positionX:number;

  @IsInt()
  readonly positionY:number;
}
