import { Model, Error, PaginateModel, PaginateResult, PaginateOptions } from 'mongoose';
import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserSchema, User, AddUserDTO, UpdateUserDTO, ListUserDTO } from './user.schema';
import { SecretKeysComponent } from '../common/secretKeys.service';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import { OrderByParam } from '../common/orderBy/orderByParamFormat';

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


    async List(dto:ListUserDTO): Promise<PaginateResult<User>> {


      let options:PaginateOptions = {
        sort: {}
      };



      //the pagination library won't work assigning undefined to
      //PaginateOptions feilds, so conditionally assign them:
      if(dto.limit) options.limit = dto.limit;
      if(dto.offset) options.offset = dto.offset;
      if(dto.page) options.page = dto.page;
      if(dto.orderBy && dto.orderBy.length > 0){
        dto.orderBy.map(orderByParam => {
          options.sort[orderByParam.field] = orderByParam.desc? -1:1
        });
      };

      //TODO move this somewhere else
      if(options.limit) options.limit = +options.limit;
      if(options.offset) options.offset = +options.offset;
      if(options.page) options.page = +options.page;

      return await this.paginateUserModel.paginate({}, options);

    }

    async FindByName(username: string): Promise<User> {
      return await this.userModel.findOne({ username: username });
    }
}
