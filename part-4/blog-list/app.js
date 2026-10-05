import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import blogRoutes from './controllers/blog.controller.js'
import userRouter from './controllers/user.controller.js'
import loginRouter from './controllers/login.controller.js'
import dns from 'node:dns'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'
import config from './utils/config.js'

dns.setServers(['1.1.1.1'])

const app = express()
const mongoUrl = config.MONGODB_URI

mongoose
  .connect(mongoUrl)
  .then(() => logger.info('connected mongodb'))
  .catch((error) => logger.error('error connecting to mongodb :', error.message))

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogRoutes)
app.use('/api/users', userRouter)

app.use(middleware.errorHandler)

export default app
