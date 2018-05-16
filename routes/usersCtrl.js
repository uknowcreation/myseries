
// Imports
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../utils/jwt.utils');
const regex = require('../utils/regex');
const models = require('../models');
const log = require('simple-node-logger').createSimpleLogger('./var/node.log');
const saltRounds = 10;

// Routes
module.exports = {
  register: function(req, res) {
    // TODO: implements register
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let bio = req.body.bio;

    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'Missing parameters' });
    }
    // verify length, email regex, password ...
    if ( username.length >= 13 || username.length <= 4 ) {
      return res.status(400).json({ 'error': 'Wrong Username(must be length 5 - 12)'});
    }
    
    if (!regex.generateMailRegex(email).test(email)) {
      return res.status(400).json({ 'error': 'Email is invalid'});
    }
    
    if (!regex.generatePasswordRegex(password).test(password)) {
      return res.status(400).json({ 'error': 'Password is invalid'});
    }

    // check if email good or not
    models.User.findOne({
      attributes: ['email'],
      where: { email: email }
    })
    .then(function(userFound) {
      if (!userFound) {
        bcrypt.hash(password, bcrypt.genSaltSync(saltRounds), null, function(err, hashpwd) {
          console.log(err);
          let newUser = models.User.create({
            email: email,
            username: username,
            password: hashpwd,
            firstname: firstname,
            lastname: lastname,
            bio: bio,
            isAdmin: 0,
            isActive: 1,
          })
          .then(function(newUser){
            return res.status(201).json({ 'userId': newUser.id });
          })
          .catch(function(err){
            log.info(err.stack);
            return res.status(500).json({ 'error': 'cannot add user' });
          });
        });

      } else {
        return res.status(409).json({ 'error': 'user already exist' });
      }
    })
    .catch(function(err) {
      log.info(err.stack);
      return res.status(500).json({ 'error': 'unable to verify user' });
    });
  },
  // Login function 
  login: function(req, res) {
    //Params
    let email = req.body.email;
    let password = req.body.password;
    // Check if mail and password not null
    if (email == null || password == null) {
      return res.status(400).json({ 'error': 'Missing paramters in register' });
    }
    console.log(models.User.findOne({
      where: { email: email }
    }));
    // Sequelize method ORM findOne
    models.User.findOne({
      where: { email: email }
    })
    .then(function(userFound){
      if (userFound) {    
        bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
          if (resBycrypt) {
            return res.status(200).json({
              'userId': userFound.id,
              'token': jwt.generateTokenForUser(userFound),
            });
          }
        });
      } else {
        return res.status(404).json({ 'error': 'User not exist' });
      }
    })
    .catch(function(err){
      log.info(err);
      return res.status(500).json({ 'error': 'unable to verify user' });
    });
  }
};