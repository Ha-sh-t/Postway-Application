import jwt from 'jsonwebtoken';
import { ValidationError } from '../error-handler/business.layer.error.js';

/**
 * Generate JWT token (expires in 5 minutes)
 * Stores userId + email inside token
 */
export function generateJwtToken(userId, email) {
    return jwt.sign(
        { userId, email },          // payload
        process.env.SECRET_KEY,     // secret key
        { expiresIn: '5m' }         // expiry time
    );
}

/**
 * Verify and decode JWT token
 */
export function verifyJWTtoken(token) {
    if (!token) {
        throw new ValidationError("Token is missing.");
    }
    try {
        // decode + verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded; // { userId, email, iat, exp }
    } catch (err) {
        throw new ValidationError("Token is invalid or expired.");
    }
}