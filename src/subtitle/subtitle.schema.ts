import { Document, Schema } from 'mongoose';
import { Line, LineSchema } from './line/line.schema';

export interface Subtitle extends Document {
  lines: Line[];
  lastId: number;
}

export const SubtitleSchema = new Schema({
  lines: {
    type: [LineSchema],
    required: true
  },

  lastId: {
    type: Number,
    required: true
  }

});
