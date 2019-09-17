const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("config");

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("googleplus-clientId"),
      clientSecret: config.get("googleplus-clientSecret"),
      callbackURL: config.get("callbackURL")
    },
    (token, refreshToken, profile, done) => {
      var user = {
        profile: {
          name: profile.displayName,
          email: profile.emails[0].value,
          gender: profile.gender
        },
        token: token
      };
      done(null, user);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
