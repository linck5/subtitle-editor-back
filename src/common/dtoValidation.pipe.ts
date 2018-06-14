import { PipeTransform, Injectable, ArgumentMetadata, HttpException,
  HttpStatus } from '@nestjs/common';

import { validate, ValidatorOptions, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';


@Injectable()
export class DTOValidationPipe implements PipeTransform<any> {

  options:ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: true
  }

  async transform(dto, {metatype}: ArgumentMetadata) {

    const dtoClass = plainToClass(metatype, dto);

    const errors:ValidationError[] = await validate(dtoClass, this.options);

    if(errors.length > 0){
      throw new HttpException({
        code: 'validationError',
        message: Object.values(errors[0].constraints)[0]
      }, HttpStatus.BAD_REQUEST);
    }

    return dto;
  }
}
