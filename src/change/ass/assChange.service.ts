import { Model, Schema } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Change } from '../change.schema';
import { CreateAssChangeDTO } from './change.dtos';
import { AssChange } from './change';


@Injectable()
// tslint:disable-next-line:component-class-suffix
export class AssChangeService {

    constructor(
      @Inject('Change') private readonly assChangeModel: Model<Change>
    ) { }

    async Create(dto: CreateAssChangeDTO): Promise<Change> {
      //TODO should I verify here if the user is actually a collaborator and is authorized to make this change?

      const NewChange = new this.assChangeModel(dto);
      return await NewChange.save();
    }


}
