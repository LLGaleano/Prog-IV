const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const userService = require('../services/userService');

// Estrategia Local (usuario + contraseña)
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await userService.find(username, password);

                if (!user) {
                    return done(null, false, {
                        message: 'Nombre de usuario o contraseña incorrectos'
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Estrategia JWT (validación de token)
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        async (jwtPayload, done) => {
            try {
                const user = await userService.findById(jwtPayload.id_usuario);

                if (!user) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

module.exports = passport;