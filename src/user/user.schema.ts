import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');


export interface User extends Document {
  username: string,
  password: string,
  roles: string[],
  //branches: Branch[],
  creation: Date,
  lastOnline: Date,
  banned: boolean,
  active: boolean
}

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [{ type: String, enum: ['ADMIN', 'MODERATOR'] }]
  },
  //branches: Branch[],
  creation: {
    type: Date,
    default: Date.now()
  },
  lastOnline: {
    type: Date
  },
  banned: {
    type: Boolean
  },
  active: {
    type: Boolean
  }
});
UserSchema.plugin(mongoosePaginate);

export class AuthUserDTO {
  readonly username: string;
  readonly password: string;
}

export class AddUserDTO {
  readonly username: string;
  readonly password: string;
  readonly roles: string[];
  readonly active: boolean;
}

export class UpdateUserDTO {
  readonly roles: string[];
  readonly lastOnline: Date;
  readonly banned: boolean;
  readonly active: boolean;
}

import { OrderByParam } from '../common/orderBy/orderByParamFormat';
export class ListUserDTO {
  readonly limit: number;
  readonly orderBy: OrderByParam[];
  readonly offset: number;
  readonly page: number;
}
