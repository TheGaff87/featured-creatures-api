'use strict';
const mongoose = require('mongoose');

const {Encounter} = require('./encounter-models')

const ZooSchema = mongoose.Schema({
  zooName: {
      type: String,
      required: true
  },
  country: {
      type: String,
      required: true
  },
  encounters: [{type: mongoose.Schema.Types.ObjectId, ref: 'Encounter'}],
});

ZooSchema.methods.serialize = function() {
  return {
    id: this._id,
    zooName: this.zooName,
    country: this.country,
    encounters: this.encounters
  };
};

const Zoo = mongoose.model('Zoo', ZooSchema);

module.exports = {Zoo};
