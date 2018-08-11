import { Model, PaginateModel, PaginateResult, PaginateOptions,
  ModelFindByIdAndUpdateOptions } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.schema';
import { CreateUserDTO, UpdateUserDTO, ListUserDTO } from './user.dtos';

import { genSaltSync, hashSync } from 'bcrypt';
import { PaginationService } from '../common/pagination.service';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class UserService {

    constructor(
      @Inject('User') private readonly userModel: Model<User>,
      @Inject('User') private readonly paginateUserModel: PaginateModel<User>,
      private readonly paginationService: PaginationService
    ) { }

    onModuleInit() { }

    async FindAll(): Promise<User[]> {
      return await this.userModel.find();
    }

    async Create(user: CreateUserDTO): Promise<User> {
      const NewUser = new this.userModel({
        username: user.username,
        password: hashSync(user.password, genSaltSync(10)),
        roles: user.roles,
        active: user.active
      });
      return await NewUser.save();
    }

    async Update(id, user: UpdateUserDTO): Promise<User> {
      const options:ModelFindByIdAndUpdateOptions = {
        new: true, // true to return the modified document rather than the original
        runValidators: true
      }
      return await this.userModel.findByIdAndUpdate(id, user, options);
    }

    async Delete(id): Promise<User> {
      return await this.userModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<User> {
      return await this.userModel.findById(id);
    }

    async List(dto:ListUserDTO): Promise<PaginateResult<User>> {

      let query:any = {};
      if(dto.active != undefined) query.active = dto.active;
      if(dto.banned != undefined) query.banned = dto.banned;

      const options = this.paginationService.PaginateOptionsFromDto(dto);

      return await this.paginateUserModel.paginate(query, options);

    }

    async FindByName(username: string): Promise<User> {
      return await this.userModel.findOne({ username: username });
    }
}
