const dotenv = require('dotenv');
dotenv.config();

//Jsonwebtoken importation
const jwt = require('jsonwebtoken');
 
//Verify the token of the request with the token of the database */
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, `${process.env.RANDOM_TOKEN_SECRET}`);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       res.status(401).json({ error });
       console.log("middleware auth : le token n'est pas valide");
   }
};