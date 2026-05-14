const express = require('express');
const cors = require('cors');
require('dotenv').config();


const studentRoutes = require('./routes/studentRoutes');


const pool = require('./db/connection');

const app = express();
app.use(express.json())
app.use('/students', studentRoutes);
app.use(cors());
;

pool.connect()
    .then(() => {
        console.log('DB conectada');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = app;