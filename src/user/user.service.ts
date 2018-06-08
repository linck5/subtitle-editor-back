import { Model, Error, PaginateModel, PaginateResult } from 'mongoose';
import { Component, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserSchema, User, AddUserDTO, UpdateUserDTO } from './user.schema';
import { SecretKeysComponent } from '../common/secretKeys.service';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcrypt';

@Component()
// tslint:disable-next-line:component-class-suffix
export class UserService {

    constructor(
      @InjectModel(UserSchema) private readonly userModel: Model<User>,
      @InjectModel(UserSchema) private readonly paginateUserModel: PaginateModel<User>
    ) { }

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

    async Create(user: AddUserDTO): Promise<User> {
      const NewUser = new this.userModel({
        username: user.username,
        password: hashSync(user.password, genSaltSync(10)),
        roles: user.roles,
        active: user.active
      });
      return await NewUser.save();
    }

    async Update(id, user: UpdateUserDTO): Promise<User> {
      return await this.userModel.findByIdAndUpdate(id, user, {new: true});
    }

    async Delete(id): Promise<User> {
      return await this.userModel.findByIdAndRemove(id);
    }

    async GetById(id): Promise<User> {
      return await this.userModel.findById(id);
    }

    async List(): Promise<PaginateResult<User>> {
      return await this.paginateUserModel.paginate({}, {
        sort: { '_id': -1 },
        //startingAfter: '5b19c1635bc38f4ba0f4b8c9',
        limit: 3
      });

    }

    async Find(user: User): Promise<User> {
      return await this.userModel.findOne({ username: user.username });
    }
}
