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

describe('test sanitize query', () => {
    
    test('filter $', () => {
        let query = {a: {$gte: 5}, $b: 2}
        query = sanitizeQuery(query)
        expect(query).toEqual({a: {$gte: 5}})
    })
})