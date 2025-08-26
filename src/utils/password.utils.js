import bcrypt from "bcrypt";

// 6-digit OTP range
const min = 100000;
const max = 999999;

/**
 * Hash a plain-text password
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
export async function hashPassword(password) {
    try {
        const saltRounds = 10; // balance between speed & security
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error("Password hashing failed: " + error.message);
    }
}

/**
 * Compare plain password with hashed password
 * @param {string} password - user input
 * @param {string} hashedPassword - stored hash
 * @returns {Promise<boolean>} true if match
 */
export async function isAuthentic(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Password verification failed: " + error.message);
    }
}

/**
 * Generate a random 6-digit OTP as string
 * @returns {string} OTP
 */
export function getOtp() {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString();
}