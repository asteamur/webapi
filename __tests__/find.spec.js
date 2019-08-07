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
        'tea:memorandum:patch': {
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
          'http://localhost:3000/api/private/testing/4/?namespace=xxx&tea_id=' + tea_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
          )      
        expect(response.data[0].text).toEqual(";)");  
        //expect(response.status).toEqual(200)
      });

    /*
    test('allow', async () => {
        const req = {}
        req.filters = token.permissions['tea:memorandum:patch']
        req.body = {}
        req.params = {}
        req.query = { tea_id }
        req.querymen = {select: {a: 1}, query: {name: 'miguel'}, cursor: {}}
        const objs = await fetchMany({   // parallel
            memorandum: {'*': '$query'},
            tea: {'_id': '$query.tea_id'}
        }, req)
        expect(objs).toEqual({})
    })
    */
})