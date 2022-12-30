const rateLimiter = require('express-rate-limit');

const signupLimiter = rateLimiter({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	statusCode: 429,
    message:  {
        status: 429,
        limiter: true,
        error: "Trop de comptes créés depuis cette IP. Veuillez réessayer dans une heure",
    },
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true,
    handler: (req, res, next, options) =>
        res.status(options.statusCode).send(options.message),
    requestWasSuccessful: (req, res) => res.statusCode < 400,
});

const loginLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000, //5 minutes
    max: 10, //Limits each IP to 5 requests per 5 minutes
    statusCode: 429,
    message:  {
        status: 429,
        limiter: true,
        error: "Vous avez fait trop de tentatives de connexion. Veuillez réessayer plus tard"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: false,
    handler: (req, res, next, options) =>
        res.status(options.statusCode).send(options.message),
    requestWasSuccessful: (req, res) => res.statusCode < 400,
});

module.exports = { signupLimiter, loginLimiter };