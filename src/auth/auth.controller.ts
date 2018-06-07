import { Controller, Post, HttpCode, HttpStatus, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @Post('/authenticate')
    async CreateToken( @Body() reqBody: User, @Res() res) {

        return await this.userService.Find(reqBody).then(user => {

            if (!user || !compareSync(reqBody.password, user.password)) {
              res.status(HttpStatus.BAD_REQUEST).json({
                code: 'authDenied',
                message: 'User not found or password does not match'
              });
            }
            else {
              return res.json(
                this.authService.createToken(user)
              );
            }
        });
    }
}
