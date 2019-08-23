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
            type: 'tea',
            password: 'secret',
            name: 'Miguel',
            nameSearch: 'miguel',
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
          'http://localhost:3000/api/private/tea/?type=tea&center=CC&fields=sede,center,password',
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
          'http://localhost:3000/api/private/tea/?name=migue&fields=name',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([{
            _id: tea_id + '',
            name: 'Miguel'
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

    test('allow patch one tea', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.1',
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.patch(
          'http://localhost:3000/api/private/tea/' + tea_id,
          {name: 'Miguelito'},
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        const doc = await db.collection('user').findOne({ _id: tea_id }, 
            {projection: {_id: 0, name: 1, nameSearch: 1}})  

        //expect(response.status).toEqual(200);
        expect(doc).toEqual({name: 'Miguelito', nameSearch: 'miguelito'})  
      });

      test('not allow patch one tea', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.2',
        }

        token = jwt.sign(token, 'secret')

        try{
            const response = await axios.patch(
            'http://localhost:3000/api/private/tea/' + tea_id,
            {name: 'Miguelito'},
            {
                headers: {
                Authorization: "Bearer " + token
                }
            }
            )
            console.log('response:', response.data)
        }catch(err){
            expect(err.response.status).toEqual(401)
        }
      });

      test('allow post one tea', async () => {
        expect.assertions(2)

        let token = {
            userId: 'userxxx',
            role: 'test.1',
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.post(
          'http://localhost:3000/api/private/tea',
          {name: 'Bernardo', dateOfBirth: '2020-01-03T00:00:00.000Z'},
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )

        expect(response.data._id).not.toBeUndefined();
        const doc = await db.collection('user').findOne({ _id: new ObjectID(response.data._id) }, 
              {projection: {_id: 0, name:1, nameSearch: 1, dateOfBirth: 1}})  
        expect(doc).toEqual({name: 'Bernardo', 
                             nameSearch: 'bernardo', 
                             dateOfBirth: new Date(2020, 0, 3)})    
      });

      test('not allow post one tea', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            role: 'test.2',
        }

        token = jwt.sign(token, 'secret')

        try{
            const response = await axios.post(
            'http://localhost:3000/api/private/tea',
            {name: 'Bernardo'},
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


})