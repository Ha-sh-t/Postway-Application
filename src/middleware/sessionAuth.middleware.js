import { ApplicationError } from "../error-handler/applicationError.js"

/**
 * @module middleware/sessionAuth
 * @description
 * Express middleware to authenticate user sessions. 
 * Ensures that a valid user session exists in the `req.session` object.
 * 
 * If the session is not present, it throws an `ApplicationError` with a 401 status code.
 *
 * @function sessionAuth
 * @param {import('express').Request} req - Express request object 
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function 
 * @returns {void}
 * @throws {ApplicationError} If no active user session is found
 */
export function sessionAuth(req , res , next){
    console.log(req.session.user)
    if(!req.session.user){
       return next(new ApplicationError("Please login first." , 401)) 

    }
    next()
}