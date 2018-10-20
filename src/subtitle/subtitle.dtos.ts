
import { IsDefined } from 'class-validator';

export class ApplySubtitleDTO {

  @IsDefined()
  readonly changes: any[];
}
