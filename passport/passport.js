var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User             = require('../models/user.js');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = 'Pankaj';

module.exports = function(app,passport){

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure:false }
    }));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({username: user.username, email:user.email},secret,{expiresIn: '24h'});
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '352666358609920',
            clientSecret: 'c2838d61c24beece7c3089db97582fa6',
            callbackURL: "https://stark-taiga-43813.herokuapp.com/_oauth/facebook",
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOne({email:profile.emails[0].value}).select('username password email').exec(function(err, user) {
                if (err) { done(err); }

                if(user && user!=null){
                    done(null,user);
                }
                else {
                    done(err);
                }
            });
            // User.findOrCreate(..., function(err, user) {
            //     if (err) { return done(err); }
            //     done(null, user);
            // });
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: '443323453522-r6ovkjm7s92d1r6av1mu0ov8mgecg3da.apps.googleusercontent.com',
            clientSecret: 'kISrPlM4xYRq4tbxhicdTHYj',
            callbackURL: "http://localhost:8000/oauth2callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile.emails[0].value);
            //console.log(profile.name.givenName);
            User.findOne({email:profile.emails[0].value}).select('profile.name.givenName password email').exec(function(err, user) {
                if (err) { done(err); }

                if(user && user!=null){
                    done(null,user);
                }
                else {
                    done(err);
                }
            });
           // done(null,profile);
        }
    ));

    app.get('/_oauth/facebook', passport.authenticate('facebook', { failureRedirect: '/login' }),function(req,res)
    {
        res.redirect('/facebook/'+token);
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' })
    );

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login' , 'profile','email'] }));


    app.get('/oauth2callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
            res.redirect('/google/' + token);
        });

    return passport;
}



// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
