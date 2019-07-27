const db = {
    user: [
        {
            id: 'userxxx',
            parent: 'userxxx',
            therapists: ['aaa', 'bbb', 'userxxx'],
            sede: 'A',
            center: 'C'
        }
    ]
}

module.exports = {
    find(resource, id){
        return db[resource].find((x) => x.id === id)

    }
}
