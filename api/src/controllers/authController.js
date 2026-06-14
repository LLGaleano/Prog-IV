const passport = require('passport');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    passport.authenticate(
        'local',
        { session: false },
        (err, user, info) => {

            if (err || !user) {
                return res.status(401).json({
                    error: info?.message || 'Credenciales inválidas'
                });
            }

            const token = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    nombre_usuario: user.nombre_usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1h'
                }
            );

            return res.status(200).json({
                token
            });
        }
    )(req, res);
};

module.exports = {
    login
};