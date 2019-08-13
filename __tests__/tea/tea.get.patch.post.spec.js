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
        await db.collection('user').insertOne({
            _id: tea_id,
            password: 'secret',
            name: 'miguel',
            sede: 'A',
            center: 'CC',
            therapists: ['th1', 'th2'],
            father: 'f',
            mother: 'm'
        })
    })

    afterAll(async () => {
        await db.collection('user').deleteOne({ _id: tea_id })      
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

    test('tea allow find one empty fields, not return password', async () => {
        expect.assertions(2)

        let token = {
            userId: 'userxxx',
            role: 'test.1'
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/' + tea_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
        expect(response.data).toEqual({_id: ''+tea_id});
        expect(response.data.password).toBeUndefined();  
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
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/?center=CC&fields=sede,center,password',
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

    test('allow find tea [] not center', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1',
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/?center=AA,BB&fields=sede,center',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([]);  
    });

    test('allow find tea name regex', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1',
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/?name=igue&fields=name',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([{
            _id: tea_id + '',
            name: 'miguel'
        }]);  
    });

    test('allow find tea [] name regex', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1',
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/tea/?name=xxx&fields=name',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([]);  
    });

})