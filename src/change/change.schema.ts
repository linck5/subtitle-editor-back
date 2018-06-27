import { Document, Schema } from 'mongoose';
import { User } from '../user/user.schema';
import { Commit } from '../commit/commit.schema';
var mongoosePaginate = require('mongoose-paginate');

export interface Change extends Document {
  lineIds: number[];
  user: User;
  commit: Commit;
  creation: Date;
  type: string;
  data: {
    startTime: number;
    endTime: number;
    text: string;
    //position? //TODO
  }

}

export const ChangeSchema = new Schema({
  lineIds: [{
    type: Number,
    required: true
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commit: {
    type: Schema.Types.ObjectId,
    ref: 'Commit',
    required: true,
    index: true
  },
  creation: {
    type: Date,
    default: Date.now()
  },
  type: {
    type: String,
    enum: ["CREATE", "EDIT", "TIME_SHIFT", "DELETE"],
    required: true
  },
  data: {
    startTime: {
      type: Number
    },
    endTime: {
      type: Number
    },
    text: {
      type: String
    }
    //position? //TODO
  }

});
ChangeSchema.plugin(mongoosePaginate);
