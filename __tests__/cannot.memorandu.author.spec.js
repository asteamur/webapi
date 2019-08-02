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
    permissions: {
        'user:memorandum:update': {
            tea: { sede: 'A'},
            memorandum: {author: 'userxxx' }
        }
    }
}

token = jwt.sign(token, 'secret')

describe('test resource memorandum', () => {

  let tea_id = new ObjectID()
  let memorandum_id = new ObjectID()

  beforeAll(async () => {
    await client.connect()
    db = client.db(dbName)
    await db.collection('tea').insertOne({
      _id: tea_id,
      id: 'userxxx',
      sede: 'A',
      center: 'C'
    })

    await db.collection('memorandum').insertOne({
        _id: memorandum_id,
        tea_id,
        author: 'useryyy',
        text: ';)'
    })  

  })

  afterAll(async () => {
    await db.collection('user').deleteOne({ _id: tea_id })    
    await db.collection('memorandum').deleteOne({ _id: memorandum_id })    
    await client.close()
  })

  test('allow', async () => {
    expect.assertions(1)
    try{
        const response = await axios.get(
        'http://localhost:3000/api/private/testing/3/' + memorandum_id,
        {
            headers: {
            Authorization: "Bearer " + token
            }
        }
        )
    }catch(err){
        expect(err.response.status).toEqual(401);  
    }       
  });
});
