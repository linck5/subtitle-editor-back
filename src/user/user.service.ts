import { Model, Error } from 'mongoose';
import { Component, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserSchema, User, AddUserDTO, UpdateUserDTO } from './user.schema';
import { SecretKeysComponent } from '../common/secretKeys.service';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcrypt';

@Component()
// tslint:disable-next-line:component-class-suffix
export class UserService {

    constructor( @InjectModel(UserSchema) private readonly userModel: Model<User>) { }

    onModuleInit() {
      // setTimeout(()=>{
      //   this.addUserTest();
      // },2000)
    }

    async FindAll(): Promise<User[]> {
      return await this.userModel.find();
    }

    async addUserTest(): Promise<User> {
      const NewUser= new this.userModel({
        username: "testUser",
        password: hashSync("password", genSaltSync(10)),
        roles: ["ADMIN", "MODERATOR"],
        active: true
      });
      return await NewUser.save();
    }

    async AddUser(user: AddUserDTO): Promise<User> {
      const NewUser = new this.userModel({
        username: user.username,
        password: hashSync(user.password, genSaltSync(10)),
        roles: user.roles,
        active: user.active
      });
      return await NewUser.save();
    }

    async UpdateUser(id, user: UpdateUserDTO): Promise<User> {
      return await this.userModel.findByIdAndUpdate(id, user, {new: true});
    }

    async GetById(id): Promise<User> {
      return await this.userModel.findById(id);
    }

    async FindUser(user: User): Promise<User> {
      return await this.userModel.findOne({ username: user.username });
    }
}
