import { Document, Schema } from 'mongoose';
import { Collaborator, CollaboratorSchema } from './collaborator/collaborator.schema'
var mongoosePaginate = require('mongoose-paginate');

export interface Node extends Document {
  collaborators: Collaborator[];
  status: string;
  deleted: boolean;
  tree_id: Schema.Types.ObjectId[];

  //the source node of a rebased node is the node that rebased into
  //the mainline
  source_id: Schema.Types.ObjectId[];

  isInMainline: boolean;

  //the node index from where this node is based on. When a node is added
  //to the mainline it receives the current mainline length (which is kept in
  //the tree doc) -1 as its mainline base index.
  //This is used for:
  //1- finding all the nodes in the mainline and sorting them
  //2- see on which node a node outside the mainline is based on (for merging)
  mlBaseIndex: number;

}

export const NodeSchema = new Schema({

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
    ref: 'Node'
  },
  isInMainline: {
    type: Boolean,
    default: false,
    index: true
  },
  mlBaseIndex: {
    type: Number,
    required: true,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
});
NodeSchema.plugin(mongoosePaginate);
