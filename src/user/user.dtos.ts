
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

export class GetUserByNameDTO {

  @IsString()
  readonly username: string;
}

export class CreateUserDTO {

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
  readonly lastonline: Date;

  @IsBoolean()
  readonly banned: boolean;

  @IsBoolean()
  readonly active: boolean;
}

export class ListUserDTO {

  @IsBoolean()
  readonly active: boolean;

  @IsBoolean()
  readonly banned: boolean;

  @IsInt()
  readonly limit: number;

  @IsString()
  readonly orderby: OrderByParam[];

  @IsInt()
  readonly offset: number;

  @IsInt()
  readonly page: number;
}

export const userOrderByParams =
['username', 'creation', 'lastonline']
