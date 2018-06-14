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
    type: [{ type: String, enum: ['ADMIN', 'MODERATOR']}]
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
