const dotenv = require('dotenv');
dotenv.config();

//Mongoose importation
const mongoose = require('mongoose');

//Connection to the database "piiquante" on MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.CLUSTER_NAME}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
    useUnifiedTopology: true})
.then(()=> console.log('Connexion à la base de données réussie !'))
.catch(()=> console.log('Connexion à la base de données échouée !'));

module.exports = mongoose;