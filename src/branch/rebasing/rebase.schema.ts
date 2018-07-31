import { Document, Schema } from 'mongoose';
import { Branch, BranchSchema } from '../branch.schema'
import { Change } from '../../change/change.schema'

export interface Rebase extends Document {
  sourceBranch: Branch;
  targetLineBranch_ids: Schema.Types.ObjectId;
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
  targetChange:Change;
  conflictingDataTypes:Array<string>;
}

export const RebaseSchema = new Schema({
  sourceBranch: {
    type: BranchSchema,
    required: true
  },
  targetLineBranch_ids: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  tree_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tree',
    required: true
  },
  rebaseData: {
    type: [Object],
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
