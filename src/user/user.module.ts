import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { PaginationService } from '../common/pagination.service';
import { DatabaseModule } from '../database/database.module';
import { getCollectionProvider } from '../database/database.providers';


@Module({
    imports: [DatabaseModule],
    providers: [
      getCollectionProvider(UserSchema, "User"),
      UserService,
      PaginationService
    ],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {

}
