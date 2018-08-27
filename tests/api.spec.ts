import * as request from 'supertest';
import { getNestMongoApp } from './setupServer';
var fs = require('fs');
require('jest');




jest.setTimeout(1000 * 60); //one minute


describe('Api Tests', () => {


  var server;
  var testData = {
    users: {
      adm1: null,
      user1: null,
    },
    videos: {
      video1: null,
      video2: null
    },
    subtitles: {
      subtitle1: null
    }
  };

  const postChangeWithTemplate = (template, change) =>{
    return request(server)
      .post("/changes")
      .send(Object.assign(change, template));
  }

  beforeAll(async () => {
    server = await getNestMongoApp();
  });

  describe('Insert some test data on mock db', () => {

    it("should /POST some users", async () => {
      let res1 = await request(server)
        .post('/users')
        .send({
          username: "adm1",
          password: "adm1pw",
          roles: ["MODERATOR", "ADMIN"]
        })
        .expect(201);

      let res2 = await request(server)
        .post('/users')
        .send({
          username: "user1",
          password: "user1pw"
        })
        .expect(201);

      testData.users.adm1 = res1.body;
      testData.users.user1 = res2.body;


    });

    it("should /POST some videos", async () => {
      let res1 = await request(server)
        .post('/videos')
        .send({
          name:"灰と幻想のグリムガル Episode 9",
          description:"Hai to Gensou no Grimgar - Fear, survival, instinct. Thrown into a foreign land with nothing but hazy memories and the knowledge of their name, they can feel only these three emotions resonating deep within their souls. A group of strangers is given no other choice than to accept the only paying job in this game-like world—the role of a soldier in the Reserve Army—and eliminate anything that threatens the peace in their new world, Grimgar. When all of the stronger candidates join together, those left behind must create a party together to survive: Manato, a charismatic leader and priest; Haruhiro, a nervous thief; Yume, a cheerful hunter; Shihoru, a shy mage; Mogzo, a kind warrior; and Ranta, a rowdy dark knight. Despite its resemblance to one, this is no game—there are no redos or respawns; it is kill or be killed. It is now up to this ragtag group of unlikely fighters to survive together in a world where life and death are separated only by a fine line.",
          duration: 1000 * 60 * 23,
          url: "https://animelon.com/video/5aac0620b6b8f36034bd33bb"
        })
        .expect(201);

      let res2 = await request(server)
        .post('/videos')
        .send({
          name:"Cowboy Bebop Episode 6",
          description:"カウボーイビバップ - 全般にわたって漂うクールなカッコよさ、ジャズのリズムで贈るスタイリッシュなハードボイルドSFアクション。ワープゲートで各惑星が結ばれた2071年の太陽系を舞台に、元マフィアと元警官という経歴の賞金稼ぎスパイクとジェット、記憶喪失の上に莫大な借金を背負っている謎の女フェイ、見た目は無垢な少年、実は少女の天才ハッカーエド、人間並みの知能を持つデータ犬アインという4人と1匹が、運命のいたずらにより奇妙な共同生活を送ることになる。共に暮らしながらも微妙な距離感を保つ4人のセッションは、ときには激しく、ときには滑稽で、ときには切ないエピソードを奏でる。 また、遊び心とスパイスの効いた楽曲の数々は、カウボーイビバップならではのスタイリッシュな雰囲気作りに一役も二役も買っている。先の見えない賞金稼ぎを続けながら、彼らはなにを追い求めるのか?広大な宇宙を舞台に、賞金稼ぎが繰り広げるスペースジャズドラマ!",
          duration: 1481000,
          url: "https://animelon.com/video/5ac58b78f1fe4e742d177fc7"
        })
        .expect(201);

      testData.videos.video1 = res1.body;
      testData.videos.video2 = res2.body;
    });


    it(`should /POST a simple sub`, async () => {

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

    });


    it(`should /POST a sub from an ass string`, async () => {

        let res = await request(server)
          .post('/subtitles/fromAss')
          .send({
              assstring: fs.readFileSync('./tests/sampleSubs/kaiji12.ass', "utf8")
          })
          .expect(201);

        expect(res.body.lastId).toBe(472);

        testData.subtitles.subtitle1 = res.body;
    });
  });

  describe('Simulate the API flow', () => {

    let workingData = {
      tree1: null,

      branch1t1: null,
      commit1b1t1: null,
      change1c1b1t1: null,

      branch2t1: null,
      commit1b2t1: null,
      change1c1b2t1: null,

      branch3t1: null,

      branch4t1: null
    }

    describe("tree creation and first branch with a commit and a change", ()=>{

      it(`should /POST a tree`, async () => {

        let res = await request(server)
          .post("/trees")
          .send({
            language: "jp",
            description: "a test tree",
            video_id: testData.videos.video2._id,
            subtitle_id: testData.subtitles.subtitle1._id
          })
          .expect(201);

        workingData.tree1 = res.body;

      });

      it("should /POST a branch", async () => {


        let res = await request(server)
          .post("/branches")
          .send({
            creator_id: testData.users.user1._id,
            tree_id: workingData.tree1._id
          })
          .expect(201);

        workingData.branch1t1 = res.body;

      });

      it("should /POST a commit", async () => {

        let res = await request(server)
          .post("/commits")
          .send({
            description: "",
            branch_id: workingData.branch1t1._id
          })
          .expect(201);

        workingData.commit1b1t1 = res.body;

      });

      it("should /POST a change", async () => {

        let res = await request(server)
          .post("/changes")
          .send({
            line_ids: [5],
            user_id: testData.users.user1._id,
            commit_id: workingData.commit1b1t1._id,
            branch_id: workingData.branch1t1._id,
            type: "EDIT",
            data: {
              text: "普通な漢字"
            }
          })
          .expect(201);

        workingData.change1c1b1t1 = res.body;

      });

      it("should /POST some more different types of change to be tested on conflicts later", async () => {

        const templateChange:any = {
          user_id: testData.users.user1._id,
          commit_id: workingData.commit1b1t1._id,
          branch_id: workingData.branch1t1._id
        };

        await postChangeWithTemplate(templateChange, {
          line_ids: [97],
          type: "EDIT",
          data: {
            text: "random stuff"
          }
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [98],
          type: "EDIT",
          data: {
            startTime: 400100,
            endTime: 400200
          }
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [99],
          type: "EDIT",
          data: {
            endTime: 500100
          }
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [100],
          type: "EDIT",
          data: {
            startTime: 500200
          }
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [101],
          type: "DELETE"
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [102, 103, 104],
          type: "DELETE"
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [106],
          type: "DELETE"
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [150, 151, 152],
          type: "TIME_SHIFT",
          data: {
            timeShift: -80
          }
        }).expect(201);

        await postChangeWithTemplate(templateChange, {
          line_ids: [153],
          type: "TIME_SHIFT",
          data: {
            timeShift: 105
          }
        }).expect(201);


      });

    });
    describe("Another branch that will be used in a later test",()=>{

      it("should /POST a branch", async () => {

        let branch = await request(server)
          .post("/branches")
          .send({
            creator_id: testData.users.user1._id,
            tree_id: workingData.tree1._id
          })
        .expect(201);

        workingData.branch3t1 = branch.body;

      });

    });

    describe("Finishing and approving another branch",()=>{

      it("should /POST a branch", async () => {


        let res = await request(server)
          .post("/branches")
          .send({
            creator_id: testData.users.user1._id,
            tree_id: workingData.tree1._id
          })
          .expect(201);

        workingData.branch2t1 = res.body;

      });

      it("should /POST a commit", async () => {


        let res = await request(server)
          .post("/commits")
          .send({
            description: "",
            branch_id: workingData.branch2t1._id
          })
          .expect(201);

        workingData.commit1b2t1 = res.body;

      });

      it("should /POST a change", async () => {

        let res = await request(server)
          .post("/changes")
          .send({
            line_ids: [
              1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
              20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,
              36,37,38,39,40
            ],
            user_id: testData.users.user1._id,
            commit_id: workingData.commit1b2t1._id,
            branch_id: workingData.branch2t1._id,
            type: "TIME_SHIFT",
            data: {
              timeShift: -22
            }
          })
          .expect(201);

        workingData.change1c1b2t1 = res.body;

      });

      it("should /PATCH the commit with a description and telling it's done", async () => {


        let res = await request(server)
          .patch("/commit/" + workingData.commit1b2t1._id)
          .send({
            description: "ajusted the timing",
            done: true
          })
          .expect(200);

      });

      it("should /PATCH the branch telling it's done", async () => {

        let res = await request(server)
          .patch("/branch/" + workingData.branch2t1._id)
          .send({
            status: "FINISHED"
          })
          .expect(200);

      });

      it("should /PATCH the branch with the adm approval", async () => {

        let res = await request(server)
          .patch("/branch/" + workingData.branch2t1._id)
          .send({
            status: "APPROVED"
          })
          .expect(200);

        expect(res.body.responseCode).toBe(1);
        expect(res.body.approvedBranch.status).toBe("APPROVED");

      });
    });

    describe("verify the state of the data after approval",()=>{


      test("tree should have 2 branches in mainline", async () => {

        let res = await request(server)
          .get("/tree/" + workingData.tree1._id)
          .expect(200);

        const tree = res.body;
        expect(tree.mainlineLength).toBe(2);


      });

      test("branches data should have been updated accordingly", async () => {

        let res1 = await request(server)
          .get("/branch/" + workingData.branch2t1._id)
          .expect(200);


        let res2 = await request(server)
          .get("/branch/" + workingData.branch1t1._id)
          .expect(200);

        const branch2 = res2.body;
        const branch1 = res1.body;

        expect(branch1.isInMainline).toBeTruthy();
        expect(branch1.mlBaseIndex).toBe(0);
        expect(branch1.collaborators.length).toBe(1);
        expect(branch1.collaborators[0].user_id).toBe(testData.users.user1._id);
        expect(branch1.source_id).toBeUndefined();

        expect(branch2.isInMainline).toBeFalsy();
        expect(branch2.mlBaseIndex).toBe(0);
        expect(branch2.collaborators.length).toBe(1);
        expect(branch2.collaborators[0].user_id).toBe(testData.users.user1._id);
        expect(branch2.source_id).toBeUndefined();

      });


    });

    describe("Rebase without conflicts", ()=>{

      it("should /PATCH the branch1t1 with the adm approval", async () => {

        let res = await request(server)
          .patch("/branch/" + workingData.branch1t1._id)
          .send({
            status: "APPROVED"
          })
          .expect(200);


        expect(res.body.responseCode).toBe(2);

        expect(res.body.approvedBranch.status).toBe("APPROVED");
        expect(res.body.approvedBranch.isInMainline).toBeFalsy();
        expect(res.body.approvedBranch.mlBaseIndex).toBe(0);
        expect(res.body.approvedBranch.source_id).toBeUndefined();

        expect(res.body.rebasedBranch.status).toBe("REBASED");
        expect(res.body.rebasedBranch.isInMainline).toBeTruthy();
        expect(res.body.rebasedBranch.mlBaseIndex).toBe(1);
        expect(res.body.rebasedBranch.source_id).toBe(res.body.approvedBranch._id);

        workingData.branch4t1 = res.body.rebasedBranch;

      });

      test("tree should have 3 branches in mainline", async () => {

        let res = await request(server)
          .get("/tree/" + workingData.tree1._id)
          .expect(200);

        const tree = res.body;
        expect(tree.mainlineLength).toBe(3);


      });


    });

    describe("Rebase with conflicts", ()=>{

      test("make conflicting changes in branch branch3t1", async ()=>{


        let commitRes = await request(server)
          .post("/commits")
          .send({
            description: "",
            branch_id: workingData.branch3t1._id
          })
          .expect(201);


        const templateChange:any = {
          user_id: testData.users.user1._id,
          commit_id: commitRes.body._id,
          branch_id: workingData.branch3t1._id
        };

        //conflict: different text
        await postChangeWithTemplate(templateChange, {
          line_ids: [5],
          type: "EDIT",
          data: {
            text: "conflicting text change"
          }
        }).expect(201);

        //no conflict: target changes don't touch line 15
        await postChangeWithTemplate(templateChange, {
          line_ids: [15],
          type: "EDIT",
          data: {
            startTime: 50220
          }
        }).expect(201);

        //no conflict: target changes don't touch line 16
        await postChangeWithTemplate(templateChange, {
          line_ids: [16],
          type: "DELETE"
        }).expect(201);

        //no conflict: exact same text edit
        await postChangeWithTemplate(templateChange, {
          line_ids: [97],
          type: "EDIT",
          data: {
            text: "random stuff"
          }
        }).expect(201);

        //conflict: the target change changes start and end time
        //and this one changes only start time
        await postChangeWithTemplate(templateChange, {
          line_ids: [98],
          type: "EDIT",
          data: {
            startTime: 400150,
          }
        }).expect(201);

        //conflict: target change edits end time on line 99
        await postChangeWithTemplate(templateChange, {
          line_ids: [98, 99],
          type: "TIME_SHIFT",
          data: {
            endTime: 500100
          }
        }).expect(201);

        //conflict: target change deletes this line
        await postChangeWithTemplate(templateChange, {
          line_ids: [101],
          type: "EDIT",
          data: {
            startTime: 600100
          }
        }).expect(201);

        //conflict: target change deletes lines 102, 103, and 104 in one change,
        //and 106 in another change
        await postChangeWithTemplate(templateChange, {
          line_ids: [104, 105, 106],
          type: "TIME_SHIFT",
          data: {
            timeShift: 250
          }
        }).expect(201);

        //conflict: target change timeshifts 150, 151 and 152 by -80
        await postChangeWithTemplate(templateChange, {
          line_ids: [151, 152],
          type: "TIME_SHIFT",
          data: {
            timeShift: -85
          }
        }).expect(201);

        //no conflict: target change time shifts line 153, but this change only
        //touches the text
        await postChangeWithTemplate(templateChange, {
          line_ids: [153],
          type: "EDIT",
          data: {
            text: "timeshift / text"
          }
        }).expect(201);

        await request(server)
          .patch("/commit/" + commitRes.body._id)
          .send({
            description: "conflicting commit",
            done: true
          })
          .expect(200);

      });

      test("approving the branch", async ()=>{

        await request(server)
          .patch("/branch/" + workingData.branch3t1._id)
          .send({
            status: "FINISHED"
          })
          .expect(200);


        let res = await request(server)
          .patch("/branch/" + workingData.branch3t1._id)
          .send({
            status: "APPROVED"
          })
          .expect(200);

          console.log(JSON.stringify(res.body, null, 4))


          expect(res.body.responseCode).toBe(3);

          expect(res.body.rebase).toBeDefined();
          expect(res.body.rebase.targetLineBranch_ids).toBe([workingData.branch4t1._id]);

          // expect(res.body.approvedBranch.status).toBe("APPROVED");
          // expect(res.body.approvedBranch.isInMainline).toBeFalsy();
          // expect(res.body.approvedBranch.mlBaseIndex).toBe(0);
          // expect(res.body.approvedBranch.source_id).toBeUndefined();
          //
          // expect(res.body.rebasedBranch.status).toBe("REBASED");
          // expect(res.body.rebasedBranch.isInMainline).toBeTruthy();
          // expect(res.body.rebasedBranch.mlBaseIndex).toBe(1);
          // expect(res.body.rebasedBranch.source_id).toBe(res.body.approvedBranch._id);

      });


    });

  });


});
