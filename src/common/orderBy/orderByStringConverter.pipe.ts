import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { OrderByParam } from './orderByParamFormat';


@Injectable()
export class OrderByStringConverterPipe implements PipeTransform {
  transform(query: any) {

    if(query.orderBy){
      query.orderBy = query.orderBy
      .trim().split(/\s*,\s*/)
      .map(orderByParam => {

        const [field, desc] = orderByParam.split(/\s+/);
        return {field:field, desc:!!desc};

      }) as OrderByParam[];

    }
    return query;
  }
}
