import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Comment extends Document {
  change: Schema.Types.ObjectId;
  commit: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  content: string;
  creation: Date;
}

export const CommentSchema = new Schema({

  change: {
    type: Schema.Types.ObjectId,
    ref: 'Change'
  },
  commit: {
    type: Schema.Types.ObjectId,
    ref: 'Commit'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
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
