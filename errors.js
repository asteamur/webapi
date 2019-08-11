function AuthError(description){
    const error = new Error()
    error.code = 'not-allowed'
    error.description = description
    return error
}

function IdError(){
    const error = new Error()
    error.code = 'bad _id'
    return error
}

module.exports = {
    AuthError,
    IdError
}