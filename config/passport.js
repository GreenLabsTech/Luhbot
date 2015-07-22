var passport = require('passport'),
  bCrypt = require('bcrypt-nodejs'),
  twitchStrategy = require('passport-twitchtv').Strategy,
  User = require('../modules/users/model');

///////////////////// Strategies ///////////////////////

passport.use(new twitchStrategy({
    clientID: '5ly77uvih89ugnp10vryol48pqlm6no',
    clientSecret:'bnei1h59ilxsp4hmemyezgdgy00fawu',
    callbackURL:"http://localhost:3000/auth/twitch/callback",
    scope: [
      "user_read",
      "user_subscriptions",
      "channel_subscriptions",
      "user_follows_edit",
      "user_blocks_edit",
      "user_blocks_read",
      "channel_check_subscription",
      "chat_login"
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    process.nextTick(function(){
      User.findOne({twitchId: profile.id}, function(err, user){
        if(err){
          return done(err,null);
        }
        if(!user){
          user = {
            twitchId: profile.id,
            twitchUser : profile.username,
            displayName: profile.displayName,
            provider: 'twitch',
            email: profile.email,
            bio: profile.bio
          };
          User.create(user,function(err,doc){
            return done(err,doc)
          });
        }
        return done(err,user);
      });
    });
  }
));
//serializers
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
