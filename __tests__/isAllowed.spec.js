const { isAllowed } = require('../middlewares/can')

describe('test is allowed', () => {

    test('has permission', () => {
        const token = {
            allow: [{
                resource: '*',
                permissions: ['a', 'b']
            }]
        }
        expect(isAllowed(token, 'a')).toBe(true)
    })

    test('not has permission', () => {
        const token = {
            allow: [{
                resource: '*',
                permissions: ['a', 'b']
            }]
        }
        expect(isAllowed(token, 'c')).toBe(false)
    })
})
