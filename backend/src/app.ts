import express, {type Express} from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const server = (): Express => {
    const app = express();

    // Apply standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    
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