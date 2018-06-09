import { Model, Error, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserSchema, User, AddUserDTO, UpdateUserDTO } from './user.schema';
import { SecretKeysComponent } from '../common/secretKeys.service';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
// tslint:disable-next-line:component-class-suffix
export class UserService {

    constructor(
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('User') private readonly paginateUserModel: PaginateModel<User>
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


    async List(
      limit?:number,
      orderBy?:{field:string, desc:boolean}[],
      startingAfter?:string,
      endingBefore?:string //one of the two only
    ): Promise<PaginateResult<User>> {

      const sort:Object = {};
      orderBy.map(obj => sort[obj.field] = obj.desc? -1:1);

      return await this.paginateUserModel.paginate({}, {
        key: orderBy.length > 0? orderBy[0].field : undefined,
        sort: sort,
        startingAfter: startingAfter,
        endingBefore: endingBefore,
        limit: limit
      });

    }

    async Find(user: User): Promise<User> {
      return await this.userModel.findOne({ username: user.username });
    }
}
