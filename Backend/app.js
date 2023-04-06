//importation express 
const express = require('express');
// donne accés au chemin du système de fichiers 
const path = require('path');
const app = express();
const mongoose = require('mongoose');
// appel de dotenv qui stocke des variables d'environnement
const dotenv = require('dotenv')
// Sécurise les headers
const helmet = require("helmet");
var sanitizeHtml = require('sanitize-html')
dotenv.config()

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/User');

mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
// le CORS
// Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
app.use((req, res, next) => {
    // origine, droit d'accéder c'est tout le monde '*'
    res.setHeader('Access-Control-Allow-Origin', '*');
    // headers, ce sont les headers acceptés (en-tête)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // les methode accéptés 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// accée au corps de la requette
// middleware intercepte la requete et la transforme au bon format
app.use(express.json());
// middleware de helmet pour Sécurise les headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
const dirty = 'some really tacky HTML';
const clean = sanitizeHtml(dirty);
// middleware routes 
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers
module.exports = app; 
