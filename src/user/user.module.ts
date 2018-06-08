import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {

}
