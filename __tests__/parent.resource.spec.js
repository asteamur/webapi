const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const jwt = require('jsonwebtoken')

const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://db:27017/test';
const dbName = 'test';

let db = null;
const client = new MongoClient(url);

let token = {
    userId: 'userxxx',
    rol: 'coordinador:cartagena',
    allow: [
        {
            resource: 'user',
            permissions: [
                {
                    permission: 'user:memorandum:read',
                    filter: {
                        parent: 'parentxxx'
                    }
                },
                {
                    permission: 'user:memorandum:write',
                    filter: {
                        sede: 'A',
                        center: 'D'
                    }
                }      
            ]
        },
        {
            resource: '*',
            permissions: ['user:create', 'user:edit', 'user:searchByName']
        }
    ]
}

token = jwt.sign(token, 'secret')

describe('test resource 1', () => {

  let _id = new ObjectID()

  beforeAll(async () => {
    await client.connect()
    db = client.db(dbName)
    await db.collection('users').insertOne({
      _id,
      id: 'userxxx',
      parent: 'parentxxx',
      therapists: ['thaaa', 'thbbb', 'thzzz'],
      sede: 'A',
      center: 'C'
    })
  })

  afterAll(async () => {
    await db.collection('users').deleteOne({ _id })    
    await client.close()
  })

  test('allow', async () => {
    expect.assertions(1)
    const response = await axios.get(
      'http://localhost:3000/api/private/testing/2/' + _id,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
      )      
    expect(response.status).toEqual(200);  
  });
});
