const { equal } = require('../middlewares/can')

describe('test equal', () => {

    test('empty', () => {
        expect(equal({}, {})).toBe(true)
    })

    test('empty not empty', () => {
        expect(equal({}, {a: 1})).toBe(false)
    })

    test('equal', () => {
        expect(equal({a: 1}, {a: 1})).toBe(true)
    })

    test('equal more than one', () => {
        expect(equal({a: 1, b: 2}, {a: 1, b: 2})).toBe(true)
    })

    test('not equal more than one', () => {
        expect(equal({a: 1}, {a: 1, b: 2})).toBe(false)
    })

    test('equal array', () => {
        expect(equal({a: [1, 2, 3]}, {a: 1})).toBe(true)
    })

    test('not equal array', () => {
        expect(equal({a: [1, 2, 3]}, {a: 5})).toBe(false)
    })

    test('not equal one', () => {
        expect(equal({a: 1}, {a: 5})).toBe(false)
    })

    test('not equal different', () => {
        expect(equal({a: 1}, {b: 1})).toBe(false)
    })

})