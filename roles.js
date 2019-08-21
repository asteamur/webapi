module.exports = {
    'admin': {
        'tea:post': {},
        'tea:get': {},
        'tea:patch': {},
        'tea:memorandum:get': {},
        'tea:memorandum:patch': {},
        'tea:memorandum:post': {}
    },
    'test.1': {
        'tea:get': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]}
        },
        'tea:memorandum:get': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {createdBy: '#{userId}' }
        },
        'tea:memorandum:patch':{
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {createdBy: '#{userId}' }
        },
        'tea:patch': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]}
        },
        'tea:post': {
            tea: {}
        }
    },
    'test.2': {
        'tea:memorandum:get': {
            tea: {$or: [{sede: {$in: ['B', 'C']}}, {center: 'CEIP 1'}]},
            memorandum: {createdBy: '#{userId}' }
        },
        'tea:patch': {
            tea: {$or: [{sede: {$in: ['AA', 'BB']}}, {center: 'CEIP 1'}]}
        }
    },
    'test.3': {
        'tea:memorandum:get': {
            tea: {$or: [{sede: {$in: ['A', 'B']}}, {center: 'CEIP 1'}]},
            memorandum: {createdBy: 'userzzz' }
        }
    },
    'test.th': {
        'tea:memorandum:post': {
            tea: {therapists: '#{userId}'}
        }
    }
}