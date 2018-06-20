import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export interface Commit extends Document {
  name: string,
  description: string,
  duration: number,
  url: string,
  creation: Date
  //subtitleTrees: SubtitleTree[]
}

export const CommitSchema = new Schema({
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
  }
  //subtitleTrees: SubtitleTree[]

});
CommitSchema.plugin(mongoosePaginate);
