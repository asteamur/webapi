module.exports = {
    'test.1': {
        'tea:get': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]}
        },
        'tea:memorandum:get': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {author: '#{userId}' }
        },
        'tea:memorandum:patch':{
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {author: '#{userId}' }
        },
        'tea:patch': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]}
        }
    },
    'test.2': {
        'tea:memorandum:get': {
            tea: {$or: [{sede: {$in: ['B', 'C']}}, {center: 'CEIP 1'}]},
            memorandum: {author: '#{userId}' }
        },
        'tea:patch': {
            tea: {$or: [{sede: {$in: ['AA', 'BB']}}, {center: 'CEIP 1'}]}
        }
    },
    'test.3': {
        'tea:memorandum:get': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {author: 'userzzz' }
        }
    },
    'test.th': {
        'tea:memorandum:post': {
            tea: {therapists: '#{userId}'}
        }
    }
}