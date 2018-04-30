import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
//import { DBConfigModule } from './dbConfig/dbConfig.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageSenderModule } from './messageSender/messageSender.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      MongooseModule.forRoot(process.env.DB_CONN),
      AuthModule, UserModule, CommonModule, MessageSenderModule
    ],

})
export class ApplicationModule { }
