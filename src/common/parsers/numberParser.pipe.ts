import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class NumberParserPipe implements PipeTransform {

  numberRegex:RegExp = /^\s*(?:\+|\-)?(?:(?:\.*\d+)|(?:\d+(?:\.\d+)?))\s*$/;

  transform(reqData:Object, {type}: ArgumentMetadata) {

    if(type == 'param') return reqData;

    Object.entries(reqData).forEach(([key, value]) => {
      if(this.numberRegex.test(value)){
        reqData[key] = parseFloat(value);
      }
    });

    return reqData;

  }
}
