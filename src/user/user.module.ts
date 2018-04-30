import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
    ],
    components: [UserService],
    controllers: [],
    exports: [UserService]
})
export class UserModule {

}
