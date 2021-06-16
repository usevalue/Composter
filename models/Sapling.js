import mongoose from 'mongoose'
import {distance} from '@turf/turf'

const saplingSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'A new sapling.'
    },
    position: {
        type: [Number],
        required: true
    },
    welcome: {
        type: String,
        default: 'Type a description of the location'
    }
});

saplingSchema.methods.distanceTo = function (coords) {
    return distance(this.position, coords);
}

let Sapling;

try {
    Sapling = mongoose.model('Sapling')
}
catch(e) {
    Sapling = mongoose.model('Sapling',saplingSchema,'saplings')
}

module.exports = Sapling