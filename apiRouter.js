// Imports
var express = require('express');
var usersCtrl = require('./routes/usersCtrl');

// Routes
exports.router = ( function(){
  var apiRouter = express.Router();

  // Users Routers
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);

  return apiRouter;
})();