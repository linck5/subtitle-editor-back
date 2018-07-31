import { Document, Schema } from 'mongoose';
import { Collaborator, CollaboratorSchema } from './collaborator/collaborator.schema'
var mongoosePaginate = require('mongoose-paginate');

export interface Branch extends Document {
  collaborators: Collaborator[];
  status: string;
  deleted: boolean;
  tree_id: Schema.Types.ObjectId[];

  //the source branch of a rebased branch is the branch that rebased into
  //the mainline
  source_id: Schema.Types.ObjectId[];

  isInMainline: boolean;

  //the branch index from where this branch is based on. When a branch is added
  //to the mainline it receives the current mainline length (which is kept in
  //the tree doc) -1 as its mainline base index.
  //This is used for:
  //1- finding all the branches in the mainline and sorting them
  //2- see on which branch a branch outside the mainline is based on (for merging)
  mainlineBaseIndex: number;

}

export const BranchSchema = new Schema({

  collaborators: {
    type: [CollaboratorSchema],
  },
  status: {
    type: String,
    enum: ["UNMODIFIED", "IN_PROGRESS", "FINISHED", "APPROVED", "REBASED", "ROOT"],
    default: "UNMODIFIED"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  tree_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tree'
  },
  source_id: {
    type: Schema.Types.ObjectId,
    ref: 'Branch'
  },
  isInMainline: {
    type: Boolean,
    default: false,
    index: true
  },
  mlBaseIndex: {
    type: Number,
    required: true,
    unique: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});
BranchSchema.plugin(mongoosePaginate);
