import { Injectable } from '@nestjs/common';
import { PaginateOptions } from 'mongoose';
@Injectable()
export class PaginationService {

  PaginateOptionsFromDto(dto:any):PaginateOptions{
    let options:PaginateOptions = {
      sort: {}
    };

    //the pagination library won't work assigning undefined to
    //PaginateOptions feilds, so conditionally assign them:
    if(dto.limit) options.limit = dto.limit;
    if(dto.offset) options.offset = dto.offset;
    if(dto.page) options.page = dto.page;
    if(dto.orderby && dto.orderby.length > 0){
      dto.orderby.map(orderByParam => {
        options.sort[orderByParam.field] = orderByParam.desc? -1:1
      });
    };

    return options;
  }

}
