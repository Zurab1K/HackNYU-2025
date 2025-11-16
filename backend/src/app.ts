import express, { type Express } from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import { logger } from './middleware/logger'
import routes from './routes'
import { errorHandler } from './middleware/errorHandler'
import './auth/passport'
import { authConfig, type SessionUser } from './auth/passport'
import { ensureUserRecord } from './data/userStore'

const app = (): Express => {
  const server = express()

  server.use(
    cors({
      origin: process.env.CLIENT_URL ?? '*',
      credentials: true,
    }),
  )
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  server.use(
    session({
      secret: process.env.SESSION_SECRET || 'fitstreak-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    }),
  )
  server.use(passport.initialize())
  server.use(passport.session())

  server.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

  server.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${authConfig.clientUrl}/?error=google` }),
    async (req, res, next) => {
      try {
        const user = req.user as SessionUser | undefined
        if (user) {
          await ensureUserRecord(user)
        }
        res.redirect(`${authConfig.clientUrl}/welcome`)
      } catch (error) {
        next(error)
      }
    },
  )

  server.post('/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err)
      res.status(204).send()
    })
  })

  server.use(logger)
  server.use('/api', routes)
  server.use(errorHandler)

  return server
}

export default app
