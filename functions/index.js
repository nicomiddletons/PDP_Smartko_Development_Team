// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
app.use( cors( {origin: true} ) );

// Routes
app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello world");
});

// Create
// Post
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("switch").doc("/" + req.body.id + "/")
          .create({
            timestamp: req.body.timestamp,
            temp: req.body.temp,
            humidity: req.body.humidity,
            smoke_level: req.body.smoke_level,
            voltage_phase_1: req.body.voltage_phase_1,
            voltage_phase_2: req.body.voltage_phase_2,
            voltage_phase_3: req.body.voltage_phase_3,
            current_phase_1: req.body.current_phase_1,
            current_phase_2: req.body.current_phase_2,
            current_phase_3: req.body.current_phase_3,
            power_phase_1: req.body.power_phase_1,
            power_phase_2: req.body.power_phase_2,
            power_phase_3: req.body.power_phase_3,
            total_power: req.body.total_power,
          });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


// Read a specific timestamp based on ID
// Get
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("switch").doc(req.params.id);
      const switchData = await document.get();
      const response = switchData.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read all timestamps
// Get
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("switch");
      const response = [];

      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs; // the result of the query

        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            timestamp: doc.data().timestamp,
            temp: doc.data().temp,
            humidity: doc.data().humidity,
            smoke_level: doc.data().smoke_level,
            voltage_phase_1: doc.data().voltage_phase_1,
            voltage_phase_2: doc.data().voltage_phase_2,
            voltage_phase_3: doc.data().voltage_phase_3,
            current_phase_1: doc.data().current_phase_1,
            current_phase_2: doc.data().current_phase_2,
            current_phase_3: doc.data().current_phase_3,
            power_phase_1: doc.data().power_phase_1,
            power_phase_2: doc.data().power_phase_2,
            power_phase_3: doc.data().power_phase_3,
            total_power: doc.data().total_power,
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Update
// Put

// Delete
// Delete


// Export the api to Firebase Cloud Functions
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
