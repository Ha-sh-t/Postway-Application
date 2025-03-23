// this middleware handle the uploading process of post
import multer from 'multer';

const storageConfig = multer.diskStorage({
    destination:(req , res , callback)=>{
        callback(null , '../media/posts/');
    },
    filename:(req ,file, callback)=>{
        const name = Date.now() +file.originalname;
        callback(null , name);
    }
})

export const uploadImage = multer({storage:storageConfig});