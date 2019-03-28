'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Encounter } = require('../encounter-models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedData() {
    const encounterData = [
        {
            "animal": "KANGAROO",
            "encounterImage": "images/kangaroo-feeding.jpeg",
            "encounterName": "Kangaroo Feeding",
            "zooName": "FEATHERDALE WILDLIFE PARK",
            "zooWebsite": "https://www.featherdale.com.au/",
            "zooLocation": "Sydney, Australia",
            "encounterCost": "Free",
            "encounterSchedule": "Everyday",
            "encounterDescription": "Visitors can buy kangaroo feed for $2 and hand feed the kangaroos inside their enclosure."
        },
        {
            "animal": "KOALA",
            "encounterImage": "images/koala-encounter.jpeg",
            "encounterName": "Koala Encounter",
            "zooName": "FEATHERDALE WILDLIFE PARK",
            "zooWebsite": "https://www.featherdale.com.au/",
            "zooLocation": "Sydney, Australia",
            "encounterCost": "$25 AUD",
            "encounterSchedule": "Everyday",
            "encounterDescription": "Visitors pose for a photo with a koala. You may pet the koala, but it is illegal to hold koalas without the proper certification in New South Wales."
        },
        {
            "animal": "PENGUIN",
            "encounterImage": "images/penguin-encounter.jpeg",
            "encounterName": "Penguins Close-up Tour",
            "encounterWebsite": "https://seaworld.com/san-diego/experiences/penguins-up-close-tour/",
            "zooName": "SEAWORLD SAN DIEGO",
            "zooWebsite": "https://seaworld.com/san-diego/",
            "zooLocation": "San Diego, CA, USA",
            "encounterCost": "$80 USD",
            "encounterSchedule": "Everyday",
            "encounterDescription": "Visitors enter the penguin enclosure and receive in-depth information on penguin care from the keepers. Guests also go behind-the-scenes to see and pet a penguin up close."
        }
    ];
    return Encounter.insertMany(encounterData);
}
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWM3OTgzODI1NjAyMTQwMDE3OTZmYmY1IiwidXNlcm5hbWUiOiJ1c2VyMSJ9LCJpYXQiOjE1NTE0Njc0MTUsImV4cCI6MTU1NDA1OTQxNSwic3ViIjoidXNlcjEifQ.WcY9URw-aw5sn14H9KEqW3XIozealU3GZwoVHpgkMJ4'

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Featured Creatures API', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET /api/animals', function () {

        it('should return all animals in database', function () {
            let res;
            return chai.request(app)
                .get('/api/animals')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.lengthOf.at.least(1);
                });
        });

    })

        describe('GET /api/zoos', function () {

            it('should return all zoos in the database', function () {
                let res;
                return chai.request(app)
                    .get('/api/zoos')
                    .then(function (_res) {
                        res = _res;
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.lengthOf.at.least(1);
                    })
            });
        });

        describe('GET /api/encounters', function () {

            it('should return all encounters in database', function () {
                let res;
                return chai.request(app)
                    .get('/api/encounters')
                    .then(function (_res) {
                        res = _res;
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.lengthOf.at.least(1);
                        })
                    })
            });


            it('should return encounters with correct fields', function () {

                let resEvent;;
                return chai.request(app)
                    .get('/api/encounters')
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);

                        res.body.forEach(function (encounter) {
                            expect(encounter).to.be.a('object');
                            expect(encounter).to.include.keys(
                                '_id', 'animal', 'encounterImage', 'encounterName', 'zooName', 'zooWebsite', 'zooLocation', 'encounterCost', 'encounterSchedule', 'encounterDescription');
                        });
                    })
            });


        describe('GET /api/animal/:term', function () {

            it('should return all encounters for particular animal', function () {
                let res;
                return chai.request(app)
                    .get('/api/animal/KANGAROO')
                    .then(function (_res) {
                        res = _res;
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.lengthOf.at.least(1);
                        })
                    })
            });


            it('should return encounters with correct fields', function () {

                let resEvent;
                let selectedAnimal = 'KANGAROO';
                return chai.request(app)
                    .get('/api/animal/' + selectedAnimal)
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);

                        res.body.forEach(function (encounter) {
                            expect(encounter).to.be.a('object');
                            expect(encounter).to.include.keys(
                                '_id', 'animal', 'encounterImage', 'encounterName', 'zooName', 'zooWebsite', 'zooLocation', 'encounterCost', 'encounterSchedule', 'encounterDescription');
                            expect(encounter.animal).to.equal(selectedAnimal);
                        });
                    })
            });

        describe('GET /api/zoo/:term', function () {

            it('should return all encounters for particular zoo', function () {
                let res;
                return chai.request(app)
                    .get('/api/zoo/SEAWORLD SAN DIEGO')
                    .then(function (_res) {
                        res = _res;
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.lengthOf.at.least(1);
                    })
                })
            


            it('should return encounters with correct fields', function () {

                let resEvent;
                let selectedZoo = 'SEAWORLD SAN DIEGO';
                return chai.request(app)
                    .get('/api/zoo/' + selectedZoo)
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf.at.least(1);

                        res.body.forEach(function (encounter) {
                            expect(encounter).to.be.a('object');
                            expect(encounter).to.include.keys(
                                '_id', 'animal', 'encounterImage', 'encounterName', 'zooName', 'zooWebsite', 'zooLocation', 'encounterCost', 'encounterSchedule', 'encounterDescription');
                        });
                    })
            });
        });

        describe('POST /api/encounters', function () {
            it('should add a new event', function () {

                const newEncounter = {
                    "animal": "Dolphin",
                    "encounterImage": "images/dolphin-encounter.jpeg",
                    "encounterName": "Dolphin Encounter",
                    "encounterWebsite": "https://seaworld.com/san-diego/experiences/dolphin-encounter/",
                    "zooName": "SeaWorld San Diego",
                    "zooWebsite": "https://seaworld.com/san-diego/",
                    "zooLocation": "San Diego, CA, USA",
                    "encounterCost": "$80 USD",
                    "encounterSchedule": "Everyday",
                    "encounterDescription": "Visitors have an opportunity to touch and feed bottlenose dolphins, as well as learn different hand signals used to communicate with these animals.",
                };

                return chai.request(app)
                    .post('/api/encounters')
                    .set('Authorization', token)
                    .send(newEncounter)
                    .then(function (res) {
                        expect(res).to.have.status(201);
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('object');
                        expect(res.body).to.include.keys(
                            '_id', 'encounterImage', 'encounterName', 'zooName', 'zooWebsite', 'zooLocation', 'encounterCost', 'encounterSchedule', 'encounterDescription');
                        expect(res.body._id).to.not.be.null;
                    })
            });
        });

        describe('PUT /api/encounters/:id', function () {

            it('should update fields you send over', function () {
                const updateData = {
                    encounterSchedule: "Monday, Wednesday"
                };

                return Encounter
                    .findOne()
                    .then(function (encounter) {
                        updateData.id = encounter.id;

                        return chai.request(app)
                            .put(`/api/encounters/${encounter.id}`)
                            .set('Authorization', token)
                            .send(updateData);
                    })
                    .then(function (res) {
                        expect(res).to.have.status(204);

                        return Encounter.findById(updateData.id);
                    })
                    .then(function (encounter) {
                        expect(encounter.encounterSchedule).to.equal(updateData.encounterSchedule);
                    });
            });
        });

        describe('DELETE /api/encounters/:id', function () {

            it('delete an encounter by id', function () {

                let encounter;

                return Encounter
                    .findOne()
                    .then(function (_encounter) {
                        encounter = _encounter;
                        return chai.request(app).delete(`/api/encounters/${encounter.id}`)
                            .set('Authorization', token)
                    })
                    .then(function (res) {
                        expect(res).to.have.status(204);
                        return Encounter.findById(encounter.id);
                    })
                    .then(function (_encounter) {
                        expect(_encounter).to.be.null;
                    });
            });
        });
    });
