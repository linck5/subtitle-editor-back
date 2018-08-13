import * as request from 'supertest';
import { getNestMongoApp } from './setupServer';
require('jest');

import { test } from './subtitle.subtest'




jest.setTimeout(1000 * 60); //one minute


describe('Subtitles', () => {


    let server;

    beforeAll(async () => {
      server = await getNestMongoApp();

      test(server);
    });



    it(`/GETs users`, async(done) => {
        const subtitle = await request(server)
            .get('/users' )
            .expect(200);

        done();
    });
});
