import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import dotenv from 'dotenv';
dotenv.config();

const users: Record<string, any> = {};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
      };
      
      users[profile.id] = user;
      
      return done(null, user);
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id: string, done) => {
  const user = users[id] || null;
  done(null, user);
});

export default passport;