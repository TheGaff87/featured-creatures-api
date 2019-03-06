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
   zooLocation: {
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

