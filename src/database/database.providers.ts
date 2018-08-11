import * as mongoose from 'mongoose';
import { Connection, Schema } from 'mongoose';
import { Mockgoose } from 'mockgoose-fix';

export const getCollectionProvider = (schema:Schema, collectionName:string)=>{
  return {
    provide: collectionName,
    useFactory: (connection: Connection) => connection.model(collectionName, schema),
    inject: ['DbConnectionToken'],
  }
}

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;

      //jest sets NODE_ENV to "test" automatically when testing
      if (process.env.NODE_ENV === 'test') {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.helper.setDbVersion('3.4.3');

        mockgoose.prepareStorage()
          .then(async () => {
            await mongoose.connect(process.env.DB_CONN);
          });
      }

      else {
        await mongoose.connect(process.env.DB_CONN);
      }

      return mongoose;
    },
  },
];

export const dsd = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (): Promise<typeof mongoose> => {
      return await mongoose.connect(process.env.DB_CONN)
    }

  },
];
