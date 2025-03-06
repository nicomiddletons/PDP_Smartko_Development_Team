const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});




const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors( { origin:true } ) );

//Routes
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello world');
});

//Create
//Post
app.post('/api/create', (req, res) => {
    
    (async () => {
            try{
                await db.collection('switch').doc('/' + req.body.id + '/')
                .create({
                    timestamp: req.body.timestamp,
                    temp: req.body.temp,
                    humidity: req.body.humidity,
                    smoke_level: req.body.smoke_level
                })

                return res.status(200).send();
            }
            catch(error){
                console.log(error);
                return res.status(500).send(error);
            }
    })();
});


//Read
//Get

//Update
//Put

//Delete
//Delete



//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);





/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
