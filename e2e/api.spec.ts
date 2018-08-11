import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { SubtitleModule } from '../src/subtitle/subtitle.module';
import { SubtitleService } from '../src/subtitle/subtitle.service';

describe('Subtitles', () => {
    const server = express();
    server.use(bodyParser.json());


    let sub;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [SubtitleModule],
          })
          .compile();

        const app = module.createNestApplication(server);
        await app.init();
    });

    it(`/POST a sub`, async () => {


        let res = await request(server)
            .post('/subtitles')
            .send({
                lines: [{
                  text: "test111",
                  startTime: 9400,
                  endTime: 10100
                }]
            })
            .expect(res => {
              console.log(res.body)

              sub = res.body;
            })



        return res;
    }, 5000000);

    it(`/GET a sub`, async(done) => {
        const subtitle = await request(server)
            .get('/subtitle/' + sub._id)
            .expect(200);


        console.log("sub body");
        console.log(subtitle.body)

        // expect(subtitle.name).toBe('Tiger');
        // expect(subtitle.age).toBe(2);
        // expect(subtitle.breed).toBe('Russian Blue');

        done();
    }, 5000000);
});
