/**
 * @file user.services.js
 * @description UserService class contains business logic for user related operations like
 *  - signIn
 *  - signUp
 *  - logOut
 *  - update
 */

import { ApplicationError } from '../error-handler/applicationError.js';
import UserModel from './user.model.js';
import { hashPassword, isAuthentic } from '../utils/password.utils.js';
import UserRepository from './user.repository.js';
import path from 'path'
import { NotFoundError, UnexpectedError, ValidationError } from '../error-handler/business.layer.error.js';
import { ObjectId } from 'mongodb';
/**
 * @class UserServices
 * @classdesc Handles user-related business logic such as registration, authentication, session handling, and profile management.
 */

/**
 * @typedef {Object} UserInfo
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} password - User's plain-text password
 * @property {string} gender - User's gender
 */
/**
 * @typedef {Object} LoginInfo
 * @property {string} email - User's email address
 * @property {string} password - User's plain-text password
 * @property {string} sessionId - Session identifier for the current login
 */

/**
 * @typedef {Object} LoginResponse
 * @property {boolean} success - Whether login was successful
 * @property {string} message - Login status message
 * @property {Object} user - Logged-in user object (excluding password and session)
 */

/**
 * @typedef {Object} UpdateUserInfo
 * @property {string} _id - User's unique ID
 * @property {string} name - Updated name
 * @property {string} email - Updated email
 * @property {string} avatarUrl - Updated avatar URL
 */

class UserServices {
    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Registers a new user.
     * 
     * @param {UserInfo} userInfo - New user details.
     * @returns {Promise<Object>} The created user object.
     * @throws {ValidationError} If user already exists.
     * @throws {Error} For internal server errors.
     */
    async signUp({ name, email, gender,password }) {
        console.log("call for signup")
        const hashedPassword = await hashPassword(password);

        // Check if user already exists
        const isUser = await this.userRepository.find(email);
        if (isUser) throw new ValidationError("User already exists.");

        const user = new UserModel(name, email,gender, hashedPassword);
        const result = await this.userRepository.add(user);
        if(!result) throw new UnexpectedError("Unexpected Error:Enable to register User");
        return {success:true,message:"Registered Successfully!"}
    }

    /**
     * Signs in a registered user.
     * 
     * @param {LoginInfo} userInfo - Login credentials and session ID.
     * @returns {Promise<LoginResponse>} Login result.
     * @throws {NotFoundError} If user is not found.
     * @throws {ValidationError} If password is incorrect.
     * @throws {Error} For unexpected internal errors.
     */
    async signIn({ email, password, sessionId }) {
        // Check if user exists
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError("User not found with this email ID.");

        // Check if password is provided
        if (!password) {
            return { success: true, message:'Email Verified' };
        }

        // Validate password
        const isValid = await isAuthentic(password, user.password);
        if (!isValid) throw new ValidationError("Incorrect password.");

        // Handle session management
        if (!user.session || !user.session.includes(sessionId)) {
            await this.userRepository.setSession(user._id, sessionId);
            console.log("New login: session ID saved.");
        }

        // Exclude sensitive data from response
        delete user.password;
        delete user.session;

        return {
            success: true,
            message: "Login successful.",
            user: user
        };
    }

    /**
     * Logs out a single session of a user.
     * 
     * @param {string} email - User's email.
     * @param {string} sessionId - Session ID to remove.
     * @returns {Promise<void>}
     */
    async logout(email, sessionId) {
        await this.userRepository.unSetSession(email, sessionId)
        return { "success": true, "message": "Logged out successfully." }
    }

    /**
     * Logs out all sessions of a user.
     * 
     * @param {string} email - User's email.
     * @returns {Promise<void>}
     */
    async logoutAll(email) {
        await this.userRepository.deleteAllSessions(email);
        return { "success": true, "message": "Logged out successfully from all devices." };

    }

    /**
     * Retrieves user by ID.
     * 
     * @param {string} userId - MongoDB ObjectId string.
     * @returns {Promise<Object>} User object.
     * @throws {ValidationError} If userId is not valid.
     * @throws {NotFoundError} If user is not found.
     */
    async getById(userId) {
        if (!ObjectId.isValid(userId)) 
            throw new ValidationError("Expecting 12-byte string as userId");
        const user = await this.userRepository.getUser(userId);
        if (!user) throw new NotFoundError("User not found.")
        return user;
    }
    /**
     * Fetches all users.
     * 
     * @returns {Promise<Object[]>} Array of user objects.
     */
    async getAllUsers() {
        const users = await this.userRepository.getAll();
        return users;
    }
    /**
    /**
     * Updates user information.
     * 
     * @param {UpdateUserInfo} updateData - New user details.
     * @returns {Promise<Object>} Updated user object.
     */
    async updateUser({ _id, name, email, avatarUrl }) {
        if(!ObjectId.isValid(_id)) throw new ValidationError("Incorrect format of _id");
        const result = await this.userRepository.update({ _id, name, email, avatarUrl });
        return result;
    }
}

export default UserServices;