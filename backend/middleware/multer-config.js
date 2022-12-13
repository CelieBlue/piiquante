//Multer importation
const multer = require('multer');

//Give an extension to the images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//diskStorage method: path configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (rq, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '_' + extension);
    }
});

module.exports = multer({ storage }).single('image');