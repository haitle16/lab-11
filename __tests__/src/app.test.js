'use strict';

// Unit -- my module in isolation () | 1000 test
// Integration Testing -- my module in the ecosystem | 100 test
// Acceptance Test -- End to end | 10 test


// Mock the MDB Server
import mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server';
let mongoServer;

// Mock the API Server
const {server} = require('../../src/app.js');
const supertest = require('supertest');
const mockRequest = supertest(server);

beforeAll(async () => {//before all the test run, this codeblock run
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, (err) =>{
    if (err) {console.log(err);}
  });
}) ;

afterAll( ()=>{
  mongoose.disconnect();
  mongoServer.stop();
});


describe ('API SERVER', ()=>{
  it('should respond with a 500 on an invalid model', () =>{
    return mockRequest
      .get('/booboo')
      .then(result=>{
        expect(result.status).toBe(404);
      })
      .catch(err =>{
        expect(err).not.toBeDefined();
      });
  });

  it('.post(/api/v1/notes should take an object and save it', ()=>{
    let obj= {title:'foobar', text:'bazbaz'};

    return mockRequest
      .post('/api/v1/notes')
      .send(obj)
      .then(results =>{
        expect(results.status).toBe(200);
        expect(results.body.title).toEqual(obj.title);
        expect(results.body._id).toBeDefined();
      })
      .catch(err =>{
        expect(err).not.toBeDefined();
      });
  });


});

