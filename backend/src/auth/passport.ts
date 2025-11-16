import passport from 'passport'
import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from 'passport-google-oauth20'

export type SessionUser = {
  id: string
  name: string
  email?: string
}

const inMemoryUsers = new Map<string, SessionUser>()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ''
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:3000'
const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:8000'

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('[auth] Google OAuth credentials are missing. Set GOOGLE_CLIENT_ID/SECRET to enable sign-in.')
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`,
    },
    (accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
      const user: SessionUser = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
      }

      inMemoryUsers.set(user.id, user)
      done(null, user)
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, (user as SessionUser).id)
})

passport.deserializeUser((id: string, done) => {
  const user = inMemoryUsers.get(id) ?? null
  done(null, user)
})

export const authConfig = {
  clientUrl: CLIENT_URL,
}
