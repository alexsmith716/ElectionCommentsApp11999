var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require('./dbConnector.js');

// login authentication passport


module.exports = function() {

  passport.serializeUser(function(user, done) {
    console.log('####### > setuppassport.js > passport.serializeUser')
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('####### > setuppassport.js > passport.deserializeUser')
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy(function(username, password, done) {
    //console.log('####### > setuppassport.js > passport.use')

    User.findOne({ username: username }, function(err, user) {

      //console.log('####### > setuppassport.js > passport.use > User.findOne')
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: "No user has that username!" });
      }

      user.checkPassword(password, function(err, isMatch) {
        //console.log('####### > setuppassport.js > passport.use > user.checkPassword')
        if (err) { return done(err); }

        if (isMatch) {
          console.log('####### > setuppassport.js > passport.use > user.checkPassword > isMatch')
          return done(null, user);

        } else {
          return done(null, false, { message: "Invalid password." });
        }

      });
    });
  }));

};

