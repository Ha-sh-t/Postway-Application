import bcrypt from 'bcrypt'

const min = 1000000;
const max = 999999;
/**
 * Hashes a plain-text password using bcrypt
 * 
 * @param {string} password - The plain password to hash
 * @returns {Promise<string>} The hashed password
 * @throws {Error} If hashing fails
 */
    export async function hashPassword(password){
       
        try{
            const saltRounds = 13
            const hash = await bcrypt.hash(password , saltRounds)
    
            return hash
        }
        catch(error){
            throw error;
        }

    }

    export async function isAuthentic(password , hashedPassword){
        console.log(hashedPassword)
        console.log(typeof password);
        try{
           const result = await bcrypt.compare(password , hashedPassword );
           console.log("result :",result);
           return result;

        }catch(error){
            throw error;
        }
    }

    export async function getOtp(){
        const num = Math.floor(Math.random()*(max-min +1))+min;
        return num.toString();
    }