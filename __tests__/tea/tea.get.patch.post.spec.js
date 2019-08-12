const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://db:27017/test';
const dbName = 'test';

let db = null;
const client = new MongoClient(url);

describe('test tea', () => {
    let tea_id = new ObjectID()

    beforeAll(async () => {
        await client.connect()
        db = client.db(dbName)
        await db.collection('tea').insertOne({
            _id: tea_id,
            password: 'secret',
            sede: 'A',
            center: 'CC',
            therapists: ['th1', 'th2'],
            father: 'f',
            mother: 'm'
        })
    })

    afterAll(async () => {
        await db.collection('tea').deleteOne({ _id: tea_id })      
        await client.close()
    })

    test('tea allow find one', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1'
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/' + tea_id + '/?fields=sede,center',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual({
            _id: ''+tea_id,
            sede: 'A',
            center: 'CC'
        });  
    });

    test('tea find one null', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1'
        }

        token = jwt.sign(token, 'secret')
        try{
            const response = await axios.get(
            'http://localhost:3000/api/private/tea/' + new ObjectID(),
            {
                headers: {
                Authorization: "Bearer " + token
                }
            }
            )
        }catch(err){
            expect(err.response.status).toEqual(401)
        }
    });

    test('allow find tea', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1',
            /*permissions: {
                'tea:memorandum:find': {
                    tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
                    memorandum: {author: 'userxxx' }
                }
            }*/
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/?center=CC&fields=sede,center',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([{
            _id: tea_id + '',
            sede: 'A',
            center: 'CC'
        }]);  
    });

})