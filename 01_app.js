var express = require('express');
var app = express();
app.use(express.static('public'));

/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const util = require("util");
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

////////////////////////////////// route accueil
app.get('/', function (req, res) {
	var cursor = db.collection('adresse').find().toArray(function(err, resultat){
		if (err) return console.log(err)

 		console.log('util = ' + util.inspect(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD
		res.render('accueil.ejs', {adresse: resultat})
	}) 
})

app.get('/list', (req, res) => {
 console.log('la route route get / = ' + req.url)
 
 var cursor = db.collection('adresse')
                .find().toArray(function(err, resultat){
 if (err) return console.log(err)
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('adresse.ejs', {adresse: resultat})
 }) 
})

app.post('/ajouter', (req, res) => {
    
    console.log('ajouter util  = ' + util.inspect(req.body));
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/list')
 })
})

app.post('/modifier', (req, res) => {
    
    console.log('ajouter util  = ' + util.inspect(req.body));
    
  req.body._id = ObjectID(req.body._id)  
    
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/list')
 })
})



app.get('/detruire/:id', (req, res) => {
    console.log('route detruire')
 var id = ObjectID(req.params.id)
 console.log('id = ' + id)
 db.collection('adresse').findOneAndDelete({"_id": id}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/list')  // redirige vers la route qui affiche la collection
 })
})

let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})