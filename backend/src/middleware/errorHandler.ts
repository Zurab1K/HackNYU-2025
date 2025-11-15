import { Request, Response, NextFunction } from 'express';

// error handling middleware: 
// it catches any "throw new Error()" or "next(new Error())" in the routes
// lives right after the routes are processed
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};