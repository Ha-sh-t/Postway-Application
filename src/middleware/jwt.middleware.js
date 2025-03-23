import jwt from 'jsonwebtoken';

//this function just verify the token avaibility and its correctness
const jwtAuth = (req , res ,next)=>{
    //fetching token from request header
    const token = req.cookies.token;

    //checking avaibility
    if(!token){
        return res.status(400).send("Unauthorized access")
    }

    //checking correctness
    try{
        const payload = jwt.verify(token , 'Secret-Key');
        console.log(payload)
    }
    catch(err){
        console.log(err);
        return res.status(400).send("Unauthorized access");
    }

    //if all good - call to next middleware in pipeline
    next();

}
export default jwtAuth;