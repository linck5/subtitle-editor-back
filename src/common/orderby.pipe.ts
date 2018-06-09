import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException,
HttpException, HttpStatus } from '@nestjs/common';
import { ListUserDTO } from '../user/user.schema'

@Injectable()
export class OrderByFormatValidationPipe implements PipeTransform {
  transform(query: ListUserDTO, metadata: ArgumentMetadata) {

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
