/// <reference types="mongoose" />

declare module 'mongoose' {

  export interface PaginateResult<T> {
    items: Array<T>;
    hasMore: boolean;
  }

  export interface PaginateOptions {
    startingAfter?: string;
    endingBefore?: string;
    limit?: number;
    sort?: Object;
    key?: string;
  }

  interface PaginateModel<T extends Document> extends Model<T> {
    paginate(
      query?: Object,
      options?: PaginateOptions,
      callback?: (err: any, result: PaginateResult<T>) => void
    ): Promise<PaginateResult<T>>;
  }

}
