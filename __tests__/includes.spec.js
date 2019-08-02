const { includes } = require('../middlewares/can')

describe('test includes', () => {

    test('empty', () => {
        expect(includes({}, {})).toBe(true)
    })

    test('empty not empty', () => {
        expect(includes({}, {a: 1})).toBe(false)
    })

    test('not empty empty', () => {
        expect(includes({a: 1}, {})).toBe(true)
    })

    test('includes', () => {
        expect(includes({a: 1, b: 1}, {a: 1})).toBe(true)
    })

    test('includes more than one', () => {
        expect(includes({a: 1, b: 2}, {a: 1, b: 2})).toBe(true)
    })

    test('not includes more than one', () => {
        expect(includes({a: 1}, {a: 1, b: 2})).toBe(false)
    })

    test('includes array', () => {
        expect(includes({a: [1, 2, 3]}, {a: 1})).toBe(true)
    })

    test('not includes array', () => {
        expect(includes({a: [1, 2, 3]}, {a: 5})).toBe(false)
    })

    test('not includes one', () => {
        expect(includes({a: 1}, {a: 5})).toBe(false)
    })

    test('not includes different', () => {
        expect(includes({a: 1}, {b: 1})).toBe(false)
    })

})