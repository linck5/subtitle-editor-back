import { Document, Schema } from 'mongoose';
import { User } from '../user/user.schema';
var mongoosePaginate = require('mongoose-paginate');

export interface Change extends Document {
  line_ids: number[];
  user_id: User;
  commit_id: Schema.Types.ObjectId;
  branch_id: Schema.Types.ObjectId;
  creation: Date;
  type: string;
  data: {
    startTime: number;
    endTime: number;
    text: string;
    //position? //TODO
    timeShift: number;
  }

}

export const ChangeSchema = new Schema({
  line_ids: [{
    type: Number,
    required: true
  }],
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commit_id: {
    type: Schema.Types.ObjectId,
    ref: 'Commit',
    required: true,
    index: true
  },
  branch_id: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
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
    },
    //position? //TODO
    timeShift: {
      type: Number
    }
  }

});
ChangeSchema.plugin(mongoosePaginate);
