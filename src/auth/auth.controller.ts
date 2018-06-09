import { Controller, Post, HttpCode, HttpStatus, HttpException, Body, Res, Req,
  Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, AuthUserDTO } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }



    @Post('/authenticate')
    async CreateToken( @Body() authUserDTO: AuthUserDTO) {
        const user = await this.userService.FindByName(authUserDTO.username)
        .catch(err => {
            throw new HttpException({
              code: 'noSuchId',
              message: 'User id not found'
            }, HttpStatus.BAD_REQUEST);
          }
        );

        if (!user || !compareSync(authUserDTO.password, user.password)) {
          throw new HttpException({
            code: 'authDenied',
            message: 'User not found or password does not match'
          }, HttpStatus.BAD_REQUEST);
        }

        else return this.authService.createToken(user);

    }
}
