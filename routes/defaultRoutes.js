const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

router.all('/',(req, res, next) =>{
      req.app.locals.layout = 'default';
         
      next();
   });
router.route('/')
      .get(defaultController.index);


//Defining Local Strategy
passport.use(new localStrategy({
      usernameFeild: 'email',
      pasReqToCallback: true
},(req, email, pasword, done) =>{
   User.findOne({email: email}).then(user =>{
      if(!user){
            return done(null, false, req.flase('error-message', 'User not found with this email.'));
      }
      bcrypt.compare(pasword, user.pasword, (err, passwordMatched) =>{
            if(err){
                  return err;
            }else{
                  if(!passwordMatched){
                        return done(null, false, req.flase('error-message', 'Invalid Username or Password'));
                  }

              return done(null, user, req.flase('success-message', 'Login Successful'));
            }
      });
   });
}
));

passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });



router.route('/login')
      .get(defaultController.loginGet)
      .post(passport.authenticate('local',{
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: true,
            session: true
      }),defaultController.loginPost);

router.route('/register')
      .get(defaultController.registerGet)
      .post(defaultController.registerPost);
      
 module.exports = router;