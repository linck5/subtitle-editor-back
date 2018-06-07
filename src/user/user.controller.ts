import { Controller, Post, HttpCode, HttpStatus, Param, Res, Req, Get, Patch, Body, Delete } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User, AddUserDTO, UpdateUserDTO } from '../user/user.schema';

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
      return await this.userService.Create(addUserDTO)
      .then(addedUser => res.json(addedUser))
      .catch(err => res.status(HttpStatus.BAD_REQUEST).json({
          code: 'createError',
          error: err
        })
      );
  }

  @Patch('/user/:user_id')
  async Update( @Param('user_id') user_id, @Body() updateUserDTO:UpdateUserDTO, @Res() res) {
      return await this.userService.Update(user_id, updateUserDTO)
      .then(updatedUser => res.json(updatedUser))
      .catch(err => res.status(HttpStatus.BAD_REQUEST).json({
          code: 'updateError',
          error: err
        })
      );
  }

  @Delete('/user/:user_id')
  async Delete( @Param('user_id') user_id, @Res() res) {
      return await this.userService.Delete(user_id)
      .then(user => res.json(user))
      .catch(err => res.status(HttpStatus.BAD_REQUEST).json({
          code: 'noSuchId',
          message: 'User id not found'
        })
      );
  }

}
