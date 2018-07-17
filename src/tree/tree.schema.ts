import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Tree extends Document {
  description: string;
  language: string;
  video_id: Schema.Types.ObjectId;
  subtitle_id:Schema.Types.ObjectId;
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
  video_id: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  subtitle_id: {
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
