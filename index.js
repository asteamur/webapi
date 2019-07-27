const pick = require('object.pick')
const sleep = require('await-sleep')
const memoize = require("memoizee")
const equal = require('deep-equal')

const users = [
    {
        id: 'userxxx',
        sede: 'A',
        center: 'C'
    }
]

const permissions = [
    {
        rol: 'coordinador:cartagena',
        permiso: 'read',
        filter: {
            sede: 'A',
            center: 'C'
        }
    },
    {
        rol: 'coordinador:cartagena',
        permiso: 'write',
        filter: {
            sede: 'B',
            center: 'C'
        }
    }
]    

async function getFilters(rol, permiso) {
    await sleep(1500)
    return permissions.filter((x) => x.rol === rol && x.permiso === permiso).map((z) => pick(z, 'filter'))
}

memoized = memoize(getFilters)

function isAllowed(filters, userId) {
    const user = users.find((u) => u.id === userId)
    for (let f of filters) {
        if (equal(pick(user, Object.keys(f.filter)), f.filter)){
            return true
        }
    }
    return false
}

async function main(){
    let ret = await memoized('coordinador:cartagena', 'read')
    //console.log(ret)
    //ret = await memoized('coordinador:cartagena', 'read')
    //console.log(ret)
    console.log(isAllowed(ret, 'userxxx'))
    console.log(isAllowed(ret, 'useryyy'))
    
}

main()