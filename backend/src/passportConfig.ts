import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";

// In-memory store for users (replace this with your preferred storage)
const users: Record<string, any> = {};

passport.use(
  new GoogleStrategy(
    {
      clientID: "1011823152528-m1hem7upbt6rgibtl08ppr9aqhlriuql.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
      };
      
      // Store user in memory (or use your preferred storage)
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