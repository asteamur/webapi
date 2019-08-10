const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://db:27017/test';
const dbName = 'test';

let db = null;
const client = new MongoClient(url);

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
        center: 'C',
        therapists: ['th1', 'th2']
        })

        await db.collection('memorandum').insertOne({
            _id: memorandum_id,
            tea_id,
            namespace: 'xxx',
            author: 'userxxx',
            text: ';)'
        })  
        
        await db.collection('memorandum').insertOne({
            tea_id,
            namespace: 'xxx',
            author: 'useryyy',
            text: ';) !!!'
        })
    })

    afterAll(async () => {
        await db.collection('tea').deleteOne({ _id: tea_id })    
        await db.collection('memorandum').deleteMany({}) //.deleteOne({ _id: memorandum_id })    
        await client.close()
    })

    test('allow find one', async () => {
        expect.assertions(1)

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

        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/' + memorandum_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual({
            _id: memorandum_id + '',
            tea_id: tea_id + '',
            namespace: 'xxx',
            author: 'userxxx',
            text: ';)'
        });  
        //expect(response.status).toEqual(200)
      });

      test('find one fail because no tea', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            rol: 'coordinador:cartagena',
            permissions: {
                'tea:memorandum:find': {
                    tea: {$or: [{sede: {$in: ['B', 'C']}}, {center: 'CEIP 1'}]},
                    memorandum: {author: 'userxxx' }
                }
            }
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/' + memorandum_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )

        expect(response.data).toEqual({
            error: 'no tea'
        });  

      });

    test('find one fail because bad _id', async () => {
        expect.assertions(1)

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

        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/000',
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual({
            error: 'bad _id'
        });  
      });
    
      test('find one fail because bad _id', async () => {
        expect.assertions(1)

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

        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/' + tea_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual({
            error: 'no memorandum'
        });  
      });
  


    test('allow find', async () => {
        expect.assertions(1)

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

      test('fail tea sede', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            rol: 'coordinador:cartagena',
            permissions: {
                'tea:memorandum:find': {
                    tea: {$or: [{sede: {$in: ['B', 'C']}}, {center: 'CEIP 1'}]},
                    memorandum: {author: 'userxxx' }
                }
            }
        }
        
        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/?namespace=xxx&tea_id=' + tea_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual({
            error: 'no tea'
        });  
        //expect(response.status).toEqual(200)
      });

      test('return []', async () => {
        expect.assertions(1)

        let token = {
            userId: 'userxxx',
            rol: 'coordinador:cartagena',
            permissions: {
                'tea:memorandum:find': {
                    tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
                    memorandum: {author: 'userzzz' }
                }
            }
        }
        
        token = jwt.sign(token, 'secret')

        const response = await axios.get(
          'http://localhost:3000/api/private/memorandum/?namespace=xxx&tea_id=' + tea_id,
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        expect(response.data).toEqual([]);  
        //expect(response.status).toEqual(200)
      });

      test('allow patch one', async () => {
        expect.assertions(2)

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

        const response = await axios.patch(
          'http://localhost:3000/api/private/memorandum/' + memorandum_id,
          {text: 'hello world!'},
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
 
        const doc = await db.collection('memorandum').findOne({ _id: memorandum_id }, {projection: {_id: 0, text: 1}})  

        expect(response.status).toEqual(200);
        expect(doc).toEqual({text: 'hello world!'})  
      });

      test('allow post', async () => {
        expect.assertions(2)

        let token = {
            userId: 'userxxx',
            rol: 'coordinador:cartagena',
            permissions: {
                'tea:memorandum:post': {
                    tea: {therapists: 'th1'}
                }
            }
        }

        token = jwt.sign(token, 'secret')

        const response = await axios.post(
          'http://localhost:3000/api/private/memorandum',
          {
            tea_id: tea_id + '',
            author: 'userxxx',
            text: 'game over!'},
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        )
        expect(response.data._id).not.toBeUndefined();
        const doc = await db.collection('memorandum').findOne({ _id: new ObjectID(response.data._id) }, {projection: {_id: 0, author:1, text: 1}})  
        expect(doc).toEqual({author: 'userxxx', text: 'game over!'})  
      });  
})