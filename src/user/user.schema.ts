import { Document, Schema } from 'mongoose';


export class AddUserDTO {
   readonly username: string;
   readonly password: string;
   readonly roles: string[];
   readonly active: boolean;
}

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
    required: true
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
    defaultsTo: Date.now()
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
