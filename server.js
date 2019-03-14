const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

mongoose.Promise = global.Promise;

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const {PORT, DATABASE_URL } = require('./config');

const {Encounter} = require('./encounter-models');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());

app.use(cors());
app.options('*', cors());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/', jwtAuth, (req, res) => {
    res.json({ok: true});
  });
 
//get all encounters
app.get('/api/encounters', (req, res) => {
  Encounter
    .find()
    .sort({animal: 1})
    .then(encounters => {
      res.json(
        encounters
      )
    })

    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
      });
})

//get all animals for dropdown
app.get('/api/animals', (req, res) => {
    Encounter
        .distinct('animal')
        .then(animal => {
            res.json(animal);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

//get all zoos for dropdown
app.get('/api/zoos', (req, res) => {
    Encounter
        .distinct('zooName')
        .then(zoo => {
            res.json(zoo);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

//encounters for particular animal
app.get('/api/animal/:term', (req, res) => {
    Encounter
        .find({animal: req.params.term})
        .then(encounters => {
            res.json(
              encounters
            );
          })
        
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
            });
    })

//encounters for particular zoo
app.get('/api/zoo/:term', (req, res) => {
    Encounter
        .find({zooName: req.params.term})
        .then(zoos => {
          res.json(
            zoos
          );
        })
        
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
            });
    })

//adds new encounter
app.post('/api/encounters', jwtAuth, (req, res) => {
    const requiredFields = ['animal', 'encounterImage', 'encounterName', 'zooName', 'zooWebsite', 'zooLocation', 'encounterCost', 'encounterSchedule', 'encounterDescription'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Encounter
      .create({
        animal: req.body.animal,
        encounterImage: req.body.encounterImage,
        encounterName: req.body.encounterName,
        encounterWebsite: req.body.encounterWebsite,
        zooName: req.body.zooName,
        zooWebsite: req.body.zooWebsite,
        zooLocation: req.body.zooLocation,
        encounterCost: req.body.encounterCost,
        encounterSchedule: req.body.encounterSchedule,
        encounterDescription: req.body.encounterDescription,
        addedBy: req.body.addedBy
      })
      .then(event => res.status(201).json(event)
    )
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.put('/api/encounters/:id', jwtAuth, (req, res) => {
  
    const updated = {};
    const updateableFields = ['encounterCost', 'encounterSchedule', 'encounterDescription'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    Encounter
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedEncounter => res.status(204).end())
      
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });
  
  
  app.delete('/api/encounters/:id', jwtAuth, (req, res) => {
    Encounter
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted encounter \`${req.params.id}\``);
        res.status(204).end();
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
