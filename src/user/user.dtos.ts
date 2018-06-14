
import { IsString, IsInt, MinLength, IsAscii, IsBoolean, IsDate
 } from 'class-validator';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';

export class AuthUserDTO {

  @IsString()
  readonly username: string;

  @MinLength(5)
  @IsAscii()
  readonly password: string;
}

export class AddUserDTO {

  @IsString()
  readonly username: string;

  @MinLength(5)
  @IsAscii()
  readonly password: string;

  @IsString({each: true})
  readonly roles: string[];

  @IsBoolean()
  readonly active: boolean;
}

export class UpdateUserDTO {

  @IsString({each: true})
  readonly roles: string[];

  @IsDate()
  readonly lastOnline: Date;

  @IsBoolean()
  readonly banned: boolean;

  @IsBoolean()
  readonly active: boolean;
}

export class ListUserDTO {

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderBy: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}
