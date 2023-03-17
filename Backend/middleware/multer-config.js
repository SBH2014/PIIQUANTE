const multer = require('multer');

const MIME_TYPES= {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}
//créé un objet de config pour multer 
// diskstorage  configure le chemin et le nom de fichier pour les fichiers entrants.
const storage = multer.diskStorage({
    destination : (req , file , callback ) => {
        callback (null,'images')
    },
 
    filename : (req , file , callback) => {
        const name = file.originalname.split(' ').join('_'); //eliminé les problemes des espaces 
        //mime  pour déterminer son format, et donc trouver son extension
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
   
});
module.exports = multer({storage : storage}).single('image')