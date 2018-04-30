import { Controller, Get, Req, Query } from '@nestjs/common';
import { MessageSenderService } from './messageSender.service';


@Controller('message')
export class MessageSenderController {
    constructor(private readonly messageSenderService: MessageSenderService) { }

    @Get()
    async getMessage(@Req() request): Promise<any> {
        return [{message: this.messageSenderService.getMessage()}];
    }
}
