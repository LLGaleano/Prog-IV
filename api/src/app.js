const express = require('express');
const cors = require('cors');
//require('dotenv').config(); BORRAMOS ESTO PORQUE ES LA CORRECIÓN DE NACHO
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');


const studentRoutes = require('./routes/studentRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const cursosRoutes = require('./routes/cursosRoutes');


const pool = require('./db/connection');

const app = express();
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use('/students', studentRoutes);
app.use('/inscripciones', inscripcionRoutes);
app.use('/cursos', cursosRoutes);
app.use('/auth', authRoutes);

pool.connect()
    .then(() => {
        console.log('DB conectada');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = app;