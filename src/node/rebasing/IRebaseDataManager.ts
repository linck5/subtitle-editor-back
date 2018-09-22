import { RebaseData } from './rebase.schema';
import { Change } from '../../change/change.schema';

export interface IRebaseDataManager {
  rebaseData: RebaseData;
  hasConflicts: boolean;
  Compose(sourceChanges:Change[], targetLineChanges:Change[]);
}
