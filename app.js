var express = require('express');
var express_session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongoose = require("mongoose");

require("./models");

var User = mongoose.model("User");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express_session({ secret: 'smokjsdhf9798' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: "348578123862-e5sq0g0e056d8l8nq8835u2s5nvc8s2n.apps.googleusercontent.com",
    clientSecret: "bIMkioS2sH5XwuacJClhr9-e",
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.find({googleId: profile.id}, function(err, users){
        if (users.length > 0) {
            var user = users[0];
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;

            user.save(function(err){
                done(err, user);
            });
        } else {
            var user = new User({
                googleId: profile.id,
                accessToken:accessToken,
                refreshToken:refreshToken,
                displayName: profile.displayName,
                email: profile.emails[0].value
            });

            user.save(function(err, user){
                done(err, user);
            });
        }
    });
    
  }
));

app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google', passport.authenticate('google', {session:true ,
                                    scope: ["openid", "profile", "email", "https://www.googleapis.com/auth/calendar.readonly"]}));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login'}));

app.use('/', routes);
app.use('/users', users);
app.use('/events', require('./routes/events'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
