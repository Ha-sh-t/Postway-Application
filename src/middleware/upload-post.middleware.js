// this middleware handle the uploading process of post
import multer from 'multer';
import path from 'path'
const postMediaPath = path.resolve('uploads');
const avatarMediaPath = path.resolve('upload','avatar');
const storageConfig = (folder)=> multer.diskStorage({
    destination:(req , res , callback)=>{
        const dir = postMediaPath+ `/${folder}`;
        // fstat.mkdirSync(dir , {recursive:true});//ensures folder exists÷
        callback(null ,dir );
    },
    filename:(req ,file, callback)=>{
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
   
        callback(null , filename);
    }
})

//factory function 
export const uploadImage =(fieldname , folder)=>{
    return multer({storage:storageConfig(folder)}).single(fieldname);

}