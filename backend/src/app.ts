import express, { type Express } from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import passport from "passport";
import session from 'express-session';
import './passportConfig';

const app = (): Express => {
    const app = express();

    // Apply standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // CORS configuration
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));

    // Session configuration
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Google OAuth routes
    app.get('/auth/google', 
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/loginfail' }),
        (req, res) => {
            res.redirect("http://localhost:3000/welcome");
        }
    );

    app.get("/loginfail", (req, res) => {
        res.send("Authentication failed. Please try again.");
    });

    // Request logging
    app.use(logger);

    // Mount all routes
    app.use('/', routes);  // This is the key change - use app.use instead of app.post

    // Error handling
    app.use(errorHandler);

    return app;
}

const server = app();

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;