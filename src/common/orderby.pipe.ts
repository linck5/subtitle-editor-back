import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException,
HttpException, HttpStatus } from '@nestjs/common';

class ListQuery {
  readonly limit: number;
  readonly orderBy: string;
  readonly startingAfter: string;
  readonly endingBefore: string;
}

@Injectable()
export class OrderByFormatValidationPipe implements PipeTransform {
  transform(query: ListQuery, metadata: ArgumentMetadata) {

    if(query.orderBy){
      query.orderBy.trim().split(/\s*,\s*/).map(orderByParam => {

        if(orderByParam == ""){
          throw new HttpException({
            code: 'placeholder',
            message: 'An orderBy param is empty'
          }, HttpStatus.BAD_REQUEST);
        }

        const orderByParamValues = orderByParam.split(/\s+/);

        if(orderByParamValues.length > 2){
          throw new HttpException({
            code: 'placeholder',
            message: 'Invalid orderBy format'
          }, HttpStatus.BAD_REQUEST);
        }

        const desc = orderByParamValues[1];

        if(desc && desc != "desc"){
          throw new HttpException({
            code: 'placeholder',
            message: 'Invalid orderBy format'
          }, HttpStatus.BAD_REQUEST);
        }

      })
    }
    return query;
  }
}
