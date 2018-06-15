import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
//import { DBConfigModule } from './dbConfig/dbConfig.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoModule } from './video/video.module';

@Module({
    imports: [
      MongooseModule.forRoot(process.env.DB_CONN),
      AuthModule, UserModule, CommonModule, VideoModule
    ]

})
export class ApplicationModule { }
