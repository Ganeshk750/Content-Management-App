 const express = require("express");
const router = express.Router();
const defaultController = require("../controllers/defaultController");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

router.all("/", (req, res, next) => {
  req.app.locals.layout = "default";

  next();
});
router.route("/")
      .get(defaultController.index);

//Defining Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
},(req, email, password, done) =>{
  User.findOne({email: email}).then(user =>{
    if(!user){
      return done(null, false, req.flash('error-message', 'User not found with this email'));
      }

      bcrypt.compare(password, user.password, (err,passwordMatch) =>{
        if(err) return err;

        if(!passwordMatch){
          return done(null, false, req.flash('error-message', 'Invalid username or password'));
        }
        return done(null, user, req.flash('success-message', 'Login Successfull'));
      });
  });
}));

/* ------------------------------- */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


router
  .route("/login")
  .get(defaultController.loginGet)
  .post(
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: true,
      session: true
    }),
     defaultController.loginPost);

router
  .route("/register")
  .get(defaultController.registerGet)
  .post(defaultController.registerPost);


/* To get single post */
 router
   .route("/post/:id")
   .get(defaultController.SinglePost)
   .post(defaultController.submitComment);

/* Logout */
 router
    .get("/logout", (req,res) =>{
      req.logOut();
      req.flash('success-message','You are logout successfully');
      res.redirect('/');
    })

module.exports = router; 
 

/* const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');


router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'default';

    next();
});

router.route('/')
    .get(defaultController.index);

router.route('/login')
    .get(defaultController.loginGet)
    .post(defaultController.loginPost);


router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

module.exports = router; */
   
