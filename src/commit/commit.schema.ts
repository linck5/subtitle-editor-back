import { Document, Schema } from 'mongoose';
import { Branch } from '../branch/branch.schema'
var mongoosePaginate = require('mongoose-paginate');

export interface Commit extends Document {
  description: string;
  branch: Branch;
  done: boolean;
  comments: Comment[];
  creation: Date;

}

export const CommitSchema = new Schema({
  description: {
    type: String,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    index: true
  },
  done: {
    type: Boolean,
    default: false
  },
  //comments: Comment[],
  creation: {
    type: Date,
    default: Date.now()
  }
});
CommitSchema.plugin(mongoosePaginate);
