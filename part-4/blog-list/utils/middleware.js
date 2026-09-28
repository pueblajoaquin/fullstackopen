import logger from './logger.js'

const requestLogger = (req, res, next) => {
  logger.info(req.method)
  logger.info(req.path)
  logger.info(req.body)
  next()
}

export default { requestLogger }
