const { hasPermission } = require('../middlewares/can')

describe('test has permission', () => {

    test('simple', () => {
        const ap = [{
            tea: { sede: 'A'},
            memorandum: {author: 'miguel' }
        }]
        const objs = {
            tea: {_id: '0', sede: 'A'},
            memorandum: {_id: '1', author: 'miguel'}
        }
        expect(hasPermission(ap, objs)).toBe(true)
    })

    test('simple false', () => {
        const ap = [{
            tea: { sede: 'A'},
            memorandum: {author: 'miguel' }
        }]
        const objs = {
            tea: {_id: '0', sede: 'A'},
            memorandum: {_id: '1', author: 'john'}
        }
        expect(hasPermission(ap, objs)).toBe(false)
    })

    test('pass author not pass sede', () => {
        const ap = [{
            tea: { sede: 'A'},
            memorandum: {author: 'miguel' }
        }]
        const objs = {
            tea: {_id: '0', sede: 'B'},
            memorandum: {_id: '1', author: 'miguel'}
        }
        expect(hasPermission(ap, objs)).toBe(false)
    })

    test('pass second permission', () => {
        const ap = [{
            tea: { sede: 'A'},
            memorandum: {author: 'miguel' }
        }, {
            tea: { sede: 'B'},
            memorandum: {author: 'miguel' }
        }]
        const objs = {
            tea: {_id: '0', sede: 'B'},
            memorandum: {_id: '1', author: 'miguel'}
        }
        expect(hasPermission(ap, objs)).toBe(true)
    })

})