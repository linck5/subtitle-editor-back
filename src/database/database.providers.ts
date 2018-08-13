import * as mongoose from 'mongoose';
import { Connection, Schema } from 'mongoose';
import { Mockgoose } from 'mockgoose-fix';

const dbToken:string = 'DbConnectionToken';


export const databaseProviders = [
  {
    provide: dbToken,
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;

      //jest sets NODE_ENV to "test" automatically when testing
      if (process.env.NODE_ENV === 'test') {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.helper.setDbVersion('3.4.3');

        mockgoose.prepareStorage()
          .then(async () => {
            //mockgoose intercepts mongoose.connect() and creates an empty local mongod
            await mongoose.connect('');
          });
      }

      else {
        await mongoose.connect(process.env.DB_CONN);
      }

      return mongoose;
    },
  },
];

export const getCollectionProvider = (schema:Schema, collectionName:string)=>{
  return {
    provide: collectionName,
    useFactory: (connection: Connection) => connection.model(collectionName, schema),
    inject: [dbToken],
  }
}
