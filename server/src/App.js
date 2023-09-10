import express from 'express'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'

import './passport.config'
import config from './config'
import userRoutes from './routes/user.routes'
import courseRoutes from './routes/course.routes'
import adminRoutes from './routes/admin.routes'
import studentRoutes from './routes/student.routes'

const app = express()

app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use(compress())
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(session({
  secret: config.session_secret,
  saveUninitialized: false,
  resave: false
}))
app.use(passport.session())

app.use('/', userRoutes)
app.use('/', courseRoutes)
app.use('/', adminRoutes)
app.use('/', studentRoutes)

export default app