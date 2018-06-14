import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class BooleanParserPipe implements PipeTransform {

  transform(reqData:Object) {

    Object.entries(reqData).forEach(([key, value]) => {
      if(value == 'true') reqData[key] = true;
      else if(value == 'false') reqData[key] = false;
    });

    return reqData;

  }
}
