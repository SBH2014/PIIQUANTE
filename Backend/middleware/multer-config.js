const multer = require('multer');
const MIME_TYPES= {
    'image/jpg' : 'jpg',
    'image/jpeq' : 'jpg',
    'image/png' : 'png'
}
//créé un objet de config pour multer 
const storage = multer.diskStorage({
    destination : (req , file , callback ) => {
        callback (null,'images')
    },
    filename : (req , file , callback) => {
        const name = file.originalname.split(' ').join('_'); //eliminé les problemes des espaces 
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
   
});
module.exports = multer({storage}).single('image')