const errorHandler = (err, req, res, next) => {
    console.error('SERVER ERROR:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';

    res.status(statusCode).json({
        error: message,
        code: code,
        // Only show stack trace in dev
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

module.exports = errorHandler;

