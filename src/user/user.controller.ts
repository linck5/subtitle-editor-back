import { Controller, Post, HttpCode, HttpStatus, Param, Res, Req, Get, Patch, Body } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, AddUserDTO } from '../user/user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get('/user/:user_id')
  async GetById( @Param('user_id') user_id, @Res() res) {
      return await this.userService.GetById(user_id)
      .then(user => res.json(user))
      .catch(err => res.status(HttpStatus.BAD_REQUEST).json({
          code: 'noSuchId',
          message: 'User id not found'
        })
      );
  }

  @Post('/users')
  async Create( @Body() addUserDTO:AddUserDTO, @Res() res) {
      return await this.userService.AddUser(addUserDTO)
      .then(addedUser => res.json(addedUser))
      .catch(err => res.status(HttpStatus.BAD_REQUEST).json({
          code: 'createError',
          error: err
        })
      );
  }

}
