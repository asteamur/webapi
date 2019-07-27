const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const jwt = require('jsonwebtoken')

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
                        id: 'userxxx'
                        //parent: 'userxxx'
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

  test('allow', async () => {
    expect.assertions(1)
    const response = await axios.get(
      'http://localhost:3000/private/2/userxxx',
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
      )      
    expect(response.status).toEqual(200);  
  });
});
