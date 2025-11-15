import express, { type Express } from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import passport from "passport";
import session from 'express-session';
import './passportConfig'; // This will execute the passport configuration

const app = (): Express => {
    let app = express();

    // Apply standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: 'http://localhost:3000', // Your frontend URL
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

    // Initialize Passport and restore authentication state from session
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/google', (req, res, next) => {
        console.log('1. /auth/google route called');
        next();
    }, passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/loginfail' }),
        (req, res) => {
            console.log("4. /auth/google/callback route called");
            res.redirect("http://localhost:3000/welcome");
        }
    );

    app.get("/loginfail", (req, res) => {
        console.log("Login failed");
        res.send("Authentication failed. Please try again.");
    });

    app.get('/user', (req, res) => {
        if (req.isAuthenticated()) {
            res.send(req.user);
        }
        else {
            res.send("error not authenticated");
        }
    })


    // middleware for logging requests
    app.use(logger);

    // add any pre-route middleware here

    // mount all routes
    app.use('/', routes);

    // add any post-route middleware here

    // error handling middleware
    app.use(errorHandler);

    return app;
}

const server = app();

server.listen(8000, () => {
    console.log('Server started on port 8000');
});

export default app;