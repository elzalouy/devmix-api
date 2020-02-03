let server;
const request = require("supertest");
const { event } = require("../../models/event");
const { User } = require("../../models/user");

describe("/api/event (GET ALL , POST , GET BY ID)", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await event.remove({});
    await User.remove({});
  });

  it("should be 200", async () => {
    await event.collection.insertMany([
      {
        name: "devent 5",
        date: Date.now().toString(),

        cover_photo: null,
        location: "",
        feedbacks: [{}],
        sessions: [
          {
            session_name: "Intro to Devmix",
            session_number: 1,
            date: "",
            time: "",
            content_desc: "content_desc  content_desc",
            content_link: "content_link content_link",
            instructor_id: ""
          }
        ],
        facebook_link: "",
        twitter_link: "",
        users: 1
      }
    ]);
    const res = await request(server).get("/api/event");
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(1);
  }, 3000);

  it("should return a specific event", async () => {
    let Event = new event({
      name: "devent 7",
      date: Date.now().toString(),

      cover_photo: null,
      location: "mansoura",
      feedbacks: [],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "12:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: "frgthyhg1frthj45"
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    });
    await Event.save();
    const res = await request(server).get("/api/event/get/" + Event._id);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", Event.name);
    expect(res.body).toHaveProperty("location", Event.location);
  });

  it("should return 400 -> Invalid Id", async () => {
    let Event = new event({
      name: "devent 7",
      date: Date.now().toString(),

      cover_photo: null,
      location: "mansoura",
      feedbacks: [],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "12:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: "frgthyhg1frthj45"
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    });
    await Event.save();
    const res = await request(server).get(
      "/api/event/get/" + "012aa572340e5923f5"
    );
    expect(res.status).toBe(400);
    expect(res.text).toEqual("Invalid ID.");
  });

  it("should return 400 -> event was not found", async () => {
    let Event = new event({
      name: "devent 7",
      date: Date.now().toString(),

      cover_photo: null,
      location: "mansoura",
      feedbacks: [],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "12:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: "frgthyhg1frthj45"
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    });
    await Event.save();
    const res = await request(server).get(
      "/api/event/get/" + "5dfe1bc2c446f40aec0fd641"
    );
    expect(res.status).toBe(400);
    expect(res.text).toEqual("the event with the given id was not found");
  });

  it("should return 401 if client is not logged in", async () => {
    let Event = {
      name: "devent 7",
      date: Date.now().toString(),

      cover_photo: null,
      locationL: "",
      feedbacks: [{}],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: "",
          time: "",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: ""
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    };
    const res = await request(server)
      .post("/api/event/")
      .send(Event);
    expect(res.status).toBe(401);
    expect(res.text).toEqual("Access denied, No token provided");
  });

  it("invalid access token", async () => {
    let Event = {
      name: "devent 7",
      date: Date.now().toString(),

      cover_photo: null,
      locationL: "",
      feedbacks: [{}],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: "",
          time: "",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: ""
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    };
    const res = await request(server)
      .post("/api/event/")
      .set(
        "x-auth-token",
        "odkoervrmeokjwiuveruveb-trbrgvfedncjvneefvdw2b5tr4b1fg"
      )
      .send(Event);
    expect(res.status).toBe(400);
    expect(res.text).toEqual("Invalid token");
  });

  it("Valid token but not user (Unauthorized request)", async () => {
    let Event = {
      name: "devent 7",
      date: Date.now().toString(),

      cover_photo: null,
      locationL: "",
      feedbacks: [{}],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: "",
          time: "",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: ""
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    };

    const res = await request(server)
      .post("/api/event/")
      .set(
        "x-auth-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZlMWJjMmM0NDZmNDBhZWMwZmQ2NDEiLCJuYW1lIjoiZXphdCBlbHphbG91eSIsImVtYWlsIjoiZXphdGVsemFsb3V5NzExQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3ODk5MTA2MiwiZXhwIjoxNTc5MTYzODYyfQ.d86XQaQlIXVRVbaRr1m4xwekWO8-zBdxkxDyoh19TYU"
      )
      .send(Event);
    expect(res.status).toBe(400);
    expect(res.text).toEqual("Invalid token");
  });

  it("User but not admin", async () => {
    let Event = {
      name: "devent 6",
      date: Date.now().toString(),

      cover_photo: null,
      location: "mansoura",
      feedbacks: [{}],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "11:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: "2tghgf19j5t2yfgc5"
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    };
    const user = new User({
      name: "ezat",
      email: "ezatelzalouy711@gmail.com",
      password: "123456",
      isAdmin: false,
      confirmed: true,
      gender: "male"
    });
    await user.save();
    let token = user.generateAuthToken();
    const res = await request(server)
      .post("/api/event/")
      .set("x-auth-token", token)
      .send(Event);
    expect(res.status).toBe(401);
    expect(res.text).toEqual("access denied");
  });

  it("User and admin => 400 but not unique name", async () => {
    let Event1 = new event({
      name: "devent 6",
      date: Date.now().toString(),

      cover_photo: null,
      location: "mansoura",
      feedbacks: [],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "11:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: "wwf5dv15e2sd1c5"
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    });
    await Event1.save();
    let Event2 = {
      name: "devent 6",
      date: Date.now().toString(),
      cover_photo: null,
      location: "mansoura",
      feedbacks: [{}],
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "11:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: "2tghgf19j5t2yfgc5"
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    };

    const user = new User({
      name: "ezat",
      email: "ezatelzalouy711@gmail.com",
      password: "123456",
      isAdmin: true,
      confirmed: true,
      gender: "male"
    });

    await user.save();
    let token = user.generateAuthToken();
    const res = await request(server)
      .post("/api/event/")
      .set("x-auth-token", token)
      .send(Event2);
    expect(res.status).toBe(400);
    expect(res.text).toEqual(
      "There are an event with the same name. Please choose another name..."
    );
  });

  it("User and admin => 400 but not unique name", async () => {
    const user = new User({
      name: "ezat",
      email: "ezatelzalouy711@gmail.com",
      password: "123456",
      isAdmin: true,
      confirmed: true,
      gender: "male"
    });
    await user.save();
    let token = user.generateAuthToken();
    let Event = {
      name: "devent 6",
      date: Date.now().toString(),
      cover_photo: null,
      location: "mansoura",
      feedbacks: [{}],
      cover_photo: {},
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "11:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: user._id
        }
      ],
      facebook_link: "",
      twitter_link: "",
      users: 1
    };
    const res = await request(server)
      .post("/api/event/")
      .set("x-auth-token", token)
      .send(Event);
    expect(res.status).toBe(400);
    expect(res.text).toEqual('"facebook_link" is not allowed to be empty');
  });

  it("Valid Data and Admin", async () => {
    const user = new User({
      name: "ezat",
      email: "ezatelzalouy711@gmail.com",
      password: "123456",
      isAdmin: true,
      confirmed: true,
      gender: "male"
    });
    await user.save();
    let token = user.generateAuthToken();
    let Event = {
      name: "devent 6",
      date: Date.now().toString(),
      cover_photo: null,
      location: "mansoura",
      feedbacks: [],
      cover_photo: {},
      sessions: [
        {
          session_name: "Intro to Devmix",
          session_number: 1,
          date: Date.now().toString(),
          time: "11:00:00 PM",
          content_desc: "content_desc  content_desc",
          content_link: "content_link content_link",
          instructor_id: user._id
        }
      ],
      facebook_link: "bla bla bla",
      twitter_link: "bla bla bla"
    };
    const res = await request(server)
      .post("/api/event/")
      .set("x-auth-token", token)
      .send(Event);
    expect(res.status).toBe(200);
  });
});
