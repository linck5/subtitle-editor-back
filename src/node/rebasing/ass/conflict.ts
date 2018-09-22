import {Conflict} from '../rebase.schema';

export interface AssConflict extends Conflict {
  conflictingLines:Array<number>;
  conflictingDataTypes:Array<{section: string, fields: Array<string>}>;
}
