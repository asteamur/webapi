const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const jwt = require('jsonwebtoken')

let token = {
    userId: 'useryyy',
    rol: 'coordinador:cartagena',
    allow: [
        {
            resource: 'user',
            permissions: [
                {
                    permission: 'user:memorandum:read',
                    filter: {
                        therapists: 'useryyy'
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

describe('test resource therapist not found', () => {

  test('allow', async () => {
    expect.assertions(1)
    try{
        const response = await axios.get(
        'http://localhost:3000/api/private/testing/2/userxxx',
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
