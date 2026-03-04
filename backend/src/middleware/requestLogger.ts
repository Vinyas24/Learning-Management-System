import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const { statusCode } = res;

        const color = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
        const reset = '\x1b[0m';

        console.log(
            `${color}${method}${reset} ${originalUrl} → ${color}${statusCode}${reset} (${duration}ms)`
        );
    });

    next();
};
