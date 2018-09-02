import { Document, Schema } from 'mongoose';
import { Node, NodeSchema } from '../node.schema'
import { Change } from '../../change/change.schema'

export interface Rebase extends Document {
  sourceNode: Node;
  targetLineNode_ids: Schema.Types.ObjectId;
  rebaseData: RebaseData;
  tree_id: Schema.Types.ObjectId;
  conflictsStatus: string;
  fulfilled: boolean;
  creation: Date;
}

export type RebaseData = (Change | Conflict)[];

export interface Conflict {
  conflictingLines:Array<number>;
  sourceChange:Change;
  targetChanges:Change[];
  conflictingDataTypes:Array<string>;
}

export const RebaseSchema = new Schema({
  sourceNode: {
    type: NodeSchema,
    required: true
  },
  targetLineNode_ids: {
    type: [Schema.Types.ObjectId],
    ref: 'Node',
    required: true
  },
  tree_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tree',
    required: true
  },
  rebaseData: {
    type: [Schema.Types.Mixed],
    required: true
  },
  conflictsStatus: {
    type: String,
    enum: ["NO_CONFLICTS", "PENDING", "RESOLVED"],
    required: true
  },
  fulfilled: {
    type: Boolean,
    default: false,
    index: true
  },
  creation: {
    type: Date,
    default: Date.now()
  }
});
