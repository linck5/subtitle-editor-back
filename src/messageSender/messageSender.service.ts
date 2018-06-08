import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
@Injectable()
export class MessageSenderService {

    getMessage(): String {
      return "Message from MSS server!!";
    }

}
