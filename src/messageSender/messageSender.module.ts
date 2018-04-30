import { Module } from '@nestjs/common';
import { MessageSenderService } from './messageSender.service';
import { MessageSenderController } from './messageSender.controller';
@Module({
    components: [MessageSenderService],
    controllers: [MessageSenderController]
})
export class MessageSenderModule {
}
