import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { PaginationService } from '../common/pagination.service';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
    ],
    providers: [UserService, PaginationService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {

}
