let server;
const request = require("supertest");
const { event } = require("../../models/event");
const { User } = require("../../models/user");

describe("/api/events", () => {
  beforeEach(async() => {

    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await event.remove({});
    await User.remove({});
  });

  describe("GET  /", () => {
    it("should return all events", async () => {
      await event.collection.insertMany([
        {
          name: "devent 1",
          date: Date.now().toString(),
          description: "description",
          cover_photo: "cover_photo",
          feedback: ["feedback"],
          sessions: [
            {
              session_name: "Intro to Devmix",
              session_number: 1,
              content_desc: "content_desc  content_desc",
              content_link: "content_link content_link",
              instructor_id: 1
            }
          ]
        },
        {
          name: "devent 2",
          date: Date.now().toString(),
          description: "description",
          cover_photo: "cover_photo",
          feedback: ["feedback"],
          sessions: [
            {
              session_name: "Intro to Devmix",
              session_number: 1,
              content_desc: "content_desc  content_desc",
              content_link: "content_link content_link",
              instructor_id: 1
            }
          ]
        },
        {
          name: "devent 3",
          date: Date.now().toString(),
          description: "description",
          cover_photo: "cover_photo",
          feedback: ["feedback"],
          sessions: [
            {
              session_name: "Intro to Devmix",
              session_number: 1,
              content_desc: "content_desc  content_desc",
              content_link: "content_link content_link",
              instructor_id: 1
            }
          ]
        }
      ]);

      const res = await request(server).get("/api/events");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    },3000);
    it("should return a specific event", async () => {
      let Event = new event({
        name: "devent 4",
        date: Date.now(),
        description: "description",
        cover_photo: "cover_photo",
        feedback: ["feedback"],
        sessions: [
          {
            session_name: "Intro to Devmix",
            session_number: 1,
            content_desc: "content_desc  content_desc",
            content_link: "content_link content_link",
            instructor_id: 1
          }
        ]
      });
      await Event.save();
      const res = await request(server).get("/api/events/" + Event._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", Event.name);
    });
    it("should return 400 for the invalid id", async () => {
      let Event = new event({
        name: "devent 5",
        date: Date.now(),
        description: "description",
        cover_photo: "cover_photo",
        feedback: ["feedback"],
        sessions: [
          {
            session_name: "Intro to Devmix",
            session_number: 1,
            content_desc: "content_desc  content_desc",
            content_link: "content_link content_link",
            instructor_id: 1
          }
        ]
      });
      Event.save();
      const res = await request(server).get("/api/events/1");
      expect(res.status).toBe(400);
    });
  });
  describe("post /", () => {
    it("should return 401 if client is not logged in", async () => {
      let Event = {
        name: "devent 6",
        date: Date.now(),
        description: "description",
        cover_photo: "cover_photo",
        feedback: ["feedback"],
        sessions: [
          {
            session_name: "Intro to Devmix",
            session_number: 1,
            content_desc: "content_desc  content_desc",
            content_link: "content_link content_link",
            instructor_id: 1
          }
        ]
      };
      const res = await request(server)
        .post("/api/events")
        .send(Event);
      expect(res.status).toBe(401);
    });
    it("should return 400 if event name less than 3 chars", async () => {
      let Event = {
        name: "devent 7",
        date: Date.now(),
        description: "description",
        cover_photo: "cover_photo",
        feedback: ["feedback"],
        sessions: [
          {
            session_name: "Intro to Devmix",
            session_number: 1,
            content_desc: "content_desc  content_desc",
            content_link: "content_link content_link",
            instructor_id: 1
          }
        ]
      };
      const token = new User({
        name: "ezat",
        email: "ezatelzalouy711@gmail.com",
        password: "123456",
        isAdmin: true
      }).generateAuthToken();
      const res = await request(server)
        .post("/api/events")
        .send(Event)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
});