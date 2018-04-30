import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
@Component()
export class MessageSenderService {

    getMessage(): String {
      return "Message from MSS server!!";
    }

}
