const { Validator } = require('express-json-validator-middleware')

const validator = new Validator({removeAdditional: true, allErrors: true})
validator.ajv.addKeyword('date', {
    validate: function (schema, data, parentSchema, currentDataPath, parentDataObject, name, root) {
      const value = new Date(data);
      if(isNaN(value)){
          return false;
      }
      parentDataObject[name] = value;
      return true;
    },
    errors: true,
    modifying: true
  })

module.exports = validator.validate