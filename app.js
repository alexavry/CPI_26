// Importer le module express
const express = require('express');
// Importer le module mongoose
const mongoose = require('mongoose');

const cors = require('cors');

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
mongoose.connect("mongodb://127.0.0.1:27017/tp_cpi");

//todo creer le modele article 
const Article = mongoose.model('Article', { title: String, content: String, author: String }, 'articles');

// ================================================
// Instancier un serveur et autoriser envokie json
// ================================================
// Instancier le server grace à express
const app = express();
app.use(cors());

// AUTORISER LE BACK A RECEVOIR DES DONNEES DANS LE BODY
app.use(express.json());

// ================================================
// Les routes (url/point d'entrée)
// ================================================

//route pour le get de tous les articles
app.get('/articles', async (request, response) => {
    const articles = await Article.find();

    if (articles.length == 0){
        return response.json({ code : "701" });
    }

    return response.json(articles); 
});
//route pour le get de un article precis
app.get('/article/:id', async (request, response) => {
    const paramID = request.params.id;

    const foundArticle = await Article.findOne({'_id' : paramID});

    if (!foundArticle){
        return response.json({ code : "705" });
    }

    return response.json(foundArticle);

});
//route pour ajouter un article
app.post('/add-article', async (request, response) =>{
    const articleJson = request.body;
    const article = new Article(articleJson);
    await article.save();
    return response.json(article);

});

// Route pour supprimer un article précis
app.delete('/delete-article/:id', async (request, response) => {
    const paramID = request.params.id;

    try {
        const result = await Article.deleteOne({ _id: paramID });
        return response.json({ code: "200", message: "Article supprimé avec succès" });
    } catch (error) {
        console.log("Erreur lors de la suppression de l'article");
        return response.status(500).json({ code: "500", message: "Erreur serveur" });
    }
});
// ================================================
// Lancer le serveur
// ================================================
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});