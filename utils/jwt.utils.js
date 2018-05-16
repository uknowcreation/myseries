// Imports
const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'a8t3bgkd969m2kqhq7oxtpr7vxixseecp1evhjaq4l93nvd718';

// Exported func
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      userId: userData.id,
      isAdmin: userData.isAdmin
    },
    JWT_SIGN_SECRET,{
      expiresIn: '1h'
    })
  }
}
