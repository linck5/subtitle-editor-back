import { PipeTransform, Injectable } from '@nestjs/common';
import * as lowercaseKeys from 'lowercase-keys';

@Injectable()
export class LowercaseReqKeysPipe implements PipeTransform {

  transform(reqData:any, ) {
    return typeof reqData == 'object'? lowercaseKeys(reqData): reqData;
  }
}
