import { Model, Error } from 'mongoose';
import { Component, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserSchema, User, AddUserDTO } from './user.schema';
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
        admin: true,
        password: hashSync("password", genSaltSync(10))
      });
      return await NewUser.save();
    }

    async FindUser(user: User): Promise<User> {
      return await this.userModel.findOne({ username: user.username });
    }
}
