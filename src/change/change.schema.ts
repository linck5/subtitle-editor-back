import { Document, Schema } from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

export enum ChangeOperation {
    Create = "CREATE",
    Edit = "EDIT",
    TimeShift = "TIME_SHIFT",
    Delete = "DELETE"
}

export interface Change extends Document {
  user_id: Schema.Types.ObjectId;
  commit_id: Schema.Types.ObjectId;
  node_id: Schema.Types.ObjectId;
  creation: Date;
  operation: ChangeOperation;
  data: any;
}

export const ChangeSchema = new Schema({
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
  node_id: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
    required: true,
    index: true
  },
  creation: {
    type: Date,
    default: Date.now()
  },
  operation: {
    type: String,
    enum: ["CREATE", "EDIT", "TIME_SHIFT", "DELETE"],
    required: true
  },
  data: {
    type: Object,
  }

});
ChangeSchema.plugin(mongoosePaginate);

// const c = {
//   line_ids: [5],
//   user_id: '5349b4ddd2781d08c09890f3',
//   commit_id: '5349b4ddd2781d08c09890m4',
//   node_id: '5349b4ddd2781d08c09890cc',
//   operation: "EDIT",
//   data: {
//
//     text: "普通な漢字"
//   }
// }
