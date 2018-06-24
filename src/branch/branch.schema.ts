import { Document, Schema } from 'mongoose';
import { Collaborator, CollaboratorSchema } from './collaborator/collaborator.schema'
var mongoosePaginate = require('mongoose-paginate');

export interface Branch extends Document {
  collaborators: Collaborator[],
  status: string[],
  deleted: boolean,
  //TODO baseCommits: Commit[]
}

export const BranchSchema = new Schema({

  collaborators: {
    type: [CollaboratorSchema],
  },
  status: {
    type: String,
    enum: ["UNMODIFIED", "IN_PROGRESS", "FINISHED", "APPROVED", "MERGED"],
    default: "UNMODIFIED"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  //TODO
  // baseCommits: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Commit'
  // }]
});
BranchSchema.plugin(mongoosePaginate);
