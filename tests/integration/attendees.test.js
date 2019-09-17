let server;
const request = require("supertest");
const { Attendees } = require("../../models/attendees");
const { event } = require("../../models/event");


beforeEach(() => {
  server = require("../../index");
});
afterEach(async () => {
  server.close();
  await Attendees.remove({});
  await event.remove({});
});
describe("/api/attend requests", () => {
  it("should return 200 if valid id and token", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDI5ZDIwODE4ZTM4MDNkYzVmYmFmY2UiLCJuYW1lIjoiRXphdCBFTHphbG91eSIsImVtYWlsIjoiZWx6YWxvdXk1MjhAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTYzMTU4MTc1fQ.Ww0rfIQdHUlfH6uI0RUh8uvn1bZ66WtW2nO2p3koF6g";
    let Event = new event({
      name: "devent 1",
      date: Date.now().toString(),
      description: "Description",
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
    Event = await Event.save();
    const res = await request(server)
      .get(`/api/attend/${Event._id}`)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", Event.name);
  });

  it("should return 400 if the event was not found", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDI5ZDIwODE4ZTM4MDNkYzVmYmFmY2UiLCJuYW1lIjoiRXphdCBFTHphbG91eSIsImVtYWlsIjoiZWx6YWxvdXk1MjhAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTYzMTU4MTc1fQ.Ww0rfIQdHUlfH6uI0RUh8uvn1bZ66WtW2nO2p3koF6g";
    const id = "5d07a43cab84fb8143390d43";
    const res = await request(server)
      .get("/api/attend/" + id)
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.text).toEqual("the event with the given id was not found");
  });

  it("should return 400 if invalid id", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDI5ZDIwODE4ZTM4MDNkYzVmYmFmY2UiLCJuYW1lIjoiRXphdCBFTHphbG91eSIsImVtYWlsIjoiZWx6YWxvdXk1MjhAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTYzMTU4MTc1fQ.Ww0rfIQdHUlfH6uI0RUh8uvn1bZ66WtW2nO2p3koF6g";
    const id = "5d07a43cab84fb8143390d4";
    const res = await request(server)
      .get("/api/attend/" + id)
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.text).toEqual("Invalid ID.");
  });

  it("should return 404 if the id was empty", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDI5ZDIwODE4ZTM4MDNkYzVmYmFmY2UiLCJuYW1lIjoiRXphdCBFTHphbG91eSIsImVtYWlsIjoiZWx6YWxvdXk1MjhAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTYzMTU4MTc1fQ.Ww0rfIQdHUlfH6uI0RUh8uvn1bZ66WtW2nO2p3koF6g";
    const id = "";
    const res = await request(server)
      .get("/api/attend/" + id)
      .set("x-auth-token", token);
    expect(res.status).toBe(404);
    // expect(res.text).toEqual('Invalid ID.');
  });

  it("should return 400 if the token was invalid", async () => {
    const token =
      "eyJhbGciOiJIUzcCI6pXVCJ9.eyJfaWQiOiI1ZDI5ZDIwODE4ZTM4MDNkYzVmYmFmY2UiLCJuYW1lIjoiRXphdCBFTHphbG91eSIsImVtYWlsIjoiZWx6YWxvdXk1MjhAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTYzMTU4MTc1fQ.Ww0rfIQdHUlfH6uI0RUh8uvn1bZ66WtW2nO2p3koF6g";
    let Event = new event({
      name: "devent 1",
      date: Date.now().toString(),
      description: "Description",
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
    Event = await Event.save();
    const res = await request(server)
      .get("/api/attend/" + Event._id)
      .set("x-auth-token", token);
    expect(res.status).toBe(400);
    expect(res.text).toEqual("Invalid Token");
  });
});

describe("/api/attend/not/   requests",()=>{
  it("should return 200 if valid id and token", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDI5ZDIwODE4ZTM4MDNkYzVmYmFmY2UiLCJuYW1lIjoiRXphdCBFTHphbG91eSIsImVtYWlsIjoiZWx6YWxvdXk1MjhAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTYzMTU4MTc1fQ.Ww0rfIQdHUlfH6uI0RUh8uvn1bZ66WtW2nO2p3koF6g";
    let Event = new event({
      name: "devent 1",
      date: Date.now().toString(),
      description: "Description",
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
    Event = await Event.save();
    await Attendees.findByIdAndRemove(Event._id);
    const res = await request(server)
      .get(`/api/attend/not/${Event._id}`)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Removed from your activities.');
  });
});
