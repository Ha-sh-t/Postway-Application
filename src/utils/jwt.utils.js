
import jwt from 'jsonwebtoken'
import { ValidationError } from '../error-handler/business.layer.error.js'

export function generateJwtToken(userId , email){
    return jwt.sign({userId,email} , process.env.SECRET_KEY ,{expiresIn:'5m'})
}

export function verifyJWTtoken(token){
    if(!token) throw new ValidationError("token is missing.")
    jwt.verify(token , process.env.SECRET_KEY)

}