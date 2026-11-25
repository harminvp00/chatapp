

import { rateLimit } from 'express-rate-limit';


// here I will declare parameter for the rate limiting
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    identifier: "Request Policy violates", 
    statusCode: 429, 
    message: "429: Too many requests"
});
