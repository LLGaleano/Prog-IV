const express = require('express');
const cors = require('cors');
require('dotenv').config();


const studentRoutes = require('./routes/studentRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');


const pool = require('./db/connection');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/students', studentRoutes);
app.use('/inscripciones', inscripcionRoutes);

pool.connect()
    .then(() => {
        console.log('DB conectada');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = app;