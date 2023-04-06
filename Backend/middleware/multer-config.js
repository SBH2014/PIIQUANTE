// importer multer 
const multer = require('multer');
// on définit les images/formats reçu en appartenance de format ( comme un dictionnaire)
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/x-icon": "ico",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/tif": "tif",
    "image/webp": "webp",
}
//créé un objet de config pour multer 
// diskstorage  configure le chemin et le nom de fichier pour les fichiers entrants.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    filename: (req, file, callback) => {
        // nom d'origine du fichier que l'ont transforme si il y a des espaces, on crée un tableau et on join ses éléments par _
        const name = file.originalname.split(' ').join('_'); //eliminé les problemes des espaces 
        //mime  pour déterminer son format, et donc trouver son extension 

        const extension = MIME_TYPES[file.mimetype];

        //nom associé à une date (pour le rendre le plus unique possible) et un point et son extension
        callback(null, name + Date.now() + '.' + extension);


    }

});
// on exporte le fichier via multer qui possede l'objet storage puis .single signifie fichier unique (pas un groupe de fichiers)  
// ce nom de fichier sera la key dans form-data de postman (insert File)
module.exports = multer({ storage: storage }).single('image')