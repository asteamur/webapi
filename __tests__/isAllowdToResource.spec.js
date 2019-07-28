const { isAllowedToResource } = require('../middlewares/can')

describe('test is allowed to resource', () => {

    test('has permission', () => {
        const token = {
            allow: [{
                resource: 'user',
                permissions: [{
                    permission: 'a',
                    filter: {a: 1}
                }]
            }]
        }
        expect(isAllowedToResource(token, 'user', {id: '0', a: 1, b: 2}, 'a')).toBe(true)
    })

    test('has permission no filter', () => {
        const token = {
            allow: [{
                resource: 'user',
                permissions: [{
                    permission: 'a'
                }]
            }]
        }
        expect(isAllowedToResource(token, 'user', {id: '0', a: 1, b: 2}, 'a')).toBe(true)
    })

    test('no has permission: filter ok', () => {
        const token = {
            allow: [{
                resource: 'user',
                permissions: [{
                    permission: 'a',
                    filter: {a: 1}
                }]
            }]
        }
        expect(isAllowedToResource(token, 'user', {id: '0', a: 1, b: 2}, 'b')).toBe(false)
    })

    test('no has permission: filter not ok', () => {
        const token = {
            allow: [{
                resource: 'user',
                permissions: [{
                    permission: 'a',
                    filter: {a: 2}
                }]
            }]
        }
        expect(isAllowedToResource(token, 'user', {id: '0', a: 1, b: 2}, 'a')).toBe(false)
    })

})
