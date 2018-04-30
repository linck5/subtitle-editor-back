import { Document, Schema } from 'mongoose';


export class AddUserDTO {
   readonly username: string;
   readonly admin: boolean;
   readonly password: string;
}

export interface User extends Document {
    username: string;
    admin: boolean;
    password: string;
    createdAt: Date;
    lastOnline: Date;
    status: Object;
}

export const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean
    },
    password: {
        type: String
    },
    /* //TODO
    collaborators: {
      collection: 'collaborator' // map to many, can find branches through this
    },
    */
    created_at: {
      type: Date,
      defaultsTo: Date.now()
    },

    lastOnline: {
      type: Date
    },

    status: {
      type: String,
      enum: ['activation_needed', 'active', 'deactivated', 'banned'],
      required: true,
      default: 'activation_needed'
    }

});
