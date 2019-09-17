let server;
const request=require('supertest');
const {User}=require('../../models/user');

beforeEach(()=>{
    server=require("../../index");
});

afterEach(async()=>{
    await User.remove({});
    server.close();
});

describe('api/auth POST route handler',()=>{
    it('should return a token if the email and password are correct',async()=>{
        const user=new User({
            name:'ezat elzalouy',
            email:'ezatelzalouy711@gmail.com',
            password:'ezatelzalouy711'
        });
        await user.save();
        const res=await request(server)
        .post('/api/auth')
            .send({
                    email:'ezatelzalouy711@gmail.com',
                    password:'ezatelzalouy711'
                });
            expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
        });
    });
});
