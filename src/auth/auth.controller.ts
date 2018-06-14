import { Controller, Post, HttpCode, HttpStatus, HttpException, Body, Res, Req,
  Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.schema';
import { AuthUserDTO } from '../user/user.dtos';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }



    @Post('/authenticate')
    async CreateToken( @Body() authUserDTO: AuthUserDTO) {
        const user = await this.userService.FindByName(authUserDTO.username);

        if (!user || !compareSync(authUserDTO.password, user.password)) {
          throw new HttpException(
            'User not found or password does not match'
          , HttpStatus.FORBIDDEN);
        }

        else return this.authService.createToken(user);

    }
}
