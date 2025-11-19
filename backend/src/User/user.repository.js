/**
 * @file user.repository.js
 * @description Repository class for all user-related database operations in MongoDB.
 * @module repositories/UserRepository
 */

import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.config.js";

/**
 * Handles user database CRUD operations.
 */
export default class UserRepository {
    constructor() {
        /** 
         * MongoDB collection instance for users.
         * @private
         */
        this.collection = getDB().collection("User");
    }

    /**
     * Inserts a new user document into the collection.
     * @async
     * @param {Object} user - User object to insert.
     * @returns {Promise<boolean>} True if insertion succeeded.
     * @throws {Error} On database insertion failure.
     */
    async add(user) {
        const result = await this.collection.insertOne(user);
        return result.acknowledged;
    }

    /**
     * Finds a user document by email.
     * @async
     * @param {string} email - User's email address.
     * @returns {Promise<Object|null>} The user document or null if not found.
     * @throws {Error} On query failure.
     */
    async find(email) {
        try {
            return await this.collection.findOne({ email });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Adds a session ID to the user's session array if not already present.
     * @async
     * @param {string} userId - User's MongoDB ObjectId as a string.
     * @param {string} sessionId - Session ID to add.
     * @returns {Promise<void>}
     * @throws {Error} On update failure.
     */
    async setSession(userId, sessionId) {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { session: sessionId } }
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * Removes a session ID from the user's session array.
     * @async
     * @param {string} email - User's email address.
     * @param {string} sessionId - Session ID to remove.
     * @returns {Promise<void>}
     * @throws {Error} On update failure.
     */
    async unSetSession(email, sessionId) {
        try {
            await this.collection.updateOne(
                { email },
                { $pull: { session: sessionId } }
            );
        } catch (err) {
            throw err;
        }
    }

    /**
     * Clears all session IDs for the specified user.
     * @async
     * @param {string} email - User's email address.
     * @returns {Promise<void>}
     * @throws {Error} On update failure.
     */
    async deleteAllSessions(email) {
        try {
            await this.collection.updateMany(
                { email },
                { $set: { session: [] } }
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches a user by ID, excluding sensitive fields like password and sessions.
     * @async
     * @param {string} userId - User's MongoDB ObjectId as a string.
     * @returns {Promise<Object|null>} The user document without password/session or null.
     * @throws {Error} On query failure.
     */
    async getUser(userId) {
        try {
            return await this.collection.findOne(
                { _id: new ObjectId(userId) },
                { projection: { password: 0, session: 0 } }
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches all users, excluding password and session fields.
     * @async
     * @returns {Promise<Array<Object>>} Array of user documents.
     * @throws {Error} On query failure.
     */
    async getAll() {
        try {
            return await this.collection.find(
                {},
                { projection: { password: 0, session: 0 } }
            ).toArray();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates user details like name, email, and avatar.
     * @async
     * @param {Object} user - User data to update.
     * @param {string} user._id - User's MongoDB ObjectId as a string.
     * @param {string} user.name - Updated user name.
     * @param {string} user.email - Updated user email.
     * @param {string} user.avatarUrl - Updated avatar URL.
     * @returns {Promise<Object|null>} Updated user document or null if not found.
     * @throws {Error} On update failure.
     */
    async update({ _id, name, email, avatarUrl }) {
        try {
            const updatedUser = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(_id) },
                { $set: { name, email, avatar: avatarUrl } },
                { returnDocument: "after" }
            );
            return updatedUser.value;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates the user's password.
     * @async
     * @param {string} id - User's MongoDB ObjectId as a string.
     * @param {string} newPassword - New hashed password.
     * @returns {Promise<void>}
     * @throws {Error} On update failure.
     */
    async updatePassword(id, newPassword) {
        try {
            await this.collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { password: newPassword } }
            );
        } catch (error) {
            throw error;
        }
    }
}