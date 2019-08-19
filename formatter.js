const { formatter, validator } = require('querymen')
const dayjs = require('dayjs')

formatter('yearsAgo', (age, value, param) => {
    if (age) {
      value = dayjs().subtract(value, 'year').toDate()
    }
    return value
})

validator('yearsAgo', (age, value, param) => {
    return {
        valid: !age || /\d+/.test(value),
        message: 'must be integer'
    }
})


formatter('daysAgo', (age, value, param) => {
    if (age) {
      value = dayjs().subtract(value, 'day').toDate()
    }
    return value
})

validator('daysAgo', (age, value, param) => {
    return {
        valid: !age || /\d+/.test(value),
        message: 'must be integer'
    }
})