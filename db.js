var MongoClient = require('mongodb').MongoClient
const { IdError, AuthError } = require('./errors')
const { sanitizeQuery, sanitizeSelect } = require('./lib')
const { ObjectID } = require('mongodb')

var state = {
  db: null,
}

exports.connect = function(url, opts, done) {
  if (state.db) return done()

  MongoClient.connect(url, opts, function(err, client) {
    if (err) return done(err)
    state.db = client.db(process.env.DB_NAME)
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}

exports.find = async function({collection, query, filters, select, cursor}){
  query = sanitizeQuery(query)
  select = sanitizeSelect(select)
  query = {...query, ...filters}

  return await state.db.collection(collection).find(query, {projection: select}).
      limit(cursor.limit).skip(cursor.skip).sort(cursor.sort).toArray()    
}

exports.findOne = async function({collection, _id, filters, select}){  
  select = sanitizeSelect(select)
  try{
      _id = new ObjectID(_id)
  }catch(err){      
      throw(IdError('tea:get:' + _id))
  }
  const query = { _id, ...filters }
  const doc = await state.db.collection(collection).findOne(query, {projection: select})
  if(doc === null){
      throw(AuthError('no item: ' + _id))
  }
  return doc
}

exports.update = async function({collection, _id, filters, doc}){
  try{
      _id = new ObjectID(_id)
  }catch(err){
      throw(IdError('tea:patch:' + _id))
  }
  query = { _id , ...filters}
  const t = await state.db.collection(collection).findOne(query)    
  if(!t){
      throw(AuthError('no item: ' + _id))
  }else{
      await state.db.collection(collection).updateOne({_id}, {$set: doc})
  }
}