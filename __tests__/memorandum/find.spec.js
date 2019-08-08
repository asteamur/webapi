const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://db:27017/test';
const dbName = 'test';

let db = null;
const client = new MongoClient(url);

//const { fetchMany } = require('./can2')

let token = {
    userId: 'userxxx',
    rol: 'coordinador:cartagena',
    permissions: {
        'tea:memorandum:find': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {author: 'userxxx' }
        }
    }
}

token = jwt.sign(token, 'secret')

describe('test ', () => {
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
            namespace: 'xxx',
            author: 'userxxx',
            text: ';)'
        })  

    })

    afterAll(async () => {
        await db.collection('tea').deleteOne({ _id: tea_id })    
        await db.collection('memorandum').deleteOne({ _id: memorandum_id })    
        await client.close()
    })

    test('allow', async () => {
        expect.assertions(1)
        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/?namespace=xxx&tea_id=' + tea_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([{
            _id: memorandum_id + '',
            tea_id: tea_id + '',
            namespace: 'xxx',
            author: 'userxxx',
            text: ';)'
        }]);  
        //expect(response.status).toEqual(200)
      });
})