import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Comment extends Document {
  change_id: Schema.Types.ObjectId;
  commit_id: Schema.Types.ObjectId;
  author_id: Schema.Types.ObjectId;
  content: string;
  creation: Date;
}

export const CommentSchema = new Schema({

  change_id: {
    type: Schema.Types.ObjectId,
    ref: 'Change'
  },
  commit_id: {
    type: Schema.Types.ObjectId,
    ref: 'Commit'
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  creation: {
    type: Date,
    default: Date.now()
  }
});
CommentSchema.plugin(mongoosePaginate);
