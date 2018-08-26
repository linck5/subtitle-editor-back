import { Document, Schema } from 'mongoose';
import { Line, LineSchema } from './line/line.schema';



export interface Subtitle extends Document {
  format: string;
  original: string;
  lines: Line[];
  lastId: number;
}

export const SubtitleSchema = new Schema({

  format: {
    type: String
  },
  original: {
    type: String
  },
  lines: {
    type: [LineSchema],
    required: true
  },
  lastId: {
    type: Number,
    required: true
  }

});
