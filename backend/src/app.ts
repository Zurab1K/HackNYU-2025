import express, {type Express} from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import passport from "passport";

const server = (): Express => {
    const app = express();

    // Apply standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

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
            res.redirect("http://localhost:5173/dashboard");
        }
    );

    app.get("/loginfail", (req, res) => {
        console.log("Login failed");
        res.send("Authentication failed. Please try again.");
    });

    app.get('/user', (req,res)=>{
        if(req.isAuthenticated()){
            res.send(req.user);
        }
        else{
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

export default server;