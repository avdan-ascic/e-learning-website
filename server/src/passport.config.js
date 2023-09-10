import { Strategy as JwtStrategy } from "passport-jwt"
import passport from "passport"

import User from './models/user.model'
import config from './config'

let opts = {}
opts.jwtFromRequest = function (req) {
  let token = null
  if (req && req.cookies) token = req.cookies.token
  return token
}
opts.secretOrKey = config.jwt_secret

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  User.findById(jwt_payload.id)
    .then(user => {
      if (!user) return done(null, false)
      return done(null, user)
    })
    .catch(err => done(err, false))
}))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
})