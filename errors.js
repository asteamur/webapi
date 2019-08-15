function AuthError(description){
    const error = new Error()
    error.code = 'not-allowed'
    error.description = description
    return error
}

function IdError(description){
    const error = new Error()
    error.code = 'bad _id'
    error.description = description
    return error
}

module.exports = {
    AuthError,
    IdError
}