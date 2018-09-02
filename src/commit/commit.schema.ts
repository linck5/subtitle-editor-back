import { Document, Schema } from 'mongoose';
import { Node } from '../node/node.schema'
var mongoosePaginate = require('mongoose-paginate');

export interface Commit extends Document {
  description: string;
  node_id: Schema.Types.ObjectId;
  done: boolean;
  comment_ids: Schema.Types.ObjectId[];
  creation: Date;

}

export const CommitSchema = new Schema({
  description: {
    type: String,
  },
  node_id: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
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
