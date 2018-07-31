import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Tree extends Document {
  description: string;
  language: string;
  video_id: Schema.Types.ObjectId;
  subtitle_id:Schema.Types.ObjectId;
  creation: Date;
  mainlineLength: number;
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
  creation: {
    type: Date,
    default: Date.now()
  },
  mainlineLength: {
    type: Number,
    required: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }

});
TreeSchema.plugin(mongoosePaginate);
