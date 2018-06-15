import { PipeTransform, Injectable, ArgumentMetadata, HttpException,
  HttpStatus } from '@nestjs/common';

@Injectable()
export class OrderByFormatValidationPipe implements PipeTransform {

  constructor(private readonly allowedOrderByParams){}

  transform(query: any) {

    if(query.orderBy){
      query.orderBy.trim().split(/\s*,\s*/).map(orderByParam => {

        if(orderByParam == ""){
          throw new HttpException(
            'An orderBy param is empty',
            HttpStatus.BAD_REQUEST);
        }

        const orderByParamValues = orderByParam.split(/\s+/);

        if(orderByParamValues.length > 2){
          throw new HttpException(
            'Invalid orderBy format',
            HttpStatus.BAD_REQUEST);
        }

        const [field, desc] = orderByParamValues;

        if(!this.allowedOrderByParams.find(param => param == field)){
          throw new HttpException(
            `"${field}" is an innvalid orderBy field. `+
            `Allowed fields are: ${this.allowedOrderByParams}`,
            HttpStatus.BAD_REQUEST);
        }

        if(desc && desc != "desc"){
          throw new HttpException(
            'Invalid orderBy format',
            HttpStatus.BAD_REQUEST);
        }

      })
    }
    return query;
  }
}
