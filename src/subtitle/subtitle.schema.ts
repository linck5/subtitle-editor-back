import { Document, Schema } from 'mongoose';


export interface Subtitle extends Document {
  format: string;
  original: string;
  data: any;
};

export const SubtitleFormats = {
  ASS: 'ASS'
};

export const SubtitleSchema = new Schema({

  format: {
    type: String,
    enum: [SubtitleFormats.ASS]
  },
  original: {
    type: String
  },
  data: {
    type: Object,
    required: true
  },

});
