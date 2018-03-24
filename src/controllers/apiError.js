const opbeat = require('opbeat')

// TODO: improve signature, it's bad
const captureError = async (msg, err = {}, req, res, status) => {
  const error = new ApiError(err, status, msg)
  res.status(error.status).json(error)
}

class ApiError extends Error {
  constructor (error, status, message) {
    super(error.message)
    this.status = status || error.status || 500
    this.name = this.constructor.name
    this.message = message || error.message
    this.userMessage = message || error.message
    this.rootCause = error

    this.stackTrace =
      error.stack &&
      error.stack
        .split('\n')
        .slice(0, 2)
        .join('')
    Error.captureStackTrace(this, this.constructor)

    if (process.env.NODE_ENV === 'production') {
      opbeat.captureError(error)
    } else {
      console.log(error)
    }
  }
}

module.exports = { captureError }
