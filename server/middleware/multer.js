const multer = require("multer");

const fileSorageEngine = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+'--'+file.originalname);
    }
});
const uploadMiddleware = multer({storage:fileSorageEngine});

module.exports = uploadMiddleware;