import { Request, Response, NextFunction } from 'express';

// middleware for logging requests
// can be used to log the request before it is processed and/or
// can be used to log the response after it is processed
export const logger = (req: Request, res: Response, next: NextFunction) => {
    // Log the request before it is processed
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Started`);
    
    // Log the request after it is processed
    const originalSend = res.send;
    
    res.send = function(body) {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        return originalSend.call(this, body);
    };
    
    next();
};
