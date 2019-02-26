'use strict';

const mongoose = require('mongoose');

const encounterSchema = mongoose.Schema({
    animal: {
        type: String,
        required: true
    },
    encounterImage: {
        type: String,
        required: true,
    },
    encounterName: {
        type: String,
        required: true,
    },
    encounterWebsite: {
        type: String
    },
    zooName: {
        type: String,
        required: true,
    },
    zooWebsite: {
        type: String,
        required: true,
    },
    zooCity: {
        type: String,
        required: true
    },
    zooState: {
        type: String,
    },
    zooCountry: {
        type: String,
        required: true
    },
    encounterCost: {
        type: String,
        required: true
    },
    encounterSchedule: {
        type: String,
        required: true
    },
    encounterDescription: {
        type: String,
        required: true
    },
    addedBy: {type: String}
});

encounterSchema.virtual('zooLocation').get(function() {
    let result = '';
    if (this.zooState !== undefined) {
        result = `${this.zooCity}, ${this.zooState}, ${this.zooCountry}`.trim();
    } else {
        result = `${this.zooCity}, ${this.zooCountry}`.trim();
    } 
    return result;
  });

encounterSchema.methods.serialize = function() {
    return {
        id: this._id,
        encounterImage: this.encounterImage,
        encounterName: this.encounterName,
        encounterWebsite: this.encounterWebsite,
        zooName: this.zooName,
        zooWebsite: this.zooWebsite,
        zooLocation: this.zooLocation,
        encounterCost: this.encounterCost,
        encounterSchedule: this.encounterSchedule,
        encounterDescription: this.encounterDescription,
        addedby: this.addedBy
    }
}

const Encounter = mongoose.model('Encounter', encounterSchema);

module.exports = {Encounter};

