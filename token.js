var jwt = require('jsonwebtoken')
var token = {
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

console.log(jwt.sign(token, 'secret'))

