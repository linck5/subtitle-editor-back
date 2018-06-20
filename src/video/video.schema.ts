import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Video extends Document {
  name: string,
  description: string,
  duration: number,
  url: string,
  creation: Date
  //subtitleTrees: SubtitleTree[]
}

export const VideoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
    required: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  creation: {
    type: Date,
    default: Date.now()
  },
  trees: [{
    type: Schema.Types.ObjectId,
    ref: 'Tree'
  }],

});
VideoSchema.plugin(mongoosePaginate);
