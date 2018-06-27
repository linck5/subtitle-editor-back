import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Tree extends Document {
  description: string;
  language: string;
  video: Schema.Types.ObjectId;
  subtitle:Schema.Types.ObjectId;
  mainline:Schema.Types.ObjectId[];
  creation: Date;
}

export const TreeSchema = new Schema({

  description: {
    type: String,
  },
  language: {
    type: String,
    required: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  subtitle: {
    type: Schema.Types.ObjectId,
    ref: 'Subtitle',
    required: true
  },
  mainline: [{
    type: Schema.Types.ObjectId,
    ref: 'Commit'
  }],
  creation: {
    type: Date,
    default: Date.now()
  }

});
TreeSchema.plugin(mongoosePaginate);
