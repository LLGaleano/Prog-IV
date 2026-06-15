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

            const accessToken = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    nombre_usuario: user.nombre_usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1h'
                }
            );
            
            const refreshToken = jwt.sign(
                {
                    id_usuario: user.id_usuario,
                    nombre_usuario: user.nombre_usuario
                },
                process.env.JWT_REFRESH_SECRET,
                {
                    expiresIn: '7d'
                }
            );
            
            return res.status(200).json({
                accessToken,
                refreshToken
            });
        }
    )(req, res);
};

const refreshToken = (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            error: 'Refresh token requerido'
        });
    }

    try {

        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
            {
                id_usuario: payload.id_usuario
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            accessToken: newAccessToken
        });

    } catch {

        return res.status(403).json({
            error: 'Refresh token inválido'
        });

    }

};

module.exports = {
    login,
    refreshToken
};