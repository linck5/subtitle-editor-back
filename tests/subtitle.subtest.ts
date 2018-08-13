var fs = require('fs');
import * as request from 'supertest';


export function test(server){



  it(`/POSTs a sub`, async () => {
      let res = await request(server)
          .post('/subtitles')
          .send({
              lines: [
                {
                  text: "test111",
                  startTime: 9400,
                  endTime: 10100
                },
                {
                  text: "test漢字ひらがなカタカナ",
                  startTime: 999888777666,
                  endTime: 0
                }
              ]
          })
          .expect(201);

          expect(res.body.lines.length).toBe(2);
          expect(res.body.lines[0].id).toBe(0);
          expect(res.body.lastId).toBe(1);

      return res;
  });


  it(`/POSTs a sub from ass string`, async () => {


      let res = await request(server)
          .post('/subtitles/fromAss')
          .send({
              assstring: fs.readFileSync('./tests/kaiji12.ass', "utf8")
          })
          .expect(201)


      expect(res.body.lastId).toBe(472)


      return res;
  });

}
