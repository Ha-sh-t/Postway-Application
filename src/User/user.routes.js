/**
 * @file user.routes.js
 * @description Express router for handling user authentication , session management and profile operations.
 * 
 * @requires express
 * @requires ../middleware/validator.middleware.js
 * @requires ../middleware/sessionAuth.middleware.js
 * @requires ../middleware/upload-post.middleware.js
 * @requires ./user.controller.js
 */

import express from 'express';
import isDataCorrectlyEntered from '../middleware/validator.middleware.js';
import { sessionAuth } from '../middleware/sessionAuth.middleware.js';
import { uploadImage } from '../middleware/upload-post.middleware.js';
import UserController from './user.controller.js';


const userRouter = express.Router();

const userController = new UserController();

/**
 * @route POST /api/users/signup
 * @desc Registers a new user
 * @access Public
 * @middleware isDataCorrectlyEntered - Validates input fields
 */
userRouter.post('/signup' ,isDataCorrectlyEntered, (req , res , next)=>{
    userController.signUp(req , res , next)
})

/**
 * @route POST /api/users/signin
 * @desc Login a registered user
 * @access Public
 * @middleware isDataCorrectlyEntered - Validates input fields
 */
userRouter.post('/signin' , isDataCorrectlyEntered , (req , res , next)=>{
    userController.login(req , res , next)
})

/**
 * @route POST /api/users/logout
 * @desc Log out current session
 * @access Private
 * @middleware sessionAuth - Verifies session authentication
 */
userRouter.post('/logout' ,sessionAuth ,(req , res , next)=>{
    userController.logout(req , res , next)
})

/**
 * @route POST /api/users/logout-all-devices
 * @desc Log out from all devices (destroy all active sessions)
 * @access Private
 * @middleware sessionAuth - Verifies session authentication
 */
userRouter.post('/logout-all-devices',sessionAuth, (req , res , next)=>{
    userController.logoutAll(req , res , next);
})

/**
 * @route GET /api/users/get-details/:userId
 * @desc Get user details by ID(12-byte string)
 * @access Private
 * @middleware sessionAuth - Verifies session authentication
 */
userRouter.get('/get-details/:userId' ,sessionAuth, (req ,res , next)=>{
    userController.getUserById(req , res , next);
})

/**
 * @route GET /api/users/get-all-details
 * @desc Get all the registered users details
 * @access Private
 * @middleware sessionAuth - Verifies session authentication
 */
userRouter.get('/get-all-details' , sessionAuth, (req , res , next)=>{
    userController.getAllUsers(req , res , next);
})

/**
 * @route PUT /api/users/update-details/:userId
 * @desc Update the user profile details(name , avatar)
 * @access Private
 * @middleware sessionAuth -Verifies session authentication
 * @middleware uploadImage - Handles multipart form data; store avatar to /uploads/avatars 
 */
userRouter.put('/update-details/:userId', sessionAuth, uploadImage('avatar' , 'avatars') ,(req , res , next)=>{
    userController.updateUser(req , res , next);
})
//exporting userRouter so that we can use it in index.js
export default userRouter;