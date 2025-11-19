import jwt from 'jsonwebtoken';
import UserModel from "./user.model.js";
import { ApplicationError } from '../error-handler/applicationError.js';
import UserServices from './user.services.js';
import { ValidationError } from '../error-handler/business.layer.error.js';
// const userModel = new UserModel();
export default class UserController {
    constructor() {
        this.userServices = new UserServices();
    }


    /**
     * Register new user
     * @param {import('express').Request} req - Express Request Object
     * @param {import('express').Response} res- Express Response Object
     * @param {import('express').NextFunction} next - Express Next middleware function
     * @param {Object} req.body
     * @param {string} req.body.name - user name
     * @param {string} req.body.email - user email
     * @param {string} req.body.gender - user gender
     * @param {string} req.body.password - user plain password
     * @returns {Promise<void>} 201 - Created user Response
     * @throws {ApplicationError} 400 - If user already exits
     * @throws {Error} For Unexpected internal server errors
     */
    async signUp(req, res, next) {
        //code here
        try {
            const { name, email, gender,password } = req.body
            const response = await this.userServices.signUp({ name, email, gender, password})
            return res.status(201).json(response)
        } catch (err) {
            next(err);
        }
    }

    /**
     * Log in a registered user
     * 
     * @param {import('express').Request} req - Express Request object
     * @param {Object} req.body - Request body containing login credentials
     * @param {string} req.body.email - Email address of the user
     * @param {string} req.body.password - Plain-text password of the user
     * 
     * @param {import('express').Response} res - Express Response object
     * @param {import('express').NextFunction} next - Express Next middleware
     * 
     * @returns {Promise<void>} Sends 200 response on successful login
     * 
     * @throws {ApplicationError} 400 - If the user is already logged in
     * @throws {NotFoundError} 404 - If the user is not registered
     * @throws {ValidationError} 401 - If an incorrect password is provided
     * @throws {Error} For unexpected internal server errors
     */

    //function handling user login operation 
    async login(req, res, next) {
        try {
            if (req.session.user) {
                throw new ApplicationError("Already logged in.", 400)
            }
            const { email, password } = req.body;
            const sessionId = req.sessionID;
            const response = await this.userServices.signIn({ email, password, sessionId });
            console.log("response: ", response)
            if (response.success && response.message.includes("Login successful")) {
                req.session.user = {
                    _id: response.user._id,
                    email,
                    role: 'user'
                }
            }
            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Log out the currently logged-in user
     *
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next middleware function
     *
     * @returns {Promise<void>} Responds with 200 status on successful logout
     * @throws {Error} 500 - Unexpected internal server error during logout
     */
    async logout(req, res, next) {
        try {
            const { user } = req.session;
            const response = await this.userServices.logout(user.email, req.sessionID);
            req.session.destroy(err => {
                if (err) throw err;

            })
            res.clearCookie('connect.sid');
            res.json(response)
        } catch (err) {
            next(err);
        }
    }

    /**
     * Log out the currently logged-in user from all devices
     *
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next middleware function
     *
     * @returns {Promise<void>} Responds with 200 status on successful logout
     * @throws {Error} 500 - Unexpected internal server error during logout
     */
    async logoutAll(req, res, next) {
        try {
            const user = req.session.user;
            const response = await this.userServices.logoutAll(user.email);
            req.session.destroy(err => {
                if (err) throw err;
            })
            res.clearCookie('connect.sid');
            res.json(response)

        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Fetch a user via userId (12-byte string (objectID))
     *
     * @param {import('express').Request} req - Express request object
     * @param {Object} req.params
     * @param {string} req.params.userID - 12 byte userId
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next middleware function
     *
     * @returns {Promise<void>} Responds with 200 status and existing user details
     *
     * @throws {NotFoundError} 404 - If no user registered with userId
     * @throws {Error} 500 - Unexpected internal server error during logout
     */
    async getUserById(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await this.userServices.getById(userId);
            res.status(200).json({ "success": true, "user": user })
        } catch (error) {
            next(error);
        }

    }
    /**
     * Fetch all the users details
     *
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next middleware function
     *
     * @returns {Promise<void>} Responds with 200 status and registered users details
     *
     * @throws {NotFoundError} 404 - If no user registered with userId
     * @throws {Error} 500 - Unexpected internal server error during logout
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await this.userServices.getAllUsers();
            res.status(200).json({ "success": true, "users": users })
        }
        catch (error) {
            next(error)
        }
    }

    /**
     * Update the user details (name and avatar)
     *
     * @param {import('express').Request} req - Express request object
     * @param {Object} req.body - Request payload
     * @param {string} req.body._id - 12-byte user ID (MongoDB ObjectId)
     * @param {string} req.body.name - New name for the user
     * @param {string} req.body.email - Email of the user
     * @param {import('express').Response} res - Express response object
     * @param {import('express').NextFunction} next - Express next middleware function
     *
     * @returns {Promise<void>} Responds with 200 status and updated user details on success
     *
     * @throws {NotFoundError} 404 - If no user is registered with the provided ID
     * @throws {Error} 500 - Unexpected internal server error
     */

    async updateUser(req, res, next) {
        try {
            const { _id, name, email } = req.body;
            const avatarUrl = `/uploads/avatars/${req.filename}`;
            const updatedUser = await this.userServices.updateUser({ _id, name, email, avatarUrl });
            res.status(200).json({ "success": true, "user": updatedUser })
        }
        catch (error) {
            next(error)
        }
    }


}