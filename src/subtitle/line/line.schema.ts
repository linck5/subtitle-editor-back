import { Document, Schema } from 'mongoose';

export interface Line extends Document {
  id: number;
  startTime:number;
  endTime:number;
  text:string;

  // TODO
  //positionX:number;
  //positionY:number;
}

export const LineSchema = new Schema({
  id: {
    type: Number,
    index: true
  },
  text: {
    type: String,
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  endTime: {
    type: Number,
    required: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  positionX: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  positionY: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },

}, {_id: false});
