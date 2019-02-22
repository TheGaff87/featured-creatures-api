const express = require('express');
const mongoose = require('mongoose');
/*const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');*/

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL } = require('./config');

const {Encounter} = require('./encounter-models');
const {Zoo} = require('./zoo-models');

const app = express();

app.use(express.json());

/*app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);*/

//get all animals for dropdown
app.get('/api/animals', (req, res) => {
    Encounter
        .distinct('animal')
        .then(animal => {
            res.json({animal});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

//group zoos by country for dropdown
app.get('/api/zoos', (req, res) => {
    Zoo
        .find()
        .sort({country: 1, zooName: 1})
        .then(zoos => {
            res.json({
                zoos: zoos.map(
                    (zoo) => zoo.serialize())
                })
            })

        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
