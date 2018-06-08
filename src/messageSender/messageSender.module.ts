import { Module } from '@nestjs/common';
import { MessageSenderService } from './messageSender.service';
import { MessageSenderController } from './messageSender.controller';
@Module({
    providers: [MessageSenderService],
    controllers: [MessageSenderController]
})
export class MessageSenderModule {
}
