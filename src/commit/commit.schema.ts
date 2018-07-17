import { Document, Schema } from 'mongoose';
import { Branch } from '../branch/branch.schema'
var mongoosePaginate = require('mongoose-paginate');

export interface Commit extends Document {
  description: string;
  branch_id: Schema.Types.ObjectId;
  done: boolean;
  comment_ids: Schema.Types.ObjectId[];
  creation: Date;

}

export const CommitSchema = new Schema({
  description: {
    type: String,
  },
  branch_id: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    index: true
  },
  done: {
    type: Boolean,
    default: false
  },
  //TODO comment_ids: Comment[],
  creation: {
    type: Date,
    default: Date.now()
  }
});
CommitSchema.plugin(mongoosePaginate);
