const { sanitizeQuery, sanitizeSelect } = require('../lib')

describe('test sanitize select', () => {
    
    test('filter password', () => {
        let select = {password: 1, a: 1}
        select = sanitizeSelect(select)
        expect(select).toEqual({a:1})
    })

    test('filter 0', () => {
        let select = {a: 0, b: 0, c: 1}
        select = sanitizeSelect(select)
        expect(select).toEqual({c:1})
    })
})