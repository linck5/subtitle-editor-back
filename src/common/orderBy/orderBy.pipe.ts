import { PipeTransform, Injectable, HttpException,
  HttpStatus } from '@nestjs/common';
import { OrderByParam } from './orderByParamFormat';

@Injectable()
export class OrderByPipe implements PipeTransform {

  constructor(private readonly allowedOrderByParams){}

  transform(query: any) {
    if(!query.orderby) return query;

    query.orderby = query.orderby
    .trim()
    .split(/\s*,\s*/)
    .map(orderByParam => {

      if(orderByParam == ""){
        throw new HttpException(
          'An orderby param is empty',
          HttpStatus.BAD_REQUEST);
      }

      let orderByParamValues = orderByParam.split(/\s+/);

      if(orderByParamValues.length > 2){
        throw new HttpException(
          'Invalid orderby format',
          HttpStatus.BAD_REQUEST);
      }

      let [field, desc] = orderByParamValues;

      field = field.toLowerCase();

      if(!this.allowedOrderByParams.find(param => param == field)){
        throw new HttpException(
          `"${field}" is an innvalid orderby field. `+
          `Allowed fields are: ${this.allowedOrderByParams}`,
          HttpStatus.BAD_REQUEST);
      }

      if(desc && desc != "desc"){
        throw new HttpException(
          'Invalid orderby format',
          HttpStatus.BAD_REQUEST);
      }

      return {field:field, desc:!!desc};

    }) as OrderByParam[];

    return query;
  }
}
