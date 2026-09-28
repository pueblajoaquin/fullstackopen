import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import blogRoutes from './controllers/blog.controller.js'
import dns from 'node:dns'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'

dns.setServers(['1.1.1.1'])

const app = express()
const mongoUrl = process.env.MONGODB_URI

mongoose
  .connect(mongoUrl)
  .then(() => logger.info('connected mongodb'))
  .catch((error) => logger.error('error connecting to mongodb :', error.message))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRoutes)

export default app
