// Importer le module express
const express = require('express');
// Importer le module mongoose
const mongoose = require('mongoose');

// ================================================
// Connexion à la base de données
// ================================================
// Quand je suis connecté à la bdd (evenementiel)
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectué");
});

// Quand la bdd aura des erreurs
mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});

// Se connecter sur mongodb (async)
// Ca prend x temps à s'executer
//todo : adapter a la bone bdd
mongoose.connect("mongodb://localhost:27017/tp_cpi");

//todo creer le modele article 
const Article = mongoose.model('Article', { id: Number, title: String, content: String, author: String }, 'articles');

// ================================================
// Instancier un serveur et autoriser envokie json
// ================================================
// Instancier le server grace à express
const app = express();

// AUTORISER LE BACK A RECEVOIR DES DONNEES DANS LE BODY
app.use(express.json());

// ================================================
// Les routes (url/point d'entrée)
// ================================================
app.get('/articles', async (request, response) => {
    const articles = await Article.find();

    if (articles.length == 0){
        return response.json({ code : "701" });
    }

    return response.json(articles); 
});

// ================================================
// Lancer le serveur
// ================================================
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});