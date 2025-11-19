import { body, validationResult } from 'express-validator'


/**
 * @module middleware/isDataCorrectlyEntered
 * @description 
 * Express middleware for validating request bodies for authentication routes('/signin' , '/signup')
 * Handles :
 *  - /signin -> validates email and optional password
 *  - /signup -> validates name , email and password
 * 
 * Validation Rules:
 *  - name: must not be empty (signup Only)
 *  - email:must not be empty and in valid format
 *  - password:must not be empty (if present)
 * 
 * On validation failure:
 *  - Responds with 400 error
 *  - Attaches `errors.array()` to `err.details`
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>} 
 */
const isDataCorrectlyEntered = async (req, res, next) => {
    if(req.url.includes('signin')){

      const rules = [
        body('email').notEmpty().withMessage('Email is required'),
        body('email').trim().normalizeEmail().isEmail().withMessage('Please enter a valid email.')
      ];

      if('password' in req.body){
        rules.push(body('password').notEmpty().withMessage('Password is required'))
      }

          
          // Run validations
          await Promise.all(rules.map(rule => rule.run(req)));
          
          const errors = validationResult(req);
          
          if (!errors.isEmpty()) {
            const err = new Error("Data validation failed");
            err.status = 400;
            err.type == 'validation';
            err.details = errors.array();
            return next( err)
          }
          
          next();
    }else{
        console.log('Content-Type:', req.headers['content-type']);
        console.log(req.body)
        const rules = [
          body('name').notEmpty().withMessage('Name is required'),
          body('email').notEmpty().withMessage('Email is required'),
          body('email').trim()
          .normalizeEmail().isEmail().withMessage('Please enter a valid email.'),
          body('gender').notEmpty().withMessage('Please choose your gender.'),
          body('password').notEmpty().withMessage('Password is required')
        ];
      
        // Run validations
        await Promise.all(rules.map(rule => rule.run(req)));
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error("Data validation failed");
            err.status = 400;
            err.type == 'validation';
            err.details = errors.array();
            return next(err)
        }
      
        next();
    }

  };

export default isDataCorrectlyEntered;