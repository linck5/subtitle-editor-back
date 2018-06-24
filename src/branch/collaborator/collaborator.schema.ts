import { Document, Schema } from 'mongoose';
import { User } from '../../user/user.schema'

export interface Collaborator extends Document {
  User: User,
  Creator: boolean,
  Admin: boolean,
  Banned: boolean
}

export const CollaboratorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creator: Boolean,
  admin: Boolean,
  banned: Boolean

});
