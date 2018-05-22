
// Imports
const asyncLib = require('async');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../utils/jwt.utils');
const regex = require('../utils/regex');
const models = require('../models');
const log = require('simple-node-logger').createSimpleLogger('./var/node.log');
const saltRounds = 10;

// Routes
module.exports = {
  register: function(req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let bio = req.body.bio;
    let roleId = 2;
    
    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'Missing parameters' });
    }

    if (username.length >= 13 || username.length <= 4) {
      return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
    }

    if (!regex.generateMailRegex(email).test(email)) {
      return res.status(400).json({ 'error': 'Email is invalid'});
    }

    if (!regex.generatePasswordRegex(password).test(password)) {
      console.log(password);
      return res.status(400).json({ 'error': 'Password is invalid'});
    }
    
    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err){
          return res.status(500).json({'error': 'Unable to verify user'});
        });
      },
      function(userFound, done) {
        if(!userFound) {
          bcrypt.hash(password, bcrypt.genSaltSync(saltRounds), null, function(err, hashpwd) {
            done(null, userFound, hashpwd);
          });
        }
        return res.status(409).json({ 'error': 'user already exist' });
      },
      function(userFound, hashpwd, done) {
        let newUser = models.User.create({
          email: email,
          username: username,
          password: hashpwd,
          firstname: firstname,
          lastname: lastname,
          bio: bio,
          isAdmin: 0,
          isActive: 1
        })
        .then(function(newUser){
          done(newUser);
        })
        .catch(function(err){
          return res.status(500).json({'error': 'Cannot add user'});
        })
      }
    ],
    function(newUser) {
      if(newUser) {
        return res.status(201).json({
          'userId': newUser.id
        });
      }
      return res.status(500).json({ 'err': 'Error! cannot add user'})
    });
  },
  // Login function 
  login: function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ 'error': 'Missing paramters in register' });
    }

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          where: { email: email }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if (userFound) {
          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            done(null, userFound, resBycrypt);
          });
        } else {
          return res.status(404).json({ 'error': 'user not exist in DB' });
        }
      },
      function(userFound, resBycrypt, done) {
        if (resBycrypt) {
          done(userFound);
        } 
        return res.status(403).json({ 'error': 'invalid password' });
      }
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json({
          userId: userFound.id,
          token: jwt.generateTokenForUser(userFound)
        });
      }
      return res.status(500).json({'erro': 'wrong token'});
    });
  },
  getUserProfile: function(req, res) {
    let headerAuth = req.headers['authorization'];
    let userId = jwt.getUserId(headerAuth);
  
    if (userId < 0) {
      models.User.findOne({
        attributes: [ 'id', 'email', 'username', 'bio' ],
        where: { id: userId }
      })
      .then(function(user){
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(400).json({ 'error': 'user not found' })
        }
      })
      .catch(function(err) {
        res.status(500).json({ 'error': 'cannot fetch user'})
      })
    }
  }
};